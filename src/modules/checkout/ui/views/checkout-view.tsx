"use client";

import { generateTenantURL } from "@/lib/utils";
import { useSyncCart } from "../../hooks/use-sync-cart";
import { CheckoutItem } from "../components/checkout-item";
import { CheckoutSidebar } from "../components/checkout-sidebar";
import { InboxIcon, LoaderIcon } from "lucide-react";

interface CheckoutViewProps {
  tenantSlug: string;
}

export const CheckoutView = ({ tenantSlug }: CheckoutViewProps) => {
  const { data, totalPrice, isLoading, totalDocs, removeProduct } =
    useSyncCart(tenantSlug);

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
            onCheckout={() => alert("I'm gonna checkout!")}
            isCanceled={false}
            isPending={false}
          />
        </div>
      </div>
    </div>
  );
};
