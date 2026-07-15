import type { CollectionConfig } from "payload";
import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields";
import { isSuperAdmin } from "@/lib/access";

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
    create: ({ req: { user } }) => isSuperAdmin(user),
    update: ({ req: { user } }) => isSuperAdmin(user),
  },

  // Controls CRUD permissions for the inner tenant relationship field -> the dropdown item CRUD
  tenantFieldAccess: {
    read: () => true,
    create: ({ req: { user } }) => isSuperAdmin(user),
    update: ({ req: { user } }) => isSuperAdmin(user),
  },
});
export const Users: CollectionConfig = {
  slug: "users",
  access: {
    read: () => true, // WARNING: This allows PUBLIC (unauthenticated) access to read ALL users in the system.
    // If you want users to ONLY read their own profiles, you should use a query constraint instead.
    create: ({ req: { user } }) => isSuperAdmin(user), // Only accounts defined as Super Admins can create new users
    delete: ({ req: { user } }) => isSuperAdmin(user), // Only accounts defined as Super Admins can create new users
    update: ({ req, id }) => {
      // Super Admin can update anyone; otherwise, a logged-in user can only update their own document
      if (isSuperAdmin(req.user)) return true;
      return req.user?.id === id;
    },
  },
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
    hidden: ({ user }) => !isSuperAdmin(user), // Only super-admin role can see the users collection
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
        update: ({ req: { user } }) => isSuperAdmin(user),
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
