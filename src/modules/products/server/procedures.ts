import { headers as getHeaders } from "next/headers";
import { Category, Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import type { Sort, Where } from "payload";
import z, { number } from "zod";
import { sortValues } from "../search-params";
import { DEFAULT_PAGINATION_LIMIT } from "@/constants";
import { totalmem } from "os";

export const productsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      //#region session content example
      // {
      //   "authorization": "Bearer token_of_logged_in_user",
      //   "cookie": "payload-token: eyJhbGciOiJIUzI1...."
      // }

      //How it works: to know which user is logged in now, through payload will go to mongodb by user data that exist in the token

      //#endregion
      const headers = await getHeaders();
      const session = await ctx.db.auth({ headers });

      const product = await ctx.db.findByID({
        collection: "products",
        id: input.id,
        depth: 2, //2 -> to populate product.tenant(1).image(2) to access -> url
      });

      let isPurchased = false;

      if (session.user) {
        const ordersData = await ctx.db.find({
          collection: "orders",
          pagination: false,
          limit: 1,
          where: {
            and: [
              {
                product: {
                  equals: input.id,
                },
              },
              {
                user: {
                  equals: session.user.id,
                },
              },
            ],
          },
        });

        // #region Convert Order Check to Boolean
        // Purpose: Check if the current user has purchased this product
        //
        // Step 1: ordersData.docs[0] returns either an object (order exists) or undefined (no order)
        // Step 2: First ! converts the value to boolean and inverts it
        //         - object → false (truthy inverted)
        //         - undefined → true (falsy inverted)
        // Step 3: Second ! inverts it again to get the correct boolean value
        //         - false → true (user HAS purchased)
        //         - true → false (user HAS NOT purchased)
        //
        // Result: isPurchased is always a clean true/false, never an object or undefined
        // #endregion
        isPurchased = !!ordersData.docs[0];
      }

      //Get the reviews records for the current product
      const reviews = await ctx.db.find({
        collection: "reviews",
        pagination: false,
        where: {
          product: {
            equals: product.id,
          },
        },
      });

      //Get the reviews rating
      //Divide to get the average of the rating by: the accumulated reviews / how many user rate this product
      //Example: 2 users -> one rate 4 & one rate 1 -> 5 / 2 users = 2.5 rating
      const reviewsRating =
        reviews.docs.length > 0
          ? reviews.docs.reduce((acc, review) => acc + review.rating, 0) /
            reviews.totalDocs
          : 0;

      // #region Rating Distribution Calculations
      // Frequency Counter: Loops through the fetched database reviews,
      // categorizes each rating (1-5), and increments its counter in memory
      // to calculate the final breakdown chart for the UI.
      // #endregion
      const ratingDistribution: Record<number, number> = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      };

      //let's assign each rating
      if (reviews.totalDocs > 0) {
        reviews.docs.forEach((review) => {
          const rating = review.rating; // will be the pointer in the ratingDistribution (the rate index)
          //check & validate if the rating within the range 1 to 5
          //should be greater than (1) & less than (5)
          if (rating >= 1 && rating <= 5) {
            //Assign each reacting to the it's position in the ratingDistribution object
            // 4 -> how many gave 4
            // 5 -> how many give 5
            ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
            //ratingDistribution[4] value++ 0 gonna be 1
            //ratingDistribution[5] value++ 0 gonna be 1
            //another ratingDistribution[5] value++ 1 gonna be 2
            //etc....
          }
          // and always we have rating because the data came from the reviews collection because it has rating for this product
        });

        //convert to percentage
        Object.keys(ratingDistribution).forEach((key) => {
          const rating = Number(key); // get the key convert to number 1,2,3,4,5
          const count = ratingDistribution[rating] || 0; // get the value for each key & if it's not exist make 0

          // example: 2 users rated 5 stars -> so ratingDistribution[5] = 2
          // (5 stars key): (2 / 3 total reviews) * 100 = 66.666...
          // Math.round(66.666...) will equal 67% for progress bar [████████░░] 67%

          // example: 1 user rated 1 star -> so ratingDistribution[1] = 1
          // (1 star key): (1 / 3 total reviews) * 100 = 33.333...
          // Math.round(33.333...) will equal 33% for progress bar [███░░░░░░░] 33%

          ratingDistribution[rating] = Math.round(
            (count / reviews.totalDocs) * 100,
          );
          //final example: if ratingDistribution[1] = 4 & we have only 4 totalReviews it will be 4/4 = 1 * 100 = 100% from the 4 user rates with 1 star
        });
      }
      return {
        ...product,
        image: product.image as Media | null,
        cover: product.cover as Media | null,
        tenant: product.tenant as Tenant & { image: Media | null },
        isPurchased,
        reviews: reviews.totalDocs,
        reviewsRating,
        ratingDistribution,
        reviewCount: reviews.totalDocs,
      };
    }),
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
        tenantSlug: z.string().nullable().optional(), //TODO: will send from subdomain
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
        const parentCategory = formattedData[0]; //Get the category and name it parent always since we only retrieve one category (limit 1)
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

      //Promise.all for each (product) doc.id we need to get it's reviews
      const docsWithSummarizedReviews = await Promise.all(
        data.docs.map(async (doc) => {
          //get the reviews for each product
          //query from reviews by product id, the one who add the review that has the (rating & description) is the (user)
          const reviewsData = await ctx.db.find({
            collection: "reviews",
            pagination: false,
            where: {
              product: {
                equals: doc.id,
              },
            },
          });
          return {
            ...doc, // return the whole product object
            reviewCount: reviewsData.totalDocs, // product + with total reviews aggregation we made
            //reduce() -> collect each review.rating
            //e.q: each review has rating property it can be from 1 to 5
            //so review.rating1 = 3 + review.rating2= 4 + review.rating = 2 etc.. all equal 9 rating
            reviewRating:
              reviewsData.docs.length === 0
                ? 0
                : reviewsData.docs.reduce(
                    (acc, review) => acc + review.rating,
                    0,
                  ) / reviewsData.totalDocs,
            //divide(/) here which means if i have 10 rating / 2 users(review by user - user gave review for the product) it will be (5 stars)
            //another example : 5 rating / 2 users(review by user - user gave review for the product) - (2.5 stars)
          };
        }),
      );
      return {
        ...data, // totalDocs, page, hasNextPage, etc...
        docs: docsWithSummarizedReviews.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          cover: doc.cover as Media | null,
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
