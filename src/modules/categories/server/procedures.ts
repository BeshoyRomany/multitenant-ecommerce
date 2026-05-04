import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.find({
      collection: "categories",
      pagination: false, // categories are usually not that many, so we can fetch them all at once
      depth: 1, //Populate subcategories one level deep
      where: {
        parent: {
          exists: false, // this will fetch only the top-level categories that do not have a parent category
        },
      },
      sort: "name",
    });

    //Flat the data
    const formattedData = data.docs.map((doc) => ({
      ...doc, // parent level
      subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
        // Because of "depth 1" we are confident that it will display the full category (doc) object not the string parent
        ...(doc as Category),
        subcategories: undefined,
      })),
    }));

    //another way to not infer the parent?: string | {category}

    /*const formattedData = data.docs.map((doc) => ({
      id: doc.id,
      name: doc.name,
      slug: doc.slug,
      color: doc.color,
      subcategories: (doc.subcategories?.docs ?? []).map((sub) => {
        const category = sub as Category;
        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          color: category.color,
        };
      }),
    }));*/

    // [formattedData] will be a type (infer by tRPC) instead of making a new interface in the client side
    return formattedData;
  }),
});
