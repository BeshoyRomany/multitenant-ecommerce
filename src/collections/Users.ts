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
  auth: {
    //#region Why this must match generateAuthCookie's settings exactly
    // Payload has its own built-in cookie logic for auth (this config), separate
    // from the custom `generateAuthCookie` util used in the tRPC login procedure.
    // Both can end up setting/reading the same auth cookie, so their settings
    // (domain, sameSite, secure) must be IDENTICAL.
    //
    // If they mismatch (e.g. one has the "." domain prefix and the other doesn't),
    // login/logout across subdomains can behave inconsistently — in particular,
    // clearing a cookie requires an exact match on its domain; a mismatched domain
    // means the browser won't find the cookie to delete it, so logout can silently
    // fail to actually remove the session.
    //#endregion
    cookies: {
      ...(process.env.NODE_ENV !== "development" && {
        sameSite: "None",
        // Must prefix with "." so the cookie is shared across ALL subdomains
        // (beshoy.sellroad.shop, john.sellroad.shop, sellroad.shop itself),
        // not scoped to a single host only.
        domain: `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
        // secure:false in dev + sameSite:"none" = browser rejects the cookie entirely
        // (Chrome/modern browsers require Secure when SameSite is "none")
        // this will cause login to silently fail in development ("not logged in" even after sign-in)
        secure: true,
      }),
    },
  },
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
