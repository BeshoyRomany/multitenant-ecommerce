import { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",

  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "text",
    },
  ],
};
