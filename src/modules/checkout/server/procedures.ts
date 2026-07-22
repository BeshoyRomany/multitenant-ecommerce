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
import { PLATFORM_FEE_PERCENTAGE } from "@/constants";
import { generateTenantURL } from "@/lib/utils";

export const checkoutRouter = createTRPCRouter({
  //user will verify his Strip account
  verify: protectedProcedure.mutation(async ({ ctx }) => {
    //1. check if the current user is in the database
    const user = await ctx.db.findByID({
      collection: "users",
      id: ctx.session.user.id,
      depth: 0, //user.tenants[0] is going to be string, we don't need to populate the whole tenant object here
    });
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }
    //2. #region user tenants interface
    /*
      tenants?: {tenant: string | Tenant; id?: string | null}[] | null;
    */
    //#endregion
    const tenantId = user.tenants?.[0]?.tenant as string; // this is a tenant as id because of depth 0

    //3. get the tenant by tenant id
    const tenant = await ctx.db.findByID({
      collection: "tenants",
      id: tenantId,
    });

    if (!tenant) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Tenant not found" });
    }

    const accountLink = await stripe.accountLinks.create({
      account: tenant.stripeAccountId,
      // The URL the user is redirected to if the account link expires or the session is interrupted
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL!}/admin`,
      // The URL the user is sent to once they complete or exit the Stripe onboarding flow
      return_url: `${process.env.NEXT_PUBLIC_APP_URL!}/admin`,
      type: "account_onboarding",
    });

    // Validate that Stripe successfully generated the onboarding URL
    if (!accountLink.url) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to create verification link",
      });
    }

    return { url: accountLink.url };
  }),

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
            {
              isArchived: {
                // checkout and go to purchase page as long as the product not archived
                //#region Race Condition Handling: Product Archived During Checkout
                // Scenario:
                // 1. User has products in cart and triggers the purchase procedure.
                // 2. Concurrently, the merchant archives one of these products.
                // 3. This query filters out the archived product using 'not_equals: true'.
                // 4. The length validation below (totalDocs !== productIds.length) will fail
                //    because the archived product is missing from the result.
                // 5. Transaction safely aborts with a NOT_FOUND error.
                //#endregion
                not_equals: true,
              },
            },
          ],
        },
      });

      //first -> validation check about the length of the front cart.length & the retrieved cart.length
      if (products.totalDocs !== input.productIds.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Products not found",
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

      if (!tenant.stripeDetailsSubmitted) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Tenant not allowed to sell products",
        });
      }

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

      // #region PLATFORM FEE CALCULATIONS & FLOATING-POINT PROTECTION
      /*
        💡 WHY ARE WE MULTIPLYING BY 100 AND DOING THIS ROUNDABOUT CALCULATION?
       
        1. JavaScript Floating-Point Bug:
           JS is notoriously bad at math with decimals (e.g., 0.1 + 0.2 = 0.30000000000000004).
           To avoid losing pennies and causing accounting bugs, we convert everything to INTEGERS.
       
        2. Stripe Standard:
           Payment gateways like Stripe process charges in the smallest currency unit (CENTS, not Dollars).
       
        -------------------------------------------------------------------------
        📝 EXAMPLE WALKTHROUGH (Total Order = $62.00 | Platform Fee = 10%)
       
       = Step 1: Convert Total to Cents
                $62.00 * 100 = 6,200 cents (totalAmount)
       
        Step 2: Calculate Fee in Cents
                (6,200 cents * 10) / 100 = 62,000 / 100 = 620 cents (platformFeeAmount)
       
        Final Result Sent to Stripe:
                Stripe receives 620 cents, which equals exactly $6.20 (Perfect 10% fee!).
        -------------------------------------------------------------------------
       */
      // #endregion

      const totalAmount = products.docs.reduce(
        (acc, item) => acc + item.price * 100, //each price item * 100
        0,
      );
      //take the fee
      const platformFeeAmount = Math.round(
        (totalAmount * PLATFORM_FEE_PERCENTAGE) / 100,
      );

      const domain = generateTenantURL(input.tenantSlug);

      // Create a new Stripe Checkout session
      const checkout = await stripe.checkout.sessions.create(
        {
          // The email of the customer purchasing, used to send them a receipt
          customer_email: ctx.session.user.email,

          // The URL redirect after a successful payment
          success_url: `${domain}/checkout?success=true`,
          // success_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?success=true`,

          // The URL redirect if the customer cancels or closes the payment page
          cancel_url: `${domain}/checkout?cancel=true`,
          // cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?cancel=true`,

          // The payment mode (one-time payment, not a recurring subscription)
          mode: "payment",

          // The list of items/products the customer is buying (prices, quantities)
          line_items: lineItems,

          // Automatically generate and issue a PDF invoice for the customer after purchase
          invoice_creation: {
            enabled: true,
          },

          // Extra custom data attached to the session to look up later in the Webhook
          metadata: {
            userId: ctx.session.user.id,
          } as CheckoutMetaData,

          // Configure internal payment intent data to capture the platform fee
          payment_intent_data: {
            // The platform fee cut (in cents) that goes to your site before paying the merchant
            application_fee_amount: platformFeeAmount,
          },
        },
        {
          // The connected Stripe Account ID of the merchant receiving the money.
          // The tenant that has the input.slug it will receive the money
          stripeAccount: tenant.stripeAccountId,
        },
      );

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
          and: [
            {
              id: {
                in: input.ids,
              },
            },
            {
              isArchived: {
                not_equals: true,
              },
            },
          ],
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
