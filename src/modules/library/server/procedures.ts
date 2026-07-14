import { Media, Tenant } from "@/payload-types";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";

import { DEFAULT_PAGINATION_LIMIT } from "@/constants";
import { TRPCError } from "@trpc/server";
import { code } from "payload/shared";

export const LibraryRouter = createTRPCRouter({
  //#region get one order product
  //note: in getOne we should make sure that the product in orders so:
  //1- get the order that has the passed product id & the current logged in user
  //2- if the order exist try to get the product from the products collection
  //#endregion
  getOne: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      //make sure that this order exist in the orders by passing the productId, and the current user logged in
      const ordersData = await ctx.db.find({
        collection: "orders",
        pagination: false,
        where: {
          and: [
            {
              product: {
                equals: input.productId,
              },
            },
            {
              user: {
                equals: ctx.session.user.id,
              },
            },
          ],
        },
      });

      const order = ordersData.docs[0];

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      //get the product based on the founded ids
      const product = await ctx.db.findByID({
        collection: "products",
        id: input.productId,
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      // Make sure that the product is found that related to this order
      return product;
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_PAGINATION_LIMIT),
      }),
    )
    .query(async ({ ctx, input }) => {
      const ordersData = await ctx.db.find({
        collection: "orders",
        depth: 0, //we want just to get ids, without populating
        page: input.cursor,
        limit: input.limit,
        where: {
          user: {
            equals: ctx.session.user.id,
          },
        },
      });

      //try to get all productIds that related to this user that we found in the order collection in db
      const productIds = ordersData.docs.map((order) => order.product);

      //get the product based on the founded ids
      const productsData = await ctx.db.find({
        collection: "products",
        pagination: false,
        where: {
          id: {
            in: productIds,
          },
        },
      });

      // =======================================================================
      // STEP 1: Fetch ALL reviews for ALL target products in ONE single DB query
      // Real Data Shape of (allReviewsData.docs):
      // [
      //   { id: '6a5403...', rating: 5, product: '6a2d702b...' },
      //   { id: '6a53da...', rating: 3, product: '6a2d702b...' }
      // ]
      // =======================================================================
      const allReviewsData = await ctx.db.find({
        collection: "reviews",
        pagination: false,
        where: {
          product: {
            in: productIds,
          },
        },
      });

      // =======================================================================
      // STEP 2: Group the reviews by Product ID using .reduce()
      // Real Data Shape of (reviewsByProductId):
      // {
      //   '6a2d702b9445316046fc90f2': [
      //      { id: '6a5403...', rating: 5 },
      //      { id: '6a53da...', rating: 3 }
      //   ]
      // }
      // =======================================================================
      const reviewsByProductId = allReviewsData.docs.reduce(
        (acc, review) => {
          // Extract product ID key dynamically
          const productId =
            typeof review.product === "object" && review.product !== null
              ? (review.product as any).id
              : String(review.product);

          // 👉 THE KEY IS CREATED HERE if it's the first time we see this productId
          if (!acc[productId]) {
            acc[productId] = [];
          }

          // Push the current review safely into its product key drawer
          acc[productId].push(review);
          return acc;
        },
        {} as Record<string, typeof allReviewsData.docs>,
      );

      // =======================================================================
      // STEP 3: Map through products and pull summaries instantly from memory
      // =======================================================================
      const docsWithSummarizedReviews = productsData.docs.map((doc) => {
        // Look up our grouped object, default to [] if product has no reviews
        const productReviews = reviewsByProductId[doc.id] || [];
        const reviewCount = productReviews.length;

        // Calculate average: sum all ratings, then divide by total count
        const reviewRating =
          reviewCount === 0
            ? 0
            : Math.round(
                productReviews.reduce(
                  (sumAcc, review) => sumAcc + (review.rating || 0),
                  0,
                ) / reviewCount,
              );

        return {
          ...doc, // Keep all original product fields
          reviewCount, // Add total reviews count
          reviewRating, // Add calculated average stars
        };
      });

      // =======================================================================
      // STEP 4: Final Formatting & TypeScript Type Assertion
      // =======================================================================
      return {
        ...productsData,
        docs: docsWithSummarizedReviews.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          cover: doc.cover as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
