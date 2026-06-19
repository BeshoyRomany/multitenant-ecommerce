import { useCartStore } from "../store/use-cart-store";

export const useCart = (tenantSlug: string) => {
  const {
    getCartByTenant,
    addProduct,
    removeProduct,
    clearCart,
    clearAllCarts,
  } = useCartStore();

  const productIds = getCartByTenant(tenantSlug); // get all product ids

  //Extended logic
  const toggleProduct = (productId: string) => {
    if (productIds.includes(productId)) {
      removeProduct(tenantSlug, productId);
    } else {
      addProduct(tenantSlug, productId);
    }
  };

  //Extended logic
  const isProductInCart = (productId: string) => {
    // we treat one tenantSlug here
    return productIds.includes(productId);
  };

  //Extended logic
  const clearTenantCart = () => {
    clearCart(tenantSlug);
  };

  return {
    productIds,
    //Extended the direct store function
    addProduct: (productId: string) => addProduct(tenantSlug, productId),
    //Extended the direct store function
    removeProduct: (productId: string) => removeProduct(tenantSlug, productId),
    clearCart: clearTenantCart, //Extended logic here
    clearAllCarts, //direct from the store
    toggleProduct, //Extended logic here
    isProductInCart, //Extended logic here
    totalItems: productIds.length,
  };
};
