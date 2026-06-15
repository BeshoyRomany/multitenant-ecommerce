import { Category, Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import type { Sort, Where } from "payload";
import z from "zod";
import { sortValues } from "../search-params";
import { DEFAULT_PAGINATION_LIMIT } from "@/constants";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_PAGINATION_LIMIT),
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),
        tenantSlug: z.string().nullable().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      //Type where to allow us infer (and Where[] | undefined  & or)
      const where: Where = {};
      let sort: Sort;

      switch (input.sort) {
        case "curated":
          sort = "-createdAt";
          break;
        case "trending":
          sort = "createdAt";
          break;
        case "hot_and_new":
          sort = "-createdAt";
          break;
        default:
          sort = "-createdAt";
          break;
      }
      // Min price filter
      if (input.minPrice || input.maxPrice) {
        where["price"] = {
          ...(input.minPrice ? { greater_than_equal: input.minPrice } : {}),
          ...(input.maxPrice ? { less_than_equal: input.maxPrice } : {}),
        };
      }
      //query by slug name
      if (input.tenantSlug) {
        where["tenant.slug"] = {
          equals: input.tenantSlug,
        };
      }
      //check if there's category in the url
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
        // console.log(formattedData[0].subcategories);
        const parentCategory = formattedData[0]; //Get the category and name it parent always since we only retreive one category (limit 1)
        const subcategoriesSlug: string[] = []; //subcategories slugs stored here

        if (parentCategory) {
          // console.log("Subcategories:", ...parentCategory.subcategories);
          subcategoriesSlug.push(
            ...parentCategory.subcategories.map(
              (subcategory) => subcategory.slug,
            ),
          );
        }
        /*
          after we got the parentCategory slug and all subcategories slug we put them in one array
          [parentCategory.slug, ...subcategories] : this is the same as
          (parentCategory.slug, subcategory1.slug, subcategory2.slug, ...) so that we can find
          
        */
        const allCategorySlugs = parentCategory
          ? [parentCategory.slug, ...subcategoriesSlug]
          : [];
        // console.log(allCategorySlugs);
        // now use this parent category id to find all products that belong to this category
        where["category.slug"] = {
          in: allCategorySlugs,
        };
      }
      if (input.tags && input.tags.length > 0) {
        where["tags.name"] = {
          in: input.tags,
        };
      }
      const data = await ctx.db.find({
        collection: "products",
        //Populate "category","image" & "tenant" "tenant.image" Note: depth 2 here for "tenant.image"
        depth: 2,
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
      });
      await new Promise((resolver) => setTimeout(resolver, 1000));
      return {
        ...data,
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          /* 
            using an intersection (&) to:
            Force TypeScript to see 'image' as a fully populated Media object | null
            instead of a string ID, so we can safely access '.url' in the frontend.
          */
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
/*
  1- Get the parent category
  2- Get all subcategories of this parent category
  3- Get all products that belong to the parent category or any of its subcategories
  4- Return the products
*/
