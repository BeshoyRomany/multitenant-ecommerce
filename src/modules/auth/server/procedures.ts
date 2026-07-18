import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { headers as getHeaders } from "next/headers";
import z from "zod";
import { registerSchema } from "../schemas";
import { generateAuthCookie } from "../utils";
import { stripe } from "@/lib/stripe";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();
    const session = await ctx.db.auth({ headers, canSetHeaders: false });
    return session;
  }),
  register: baseProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      // Find if the user exist
      const existingData = await ctx.db.find({
        collection: "users",
        limit: 1,
        where: {
          username: {
            equals: input.username,
          },
        },
      });
      // if user exist -> throw error
      const existingUser = existingData.docs[0];
      if (existingUser)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username already taken",
        });

      //create a stripe account for the new users
      //the account will be empty has no data, just only (id) i will connect it to the tenant on creation.
      //the user later will click on a button to make the onboarding
      const account = await stripe.accounts.create({});

      // Validate if the stripe account created
      if (!account) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to create a stripe account",
        });
      }
      //proceed & create tenant
      const tenant = await ctx.db.create({
        collection: "tenants",
        data: {
          name: input.username,
          slug: input.username,
          stripeAccountId: account.id,
        },
      });

      //proceed & -> create user
      await ctx.db.create({
        collection: "users",
        data: {
          email: input.email,
          username: input.username,
          password: input.password, //This will be hashed
          tenants: [
            {
              tenant: tenant.id,
            },
          ],
        },
      });

      const data = await ctx.db.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
        },
      });
      //Ensure that the user logged in after register
      if (!data.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Failed to login",
        });
      }
      await generateAuthCookie({
        prefix: ctx.db.config.cookiePrefix,
        value: data.token,
      });
    }),
  login: baseProcedure
    .input(
      z.object({
        email: z.email("Invalid email address"),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
        },
      });

      if (!data.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Failed to login",
        });
      }
      await generateAuthCookie({
        prefix: ctx.db.config.cookiePrefix,
        value: data.token,
      });
      return data;
    }),
});

// COMMENTS
/*
  sameSite: "strict"
  The cookie is ONLY sent for requests originating from the same site.
  If a user clicks a link to your site from WhatsApp or an Email, 
  the browser will NOT send the cookie, and they will appear logged out.
*/
/*
 sameSite: "lax"
 Cookies are sent on "safe" cross-site navigation (like clicking a regular Link).
 This allows users to stay logged in when arriving from external sites, 
 but blocks cookies for "unsafe" actions like hidden POST requests from other domains (CSRF protection).
*/
/*
 sameSite: "none"
 Cookies are sent in all contexts: Links, POST requests, and even when your site is inside an iframe.
 REQUIRED: Must be used with 'secure: true' (HTTPS). 
 Use with caution: This makes your site vulnerable to CSRF unless you have other protections.
*/
