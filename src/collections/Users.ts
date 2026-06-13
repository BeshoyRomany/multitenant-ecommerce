import type { CollectionConfig } from "payload";
import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields";

const defaultTenantArrayField = tenantsArrayField({
  // Name of the main array field stored in the user's document
  tenantsArrayFieldName: "tenants",

  // Specifies the targeted collection slug for the relationship
  tenantsCollectionSlug: "tenants",

  // Name of the inner relationship field inside each array item [tenants[0] = tenant]
  tenantsArrayTenantFieldName: "tenant",

  // Controls CRUD permissions for the outer array field itself -> the whole tenants CRUD
  arrayFieldAccess: {
    read: () => true,
    create: () => true,
    update: () => true,
  },

  // Controls CRUD permissions for the inner tenant relationship field -> the dropdown item CRUD
  tenantFieldAccess: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
});
export const Users: CollectionConfig = {
  slug: "users",
  labels: {
    singular: {
      en: "User",
      ar: "مستخدم",
    },
    plural: {
      en: "Users",
      ar: "المستخدمين",
    },
  },
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  fields: [
    {
      name: "username",
      required: true,
      unique: true,
      type: "text",
      label: {
        en: "Username",
        ar: "اسم المستخدم",
      },
    },
    {
      admin: {
        position: "sidebar",
      },
      name: "roles",
      type: "select",
      defaultValue: ["user"],
      hasMany: true,
      options: ["super-admin", "user"],
      access: {
        update: ({ req: { user } }) => {
          return Boolean(user?.roles?.includes("super-admin"));
        },
      },
    },
    {
      ...defaultTenantArrayField,
      // Spreads the plugin's default field and overrides its admin UI configurations
      admin: {
        // Inherits plugin's default UI configs (Layout, Components) with an empty fallback {}
        ...(defaultTenantArrayField?.admin || {}),
        position: "sidebar",
      },
    },
  ],
};
