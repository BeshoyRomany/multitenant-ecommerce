// storage-adapter-import-placeholder
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { multiTenantPlugin } from "@payloadcms/plugin-multi-tenant";
import { lexicalEditor, UploadFeature } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { ar } from "payload/i18n/ar";
import { en } from "payload/i18n/en";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { Categories } from "./collections/Categories";
import { Media } from "./collections/Media";
import { Orders } from "./collections/Orders";
import { Products } from "./collections/Products";
import { Reviews } from "./collections/Reviews";
import { Tags } from "./collections/Tags";
import { Tenants } from "./collections/Tenants";
import { Users } from "./collections/Users";
import { isSuperAdmin } from "./lib/access";
import type { Config } from "./payload-types";
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  i18n: {
    supportedLanguages: { en, ar },
    fallbackLanguage: "en",
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      // Add custom component to sidebar, #StripeVerify specifies the exported component name within the file
      beforeNavLinks: ["@/components/stripe-verify#StripeVerify"],
    },
  },
  collections: [
    Users,
    Media,
    Categories,
    Products,
    Tags,
    Tenants,
    Orders,
    Reviews,
  ],
  // cookiePrefix: "funraod", // by default it will be "payload-token"
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      UploadFeature({
        collections: {
          media: {
            // #region Payload CMS Upload Custom Fields
            /*
                   / WARNING: These are NOT the base fields of the 'media' collection itself.
                   / These are contextual, inline block fields embedded directly within the Rich Text JSON.
                   / They allow merchants to add item-specific meta (e.g., custom Alt Text or Captions)
                   / for this specific image instance inside the description editor.
                   */
            // #endregion
            fields: [
              {
                name: "alt",
                type: "text",
              },
            ],
          },
        },
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    multiTenantPlugin<Config>({
      // #region Multi-Tenant (Users) Auth Security (Auto-Protected by Plugin)
      /**
       * Note for the team:
       * This User collection is automatically secured because the plugin looks for the 'admin.user'
       * configuration and finds this Auth Collection. By spreading 'defaultTenantArrayField' here,
       * the plugin automatically enforces tenant restrictions and hooks without adding 'users'
       * to the plugin's collections array.
       */

      // #endregion
      collections: {
        products: {}, // will add tenant Field into the "products" collection
      },
      tenantsArrayField: {
        includeDefaultField: false /* false here 
        because i added in the users collection manually ->
        ...(defaultTenantArrayField) */,
      },
      userHasAccessToAllTenants: (user) => isSuperAdmin(user),
    }),
    // storage-adapter-placeholder
  ],
});
