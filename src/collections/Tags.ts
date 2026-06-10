import type { CollectionConfig } from "payload";

export const Tags: CollectionConfig = {
  slug: "tags",
  admin: {
    useAsTitle: "name",
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
