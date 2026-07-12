import {
  DEFAULT_PAGINATION_CURSOR,
  DEFAULT_PAGINATION_LIMIT,
} from "@/constants";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { equal } from "assert";
import z from "zod";

export const reviewsRouter = createTRPCRouter({
  //get the current logged in user user review
  getOne: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
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

      const reviewsData = await ctx.db.find({
        collection: "reviews",
        limit: 1,
        where: {
          and: [
            {
              product: {
                equals: product.id,
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

      const review = reviewsData.docs[0];

      if (!review) {
        return null;
      }

      return review;
    }),
  create: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        rating: z
          .number()
          .min(1, { message: "Rating is required and must be at least 1" })
          .max(5, { message: "Rating cannot be more than 5" }),
        description: z.string().min(1, "Description is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      //to create a review by the current user
      //1- found the product first
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

      //if product exist try to find the product review for the current user
      const existingReviewsData = await ctx.db.find({
        collection: "reviews",
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

      // check if the user has already review on this product
      if (existingReviewsData.totalDocs > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already reviewed this product",
        });
      }

      //if this is the first time he gonna review
      const review = await ctx.db.create({
        collection: "reviews",
        data: {
          user: ctx.session.user.id,
          product: product.id,
          rating: input.rating,
          description: input.description,
        },
      });

      if (!review) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Failed to create your review please try again",
        });
      }
      return review;
    }),
  update: protectedProcedure
    .input(
      z.object({
        reviewId: z.string(),
        rating: z
          .number()
          .min(1, { message: "Rating is required and must be at least 1" })
          .max(5, { message: "Rating cannot be more than 5" }),
        description: z.string().min(1, "Description is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      //to update review -> try to found it first
      const existingReview = await ctx.db.findByID({
        collection: "reviews",
        depth: 0, //depth 0, means existingReview.user will be the user ID
        id: input.reviewId,
      });

      if (!existingReview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }

      //validate if the current logged in user who is the owner of the review
      //Only the owner of the review who is the one who has the right to update the review
      if (existingReview.user !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to update this review",
        });
      }

      //update the review
      const updatedReview = await ctx.db.update({
        collection: "reviews",
        id: input.reviewId,
        data: {
          rating: input.rating,
          description: input.description,
        },
      });

      if (!updatedReview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Failed to update your review please try again",
        });
      }
      return updatedReview;
    }),
});
