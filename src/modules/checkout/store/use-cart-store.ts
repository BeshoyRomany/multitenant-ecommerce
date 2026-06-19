import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware"; //middleware extension

interface TenantCart {
  productIds: string[];
}

interface CartSate {
  tenantCarts: Record<string, TenantCart>; //define the key [tenantSlug] & value [productIds array[]]
  /*
    Example:
    {
    "tenantCarts": 
        {
            "adidas": { "productIds": ["prod_1", "prod_2"] },
            "nike":   { "productIds": ["prod_3"] }
        }
    }
*/
  addProduct: (tenantSlug: string, productId: string) => void;
  removeProduct: (tenantSlug: string, productId: string) => void;
  clearCart: (tenantSlug: string) => void;
  getCartByTenant: (tenantSlug: string) => string[];
  clearAllCarts: () => void;
}

export const useCartStore = create<CartSate>()(
  persist(
    (set, get) => ({
      tenantCarts: {},
      addProduct: (tenantSlug, productId) =>
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts, // (1) preserve the old values {tenantCarts}
            // (2) choose the current tenant we need to edit by key [tenantSlug]
            [tenantSlug]: {
              // (3) create a new object holds the new value for this current tenantSlug
              productIds: [
                //(4) overwrite the productsIds array[] that inside this current [tenantSlug]
                //(5) preserve the current tenantSlug product ids if it's exist || return []
                // (6) add the new product id fot the same tenant based on the tenant slug
                ...(state.tenantCarts[tenantSlug]?.productIds || []),
                productId,
              ],
            },
          },
        })),
      removeProduct: (tenantSlug, productId) =>
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSlug]: {
              productIds:
                state.tenantCarts[tenantSlug]?.productIds.filter(
                  (id) => id !== productId,
                ) || [],
            },
          },
        })),
      clearCart: (tenantSlug) =>
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSlug]: {
              productIds: [], // empty all the products for this tenantSlug
            },
          },
        })),
      clearAllCarts: () =>
        set({
          tenantCarts: {},
        }),
      getCartByTenant: (tenantSlug) =>
        get().tenantCarts[tenantSlug]?.productIds || [],
    }),
    {
      name: "sellroad-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
