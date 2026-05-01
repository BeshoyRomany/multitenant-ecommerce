import { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name", // This will use the "name" field as the title for each category in the admin interface
  },
  access: {
    // create: () => false,
    // update: () => false,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "color",
      type: "text",
      admin: {
        condition: (data) => !data?.parent, // This will only show the "colors" field in the admin interface for categories that do not have a parent category
      },
    },
    {
      name: "parent",
      type: "relationship",
      relationTo: "categories",
      hasMany: false,
      filterOptions: ({ id }) => {
        return {
          and: [
            {
              id: {
                not_equals: id, // This will prevent a category from being selected as its own parent, avoiding circular relationships
              },
            },
            {
              parent: {
                exists: false, // This will ensure that only top-level categories (categories without a parent) can be selected as a parent category, preventing circular relationships
              },
            },
          ],
        } as any;
      },
    },
    {
      name: "subcategories", // The category can have multiple subcategories (table)
      type: "join", // This field is used to create a self-referential relationship for subcategories
      collection: "categories",
      on: "parent", // Fetches all categories where their "parent" field refers to this category's ID.
      hasMany: true, // A category can have multiple subcategories
      admin: {
        condition: (data) => !data?.parent, // This will only show the "subcategories" field in the admin interface for categories that do not have a parent category
      },
    },
  ],
};

/*
Note: to not forget -> subcategories will be generated as a table, but it need (parent Id) and based on it it will
query the table to display (rows of the children) the steps: 
1- current category loaded and it has it's on object
{
  id: f3123j5342g1351,
  name: Software Development,
  slug: software-development,
  parent: null -> because this is main category
  subcategories: query -> query from the categories where the (this) id: f3123j5342g1351 exist as a (parent) in any category
}
*/
