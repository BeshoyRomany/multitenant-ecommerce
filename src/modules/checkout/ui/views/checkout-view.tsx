"use client";
import { generateTenantURL } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InboxIcon, LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useCheckoutState } from "../../hooks/use-checkout-states";
import { useSyncCart } from "../../hooks/use-sync-cart";
import { CheckoutItem } from "../components/checkout-item";
import { CheckoutSidebar } from "../components/checkout-sidebar";

interface CheckoutViewProps {
  tenantSlug: string;
}

export const CheckoutView = ({ tenantSlug }: CheckoutViewProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [states, setStates] = useCheckoutState();
  const {
    data,
    totalPrice,
    isLoading,
    totalDocs,
    removeProduct,
    productIds,
    clearCart,
    trpc,
  } = useSyncCart(tenantSlug);

  const purchase = useMutation(
    trpc.checkout.purchase.mutationOptions({
      onMutate: () => {
        setStates({ success: false, cancel: false });
      },
      onSuccess: (data) => {
        //purchase url has been created -> will direct user to payment page
        window.location.href = data.url;
      },
      onError: (error) => {
        // handle tRPC Error
        if (error.data?.code === "UNAUTHORIZED") {
          //TODO: Modify when subdomains enabled
          router.push("/sign-in");
        }
        toast.error(error.message);
      },
    }),
  );

  useEffect(() => {
    if (states.success) {
      // setStates({ success: false, cancel: false });
      clearCart();
      queryClient.invalidateQueries(trpc.library.getMany.infiniteQueryFilter());
      router.push("/library");
    }
  }, [
    states.success,
    clearCart,
    setStates,
    router,
    queryClient,
    trpc.library.getMany,
  ]);

  if (isLoading) {
    return (
      <div className="pt-4 px-4 lg:px-12 lg:pt-16">
        <div className="border border-black flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
          <LoaderIcon className="text-muted-foreground animate-spin" />
        </div>
      </div>
    );
  }

  if (totalDocs === 0) {
    return (
      <div className="pt-4 px-4 lg:px-12 lg:pt-16">
        <div className="border border-black flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
          <InboxIcon />
          <p className="text-base font-medium">No products found </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 px-4 lg:px-12 lg:pt-16">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="border rounded-md overflow-hidden bg-white">
            {data?.map((product, index) => (
              <CheckoutItem
                key={product.id}
                isLast={index === data.length - 1}
                imageUrl={product.image?.url}
                name={product.name}
                productUrl={`${generateTenantURL(product.tenant.slug)}/products/${product.id}`}
                tenantUrl={generateTenantURL(product.tenant.slug)}
                tenantName={product.tenant.name}
                price={product.price}
                onRemove={() => removeProduct(product.id)}
              />
            ))}
          </div>
        </div>
        <div className="lg:col-span-3">
          <CheckoutSidebar
            total={totalPrice}
            onPurchase={() => purchase.mutate({ productIds, tenantSlug })}
            isCanceled={states.cancel}
            disabled={purchase.isPending}
          />
        </div>
      </div>
    </div>
  );
};
