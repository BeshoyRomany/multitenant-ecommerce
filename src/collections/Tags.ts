import { isSuperAdmin } from "@/lib/access";
import type { CollectionConfig } from "payload";

export const Tags: CollectionConfig = {
  slug: "tags",
  access: {
    read: () => true,
    create: ({ req: { user } }) => isSuperAdmin(user),
    update: ({ req: { user } }) => isSuperAdmin(user),
    delete: ({ req: { user } }) => isSuperAdmin(user),
  },
  admin: {
    useAsTitle: "name",
    hidden: ({ user }) => !isSuperAdmin(user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "products",
      type: "join",
      collection: "products",
      on: "tags",
      admin: {
        allowCreate: false,
        description: "Select the Tag from the (Products) only.",
      },
    },
  ],
};
