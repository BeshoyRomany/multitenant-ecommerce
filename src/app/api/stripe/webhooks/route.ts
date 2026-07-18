import type { Stripe } from "stripe";
import { getPayload } from "payload";
import config from "@payload-config";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { ExpandedLineItem } from "@/modules/checkout/types";

export async function POST(req: Request) {
  // Make sure that stripe responses
  let event: Stripe.Event;

  try {
    // #region comment
    /*
        1. Stripe sends us a digital signature generated on their server using (Raw Data + Secret Key).
        2. Locally, we use `stripe.webhooks.constructEvent` to replicate this process by passing:
            - The raw body data (via req.blob().text())
            - The Stripe server signature (from req.headers)
            - Our local Secret Key (from process.env)
        3. The function generates a local signature and compares it with Stripe's signature
            to ensure they match perfectly, proving the data wasn't tampered with in transit.
    */
    // #endregion
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (error) {
    // on Error response to Stripe server (TCP Connection)
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    //#region comment
    /*
     Type Guard: The '!' tells TypeScript that 'error' is definitely not null.
     'instanceof Error' safely checks if it's a real Error object before logging it,
     allowing TypeScript to infer and safely access the 'error.message' property.
    */
    //#endregion
    if (error! instanceof Error) {
      console.log(error);
    }
    console.log(`❌ Error message: ${errorMessage}`);
    return NextResponse.json(
      {
        message: `Webhook Error:${errorMessage}`,
      },
      { status: 400 },
    );
  }

  console.log("✅ Success", event.type);

  const permittedEvents: string[] = [
    "checkout.session.completed",
    "account.updated",
  ];

  const payload = getPayload({ config });

  if (permittedEvents.includes(event.type)) {
    let data;

    try {
      switch (event.type) {
        case "checkout.session.completed":
          data = event.data.object as Stripe.Checkout.Session;
          console.log("Account: ", { account: event.account });
          if (!data.metadata?.userId) {
            throw new Error("Missing userId in Stripe session metadata!");
          }

          const user = await (
            await payload
          ).findByID({
            collection: "users",
            id: data.metadata.userId,
          });

          if (!user) {
            throw new Error("User not found");
          }
          // #region Fetch Expanded Session Details
          /*
            By default, Stripe events return only basic IDs for purchased items.
            This fetches the full checkout session and expands the relational data
            to grab the actual product details (name, metadata, etc.) for provisioning.
           */
          // #endregion

          // Fetch the complete details of the checkout session using its ID
          const expandedSession = await stripe.checkout.sessions.retrieve(
            data.id,
            {
              // #region Why this specific expand path?
              /*
                Even though we send 'price_data' and 'product_data' during creation,
                Stripe internally converts them into formal 'price' and 'product' objects.
                This path follows Stripe's response structure to access the generated product metadata.
              */
              // #endregion

              // Tell Stripe to deeply unpack related objects so we can read the product metadata directly
              expand: ["line_items.data.price.product"],
            },
            {
              // The specific connected merchant's Stripe Account ID where this session took place
              // #region Why explicitly pass stripeAccount here?
              /*
               / Stripe isolates data per merchant account. Even though the Session ID is unique,
               / the SDK queries our main platform account by default. We must pass 'event.account'
               / as a header to tell Stripe's API to look inside that specific merchant's database.
               */
              // #endregion
              stripeAccount: event.account, //the merchant id passed from the procedure
            },
          );

          if (
            !expandedSession.line_items?.data ||
            !expandedSession.line_items.data.length
          ) {
            throw new Error("No line items found");
          }

          // #region Cast Line Items to Expanded Type
          /*
            Type Narrowing after if check show the line_items. props... like data
            and we have created ExpandedLineItem[] to read deeply -> metadata safely.
           */
          // #endregion
          const lineItems = expandedSession.line_items
            .data as ExpandedLineItem[];

          for (const item of lineItems) {
            (await payload).create({
              collection: "orders",
              data: {
                stripeCheckoutSessionId: data.id, // the original session id
                stripeAccountId: event.account, // The merchant ID passed from the procedure -> returned in the event -> saved to link the order to the correct merchant
                user: user.id, // the founded user in the database
                product: item.price.product.metadata.id, //we will save in db as we send it from procedure
                name: item.price.product.name, //we will save in db as we send it from procedure
              },
            });
          }
          break;
        case "account.updated":
          data = event.data.object as Stripe.Account;

          (await payload).update({
            collection: "tenants",
            where: {
              stripeAccountId: {
                equals: data.id,
              },
            },
            data: {
              // #region STRIPE ACCOUNT UPDATE WEBHOOK HANDLING

              //💡 WHY ARE WE TRACKING ACCOUNT UPDATES & "details_submitted"?

              // Context:
              // When a user updates their Stripe Express/Custom account, Stripe triggers an "account.updated" event.
              // If a user "loses their verification", Stripe sets `data.details_submitted` back to `false`.

              // What does "Losing Verification" mean in Stripe?
              // 1. Document Expiration: The merchant's uploaded ID or Passport expires.
              // 2. Critical Info Changes: Changing the legal business name, tax ID, or bank country triggers a re-verification.
              // 3. Volume Thresholds: Passing certain anti-money laundering (AML) sales limits (e.g., $20k+ in volume)
              //    forces Stripe to demand deeper documentation (e.g., proof of address, company registration).
              // Impact on our App:
              // By syncing `data.details_submitted` immediately to our "tenants" collection in Payload CMS,
              // we ensure our database mirrors Stripe instantly. If they lose verification, we immediately
              // restrict their selling capabilities on our frontend until they fix it in their Stripe Dashboard.

              // #endregion
              stripeDetailsSubmitted: data.details_submitted,
            },
          });
          break;
        default:
          throw new Error(`Unhandled event: ${event.type}`);
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        {
          message: "Webhook handler failed",
        },
        { status: 500 },
      );
    }
  }

  // #region Why We Must Return 200 OK
  /*
    We must always reply with '200 OK' to Stripe.
    If we return too many errors, Stripe will think our server is broken
    and it will completely shut down our webhook!
  */
  // #endregion
  return NextResponse.json({ message: "Received" }, { status: 200 });
}
/**
 * STRIPE WEBHOOK EVENT REFERENCE
 * ------------------------------
 * This document tracks the event lifecycle for our checkout flow.
 * We prioritize 'checkout.session.completed' to handle database logic.
 */

// #region 1. customer.created
/* Triggered when a new user is created in Stripe. We use this to map Stripe IDs to our local users. */
// #endregion

// #region 2. payment_intent.created
/* Triggered when a payment attempt is initialized. Useful for logging or tracking abandonment. */
// #endregion

// #region 3. charge.succeeded
/* Triggered when the payment is physically captured. Good for basic audit logs. */
// #endregion

// #region 4. payment_intent.succeeded
/* Triggered when the payment intent is fully authorized and confirmed by the bank. */
// #endregion

// #region 5. mandate.updated
/* Triggered if the payment method (like a saved card) is updated or confirmed for future billing. */
// #endregion

// #region 6. checkout.session.completed
/* THE CRITICAL EVENT. Triggered when the checkout is fully done. 
   THIS IS WHERE WE SAVE ORDERS, LINK USERS, AND PROVISION PRODUCTS. */
// #endregion

// #region 7. charge.updated
/* Triggered when charge metadata or status changes (e.g., refund status or dispute). */
// #endregion

// #region 8. invoice.created
/* Triggered when a receipt is being drafted. We typically ignore this unless we need custom receipt logic. */
// #endregion

// #region 9. invoice.finalized
/* Triggered when the invoice data is locked and ready for distribution. */
// #endregion

// #region 10. invoice.sent
/* Triggered when the email with the receipt/invoice is dispatched to the user. */
// #endregion

// #region 11. invoice.paid
/* Triggered when the invoice payment status transitions to paid. */
// #endregion

// #region 12. invoice.payment_succeeded
/* The final confirmation that the invoice transaction is complete and the money is settled. */
// #endregion
