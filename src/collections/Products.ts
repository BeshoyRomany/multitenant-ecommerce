import { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
  },
  labels: {
    singular: {
      en: "Product",
      ar: "منتج",
    },
    plural: {
      en: "Products",
      ar: "المنتجات",
    },
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: {
        en: "Product Name",
        ar: "اسم المنتج",
      },
    },
    {
      name: "description",
      type: "text",
      label: {
        en: "Description",
        ar: "الوصف",
      },
    },
    {
      name: "price",
      type: "number",
      required: true,
      label: {
        en: "Price",
        ar: "السعر",
      },
      admin: {
        description: "In USD",
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      hasMany: false,
      // filterOptions: () => {
      //   return {
      //     parent: {
      //       exists: false, // return the category if it doesn't have a parent (main category) to avoid showing subcategories in the category filter options
      //     },
      //   };
      // },
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "refundPolicy",
      type: "select",
      options: ["30-day", "14-day", "7-day", "3-day", "1-day", "no-refunds"],
      defaultValue: "30-day",
    },
  ],
};
