"use client";
import { Button } from "@/components/ui/button";
import { DEFAULT_PAGINATION_LIMIT } from "@/constants";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { InboxIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ProductCard, ProductCardSkeleton } from "./product-card";
import { useCheckoutState } from "@/modules/checkout/hooks/use-checkout-states";

const MAX_POLLING_ATTEMPTS = 8; // ~16 seconds at 2s intervals

export const ProductList = () => {
  const [states] = useCheckoutState();
  const isFromCheckout = states.fromCheckout;

  const trpc = useTRPC();
  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    dataUpdatedAt,
  } = useSuspenseInfiniteQuery(
    trpc.library.getMany.infiniteQueryOptions(
      { limit: DEFAULT_PAGINATION_LIMIT },
      {
        getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
        refetchInterval: (query) => {
          const hasProducts = query.state.data?.pages?.[0]?.docs?.length ?? 0;
          return hasProducts > 0 ? false : 2000;
        },
      },
    ),
  );

  const hasProducts = (data?.pages?.[0]?.docs.length ?? 0) > 0;

  const attemptsRef = useRef(0);
  const [isPollingExhausted, setIsPollingExhausted] = useState(!isFromCheckout);

  // Only track polling attempts when arriving right after a successful checkout.
  // The webhook that creates the Order in the DB travels through a separate
  // Stripe → server request, so it may not have arrived yet when this page loads.
  // This counts each refetch attempt (via dataUpdatedAt) until either the product
  // shows up (hasProducts) or we give up after MAX_POLLING_ATTEMPTS.
  useEffect(() => {
    if (!isFromCheckout) return;
    if (hasProducts) return;

    attemptsRef.current += 1;
    if (attemptsRef.current >= MAX_POLLING_ATTEMPTS) {
      setIsPollingExhausted(true);
    }
  }, [dataUpdatedAt, hasProducts, isFromCheckout]);

  if (!hasProducts) {
    if (!isPollingExhausted) {
      return <ProductListSkeleton />;
    }
    return (
      <div className="border border-black flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
        <InboxIcon />
        <p className="text-base font-medium">No products found </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {data?.pages
          .flatMap((page) => page.docs)
          .map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              imageUrl={product.image?.url}
              tenantSlug={product.tenant.slug}
              tenantImageUrl={product.tenant?.image?.url}
              reviewCount={product.reviewCount}
              reviewRating={product.reviewRating}
              price={product.price}
            />
          ))}
      </div>
      <div className="flex justify-center pt-8">
        {hasNextPage && (
          <Button
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            className="font-medium disabled:opacity-50 text-base bg-white"
            variant="elevated"
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </Button>
        )}
      </div>
    </>
  );
};

export const ProductListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {Array.from({ length: DEFAULT_PAGINATION_LIMIT }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};
