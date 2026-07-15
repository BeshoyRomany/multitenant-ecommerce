import { isSuperAdmin } from "@/lib/access";
import { Tenant } from "@/payload-types";
import { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  access: {
    create: ({ req: { user } }) => {
      // #region PRODUCT CREATION ACCESS CONTROL
      /**
       * Who can create products?
       * 1. Super Admins (Always allowed).
       * 2. Regular Users/Merchants ONLY IF they completed their Stripe Connect onboarding
       * (i.e., stripeDetailsSubmitted is true) so they can safely receive payouts.
       */
      // #endregion
      if (isSuperAdmin(user)) return true;
      const tenant = user?.tenants?.[0]?.tenant as Tenant;
      return Boolean(tenant?.stripeDetailsSubmitted);
    },
  },
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
      name: "cover",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "refundPolicy",
      type: "select",
      options: ["30-day", "14-day", "7-day", "3-day", "1-day", "no-refunds"],
      defaultValue: "30-day",
    },
    {
      // #region PROTECTED CONTENT ACCESS
      /**
       * Like a Udemy Course:
       * - Sellers can edit it here in the Dashboard.
       * - Customers can ONLY see it after a successful purchase.
       * - Public/Guests see absolutely nothing (Returns null).
       */
      // #endregion
      name: "content",
      //TODO: Change to RichText
      type: "textarea",
      admin: {
        description:
          "Protective content only visible to customer after purchase. Add product documentation, downloadable files, getting started guides and bonus materials. Supports Markdown formatting",
      },
    },
  ],
};
