// storage-adapter-import-placeholder
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { multiTenantPlugin } from "@payloadcms/plugin-multi-tenant";
import type { Config, User } from "./payload-types";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import { ar } from "payload/i18n/ar";
import { en } from "payload/i18n/en";
import sharp from "sharp";
import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Categories } from "./collections/Categories";
import { Products } from "./collections/Products";
import { Tags } from "./collections/Tags";
import { Tenants } from "./collections/Tenants";

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
  },
  collections: [Users, Media, Categories, Products, Tags, Tenants],
  // cookiePrefix: "funraod", // by default it will be "payload-token"
  editor: lexicalEditor(),
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
    multiTenantPlugin({
      collections: {
        products: {},
      },
      tenantsArrayField: {
        includeDefaultField: false /* false here 
        because i added in the users collection manually ->
        ...(defaultTenantArrayField) */,
      },
      userHasAccessToAllTenants: (user) => {
        const adminUser = user as User;
        return Boolean(adminUser?.roles?.includes("super-admin"));
      },
    }),
    // storage-adapter-placeholder
  ],
});
