import { isSuperAdmin } from "@/lib/access";
import type { CollectionConfig } from "payload";

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: ({ req: { user } }) => isSuperAdmin(user),
    create: ({ req: { user } }) => isSuperAdmin(user),
    update: ({ req: { user } }) => isSuperAdmin(user),
    delete: ({ req: { user } }) => isSuperAdmin(user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
    },
    {
      name: "product",
      type: "relationship",
      relationTo: "products",
      required: true,
      // hasMany: false allows treats each record as a single item in the invoice.
      // This simplifies granting granular user access, handling individual product refunds,
      // and maps perfectly to Stripe's line_items array during webhook processing.
      hasMany: false,
    },
    {
      name: "stripeCheckoutSessionId",
      type: "text",
      required: true,
      admin: {
        description: "Stripe checkout session associated with this order",
      },
    },
    // #region Why Save stripeAccountId?
    /*
     * We save the merchant's Stripe Account ID alongside the order
     * so that in the future, if we need to retrieve this session or process
     * a refund, we can prove to Stripe which connected account to look inside.
     */
    // #endregion
    {
      name: "stripeAccountId",
      type: "text",
      admin: {
        description: "Stripe account associated with this order",
      },
    },
  ],
};
