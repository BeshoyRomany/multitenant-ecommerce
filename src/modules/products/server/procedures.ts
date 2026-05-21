import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import type { Where } from "payload";
import z from "zod";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        category: z.string().nullable().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      //Type where to allow us infer (and Where[] | undefined  & or)
      const where: Where = {};
      if (input.category) {
        // get all categories that slug is equal to [parentCategory.slug, ...subcategories]
        const categoriesData = await ctx.db.find({
          collection: "categories",
          limit: 1,
          depth: 1, //Populate subcategories one level deep
          pagination: false,
          where: {
            slug: { equals: input.category }, // get category based on slug from url parameter
          },
        });
        //Flat the data
        const formattedData = categoriesData.docs.map((doc) => ({
          // doc parent
          ...doc, // parent level
          subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
            // doc subcategory
            // Because of "depth 1" we are confident that it will display the full category (doc) object not the string parent
            ...(doc as Category),
          })),
        }));
        console.log(formattedData);
        const parentCategory = formattedData[0]; //Get the category and name it parent always since we only retreive one category (limit 1)
        const subcategoriesSlug: string[] = []; //subcategories slugs stored here
        if (parentCategory) {
          subcategoriesSlug.push(
            ...parentCategory.subcategories.map(
              (subcategory) => subcategory.slug,
            ),
          );
        }
        console.log(subcategoriesSlug);
        /*
          after we got the parentCategory slug and all subcategories slug we put them in one array
          [parentCategory.slug, ...subcategories] : this is the same as
          (parentCategory.slug, subcategory1.slug, subcategory2.slug, ...) so that we can find
          
        */
        const allCategorySlugs = parentCategory
          ? [parentCategory.slug, ...subcategoriesSlug]
          : [];
        console.log(allCategorySlugs);
        // now use this parent category id to find all products that belong to this category
        where["category.slug"] = {
          in: allCategorySlugs,
        };
      }

      const data = await ctx.db.find({
        collection: "products",
        depth: 1, //Populate "category" & "image"
        where,
      });
      await new Promise((resolver) => setTimeout(resolver, 1000));
      return data;
    }),
});
/*
  1- Get the parent category
  2- Get all subcategories of this parent category
  3- Get all products that belong to the parent category or any of its subcategories
  4- Return the products
*/
