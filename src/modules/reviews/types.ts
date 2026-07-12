import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/_app";

// Inferred output type of the reviews.getOne tRPC procedure
export type ReviewsGetOneOutPut =
  inferRouterOutputs<AppRouter>["reviews"]["getOne"];
