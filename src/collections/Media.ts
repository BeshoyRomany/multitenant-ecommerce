import { isSuperAdmin } from "@/lib/access";
import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",

  access: {
    read: async ({ req: { user, payload }, id, data }) => {
      //#region 1. Resolve Media File ID
      // Resolve the Media document ID. Direct file requests might send the filename
      // instead of the ID, so we query the database using the cleaned filename.
      //#endregion
      let mediaId = id;

      if (!mediaId && data?.filename) {
        const cleanFilename = data.filename.replace(
          /-\d+x\d+(\.[a-zA-Z0-9]+)$/,
          "$1",
        );

        // Optimized query: limited to 1 result and disabled pagination for performance
        const foundMedia = await payload.find({
          collection: "media",
          where: {
            or: [
              { filename: { equals: data.filename } },
              { filename: { equals: cleanFilename } },
            ],
          },
          limit: 1,
          pagination: false,
          overrideAccess: true,
        });

        mediaId = foundMedia.docs[0]?.id;
      }

      // Deny access if no media record was found
      if (!mediaId) return false;

      //#region 2. Check Protected Content (RichText Only)
      // Search products to determine if this file is embedded INSIDE RichText content
      //#endregion
      const productsWithProtectedContent = await payload.find({
        collection: "products",
        where: {
          or: [
            { "content.root.children.value": { equals: mediaId } },
            { "content.root.children.children.value": { equals: mediaId } },
            {
              "content.root.children.children.children.value": {
                equals: mediaId,
              },
            },
          ],
        },
        limit: 10,
        pagination: false,
        overrideAccess: true,
      });

      // Public Access: If the image is NOT part of RichText content (e.g., product cover or card image),
      // grant public access immediately without further security checks.
      if (productsWithProtectedContent.docs.length === 0) {
        return true;
      }

      //#region 3. Apply Strict Security (Protected RichText Content)
      // Unauthenticated guest requests are rejected for protected RichText images
      //#endregion
      if (!user) return false;

      //#region 4. Check Super Admin Access
      if (isSuperAdmin(user)) return true;

      //#region 5. Check Merchant / Tenant Ownership Access
      // Grant access if the user belongs to the tenant that owns the associated product
      //#endregion
      const userTenantId = user?.tenants?.[0]?.tenant
        ? typeof user.tenants[0].tenant === "object"
          ? user.tenants[0].tenant.id
          : user.tenants[0].tenant
        : null;

      const isOwner = productsWithProtectedContent.docs.some((product) => {
        const productTenantId =
          typeof product.tenant === "object"
            ? product.tenant?.id
            : product.tenant;

        return userTenantId && productTenantId === userTenantId;
      });

      if (isOwner) return true;

      //#region 6. Check Customer Purchase Access
      // Grant access if the user has an order for any product linked to this media file
      //#endregion
      const productIds = productsWithProtectedContent.docs.map(
        (prod) => prod.id,
      );

      const purchasedOrder = await payload.find({
        collection: "orders",
        where: {
          and: [{ user: { equals: user.id } }, { product: { in: productIds } }],
        },
        limit: 1,
        pagination: false,
        overrideAccess: true,
      });

      return purchasedOrder.docs.length > 0;
    },

    delete: ({ req: { user } }) => isSuperAdmin(user),
  },
  admin: {
    hidden: ({ user }) => !isSuperAdmin(user),
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
  ],
  upload: {
    staticDir: "media",
  },
};
