import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: {
      en: "Media",
      ar: "وسيط",
    },
    plural: {
      en: "Media",
      ar: "المكتبة / الوسائط",
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      label: {
        en: "Alt Text",
        ar: "النص البديل (Alt)",
      },
    },
  ],
  upload: true,
};
