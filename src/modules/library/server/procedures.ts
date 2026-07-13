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

      //Promise.all for each (product) doc.id we need to get it's reviews
      const docsWithSummarizedReviews = await Promise.all(
        productsData.docs.map(async (doc) => {
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
