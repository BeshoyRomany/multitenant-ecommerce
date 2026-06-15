import { Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const tenantsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const tenantsData = await ctx.db.find({
        collection: "tenants",
        depth: 1, //Populated tenant.image is a type Media
        where: {
          slug: {
            equals: input.slug,
          },
        },
        limit: 1,
        pagination: false,
      });

      //Extract the tenant {} from the tenantData.docs[{tenant}]
      const tenant = tenantsData.docs[0];

      //Validate
      if (!tenant)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tenant not found",
        });
      /* 
        using an intersection (&) to:
        Force TypeScript to see 'image' as a fully populated Media object | null
        instead of a string ID, so we can safely access '.url' in the frontend.
      */
      return tenant as Tenant & { image: Media | null };
    }),
});
