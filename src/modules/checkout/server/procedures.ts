import { Media, Product, Tenant } from "@/payload-types";
import type Stripe from "stripe";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { CheckoutMetaData, ProductMetaData } from "../types";
import { stripe } from "@/lib/stripe";

export const checkoutRouter = createTRPCRouter({
  purchase: protectedProcedure
    .input(
      z.object({
        productIds: z.array(z.string()).min(1),
        tenantSlug: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 1- protect ORM Level and check the products in the cart are exist in the database & for specific tenant

      /* 
        Fetch the latest authentic product data from DB to prevent
        any client-side tampering with prices, availability, or tenants in LocalStorage
      */

      const products = await ctx.db.find({
        collection: "products",
        depth: 2,
        where: {
          and: [
            {
              id: {
                in: input.productIds,
              },
            },
            {
              "tenant.slug": {
                equals: input.tenantSlug,
              },
            },
          ],
        },
      });

      //first -> validation check about the length of the front cart.length & the retrieved cart.length
      if (products.docs.length !== input.productIds.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Some products are invalid or do not belong to this tenant!",
        });
      }
      //second-> retrieve the tenant to proceed
      const tenantData = await ctx.db.find({
        collection: "tenants",
        limit: 1,
        pagination: false,
        where: {
          slug: {
            equals: input.tenantSlug,
          },
        },
      });

      const tenant = tenantData.docs[0];
      // Ensure the tenant still actually exists in the DB to handle
      // edge cases like orphaned products (if a tenant was deleted without cascade it's products)
      if (!tenant) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Tenant not found" });
      }

      //TODO: Throw error if stripe details not submitted

      //The type of purchased items list [price, quantity, etc...]
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
        // return array of lineItems{}
        products.docs.map((product: Product) => ({
          quantity: 1,
          price_data: {
            // stripe handles prices in cents (185 * 100) = 18500 then -> (18500/100) = 185
            // because of IEEE 754
            unit_amount: product.price * 100,
            currency: "usd",
            product_data: {
              name: product.name,
              metadata: {
                stripeAccountId: tenant.stripeAccountId,
                id: product.id,
                name: product.name,
                price: String(product.price),
              } as ProductMetaData,
            },
          },
        }));

      const checkout = await stripe.checkout.sessions.create({
        customer_email: ctx.session.user.email,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?cancel=true`,
        mode: "payment",
        line_items: lineItems,
        invoice_creation: {
          enabled: true,
        },
        metadata: {
          userId: ctx.session.user.id,
        } as CheckoutMetaData,
      });

      if (!checkout.url) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session!",
        });
      }

      return { url: checkout.url };
    }),

  getProducts: baseProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.find({
        collection: "products",
        depth: 2,
        where: {
          id: {
            /*
            here we trying to fetch from database all products has the passed ids from the input
            note: the ids i got from localstorage through getCartByTenant()
            */
            in: input.ids,
          },
        },
      });

      return {
        ...data,
        totalPrice: data.docs.reduce((acc, product) => acc + product.price, 0),
        totalDocs: data.totalDocs,
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          cover: doc.cover as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
