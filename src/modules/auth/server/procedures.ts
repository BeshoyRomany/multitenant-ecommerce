import z from "zod";
import { headers as getHeaders, cookies as getCookies } from "next/headers";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { AUTH_COOKIE } from "../constants";
import { registerSchema } from "../schemas";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();
    const headersObject = Object.fromEntries(headers.entries());
    console.log("My Headers:", headersObject);
    const session = await ctx.db.auth({ headers, canSetHeaders: false });
    return session;
  }),
  logout: baseProcedure.mutation(async () => {
    const cookies = await getCookies();

    cookies.delete(AUTH_COOKIE);
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

      //proceed & -> create
      await ctx.db.create({
        collection: "users",
        data: {
          email: input.email,
          username: input.username,
          password: input.password, //This will be hashed
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
      const cookies = await getCookies();
      cookies.set({
        name: AUTH_COOKIE,
        value: data.token,
        httpOnly: true,
        path: "/",
        //TODO: Ensure cross-domain cookie sharing
        // sameSite: "none",
        //domain: ""
        //  secure: true,
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
      const cookies = await getCookies();
      cookies.set({
        name: AUTH_COOKIE,
        value: data.token,
        httpOnly: true,
        path: "/",
        //TODO: Ensure cross-domain cookie sharing
        // sameSite: "none",
        //domain: ""
        //  secure: true,
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
