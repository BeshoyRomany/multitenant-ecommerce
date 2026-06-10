import {
  DEFAULT_PAGINATION_CURSOR,
  DEFAULT_PAGINATION_LIMIT,
} from "@/constants";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";

export const tagsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(DEFAULT_PAGINATION_CURSOR),
        limit: z.number().default(DEFAULT_PAGINATION_LIMIT),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.find({
        collection: "tags",
        page: input.cursor,
        limit: input.limit,
      });
      await new Promise((resolver) => setTimeout(resolver, 1000));
      return data;
    }),
});
