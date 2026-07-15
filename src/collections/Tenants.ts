import { isSuperAdmin } from "@/lib/access";
import type { CollectionConfig } from "payload";

export const Tenants: CollectionConfig = {
  slug: "tenants",
  admin: {
    useAsTitle: "slug",
  },
  access: {
    create: ({ req: { user } }) => isSuperAdmin(user),
    delete: ({ req: { user } }) => isSuperAdmin(user),
  },
  fields: [
    {
      name: "name",
      required: true,
      type: "text",
      label: "Store Name",
      admin: {
        description: "This is the name of the store (e.q Beshoy's Store)",
      },
    },
    {
      name: "slug",
      type: "text",
      index: true,
      required: true,
      unique: true,
      access: {
        update: ({ req: { user } }) => isSuperAdmin(user),
      },
      admin: {
        description: "This is subdomain for the store (e.q [slug].sellroad.com",
      },
    },
    {
      name: "image", //each store will have an image
      type: "upload",
      relationTo: "media",
    },
    {
      name: "stripeAccountId", //Populated by stripe
      type: "text",
      required: true,
      access: {
        // give access to (update) only & for the (create) it will be populated through stripe for the (normal user)
        update: ({ req: { user } }) => isSuperAdmin(user),
      },
      admin: {
        description: "Stripe Account ID associated with your shop",
      },
    },
    {
      name: "stripeDetailsSubmitted", //Populated by stripe
      type: "checkbox",
      admin: {
        readOnly: true,
        description:
          "You cannot create products until you submit your Stripe details",
      },
    },
  ],
};
