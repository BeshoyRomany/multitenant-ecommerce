import { initTRPC } from "@trpc/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { cache } from "react";
import superjson from "superjson";
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: "user_123" };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure.use(async ({ next }) => {
  const payload = await getPayload({
    config,
  });
  // context here will be the payload of each call and extracted it in the procedure to call with await ctx.payload.find({})
  // we do this only one time here in the base procedure -> and we renamed it to {db} instead of direct {payload}
  return next({ ctx: { db: payload } });
});
