import { useCallback } from "react";
import { useCartStore } from "../store/use-cart-store";
import { useShallow } from "zustand/react/shallow";
export const useCart = (tenantSlug: string) => {
  // Uses a direct selector instead of destructuring like this {addProduct} = useCartStore() to keep the function reference stable.
  // This prevents triggering unnecessary useEffect re-runs and avoids infinite render loops in CheckoutView.
  const addProduct = useCartStore((state) => state.addProduct);
  const removeProduct = useCartStore((state) => state.removeProduct);
  const clearCart = useCartStore((state) => state.clearCart);
  const clearAllCarts = useCartStore((state) => state.clearAllCarts);

  // #region useShallow: Reference vs Value Comparison
  // This selector fetches productIds. We use useShallow to enforce a value-based comparison.
  //
  // HOW IT WORKS:
  // - If NO actual changes occur inside the array, useShallow forces Zustand to keep the
  //   OLD reference stable, completely killing unnecessary cascade re-renders.
  // - If an actual change occurs (adding/removing items), it detects the new values,
  //   allows the reference to update, and triggers the re-render normally to update the UI.
  // #endregion
  const productIds = useCartStore(
    useShallow((state) => state.tenantCarts[tenantSlug]?.productIds || []),
  ); // get all product ids

  //Extended logic
  const toggleProduct = useCallback(
    (productId: string) => {
      if (productIds.includes(productId)) {
        removeProduct(tenantSlug, productId);
      } else {
        addProduct(tenantSlug, productId);
      }
    },
    [addProduct, removeProduct, productIds, tenantSlug],
  );

  //Extended logic
  const isProductInCart = useCallback(
    (productId: string) => {
      // we treat one tenantSlug here
      return productIds.includes(productId);
    },
    [productIds],
  );

  //Extended logic
  const clearTenantCart = useCallback(() => {
    clearCart(tenantSlug);
  }, [clearCart, tenantSlug]);

  //Extended logic
  const handleAddProduct = useCallback(
    (productId: string) => {
      addProduct(tenantSlug, productId);
    },
    [addProduct, tenantSlug],
  );

  //Extended logic
  const handleRemoveProduct = useCallback(
    (productId: string) => {
      removeProduct(tenantSlug, productId);
    },
    [removeProduct, tenantSlug],
  );

  return {
    productIds,
    addProduct: handleAddProduct, //Extended logic here
    removeProduct: handleRemoveProduct, //Extended logic here
    clearCart: clearTenantCart, //Extended logic here
    clearAllCarts, //direct from the store
    toggleProduct, //Extended logic here
    isProductInCart, //Extended logic here
    totalItems: productIds.length,
  };
};
