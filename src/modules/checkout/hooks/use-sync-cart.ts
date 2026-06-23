"use client";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useCart } from "./use-cart";
import { toast } from "sonner";

export const useSyncCart = (tenantSlug: string) => {
  const cart = useCart(tenantSlug);
  const trpc = useTRPC();

  const { data, isLoading, error } = useQuery(
    trpc.checkout.getProducts.queryOptions(
      { ids: cart.productIds },
      {
        staleTime: 0,
        // enabled: cart.productIds.length > 0,
      },
    ),
  );

  useEffect(() => {
    if (data && data.totalDocs !== cart.productIds.length) {
      const availableIds = data.docs.map((doc) => doc.id);
      const missingCount = cart.productIds.length - data.totalDocs;

      toast.info(
        `Cart updated. ${missingCount} unavailable item${missingCount > 1 ? "s" : ""} removed.`,
      );
      cart.productIds.forEach((id) => {
        if (!availableIds.includes(id)) {
          cart.removeProduct(id);
        }
      });
    }
  }, [data, cart.productIds, cart.removeProduct]);

  return {
    ...cart,
    totalPrice: data?.totalPrice as number,
    data: data?.docs,
    totalDocs: data?.totalDocs,
    isLoading,
    error,
  };
};
