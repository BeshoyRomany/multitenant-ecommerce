"use client";
import { Button } from "@/components/ui/button";
import { DEFAULT_PAGINATION_LIMIT } from "@/constants";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { InboxIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ProductCard, ProductCardSkeleton } from "./product-card";

const MAX_POLLING_ATTEMPTS = 8; // ~16 seconds at 2s intervals

export const ProductList = () => {
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
        //#region Polling to handle Stripe webhook race condition
        refetchInterval: (query) => {
          const hasProducts = query.state.data?.pages?.[0]?.docs?.length ?? 0;
          return hasProducts > 0 ? false : 2000;
        },
        //#endregion
      },
    ),
  );

  const hasProducts = (data?.pages?.[0]?.docs.length ?? 0) > 0;

  //#region Track polling attempts to show skeleton instead of "empty" while waiting
  const attemptsRef = useRef(0);
  const [isPollingExhausted, setIsPollingExhausted] = useState(false);

  useEffect(() => {
    if (hasProducts) return; // stop tracking once we have data

    attemptsRef.current += 1;
    if (attemptsRef.current >= MAX_POLLING_ATTEMPTS) {
      setIsPollingExhausted(true);
    }
    // dataUpdatedAt changes every time a refetch completes (even if data is the same),
    // so this effect re-runs on every polling cycle.
  }, [dataUpdatedAt, hasProducts]);
  //#endregion

  if (!hasProducts) {
    // Still polling and haven't given up yet → show skeleton, not "empty"
    if (!isPollingExhausted) {
      return <ProductListSkeleton />;
    }

    // Genuinely empty (polling exhausted, still no products)
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
