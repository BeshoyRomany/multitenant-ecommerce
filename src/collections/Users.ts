import type { CollectionConfig } from "payload";

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
  ],
};
