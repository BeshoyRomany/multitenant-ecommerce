import type { Stripe } from "stripe";
import { getPayload } from "payload";
import config from "@payload-config";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { ExpandedLineItem } from "@/modules/checkout/types";

export async function POST(req: Request) {
  // Make sure that stripe responses

  /**
   * We now potentially try TWO different verification methods against the
   * same raw body (v1 constructEvent, then v2 parseEventNotification as a fallback).
   *
   * Both need the exact same raw bytes, and a Request body can only be read
   * once, so we read it a single time here and reuse it below.
   */

  const rawBody = await (await req.blob()).text();

  const signature = req.headers.get("stripe-signature") as string;

  /**
   * Stripe now runs two parallel event systems on Connect accounts:
   *
   * - v1 "snapshot" events (classic): verified with
   *   `stripe.webhooks.constructEvent` using STRIPE_WEBHOOK_SECRET.
   *   These still carry the full object payload
   *   (e.g. "checkout.session.completed").
   *
   * - v2 "event notifications": verified with
   *   `stripe.parseEventNotification` using a DIFFERENT signing secret
   *   (STRIPE_WEBHOOK_SECRET_V2) that Stripe gives you when you create
   *   a v2 Event Destination in the Dashboard.
   *
   *   Event notifications contain a reference to the related object.
   *   The Stripe SDK provides `fetchRelatedObject()` to retrieve the
   *   complete resource.
   *
   * Why does this matter here?
   *
   * Stripe migrated our Connect accounts to the new "Accounts v2" model.
   * Once an account is a v2 Account, Stripe STOPS sending the classic
   * "account.updated" (v1) event for it completely, and only sends
   * "v2.core.account[requirements].updated" instead.
   *
   * The old code below only ever listened for "account.updated", so
   * verification updates silently stopped reaching us.
   *
   * This block fixes that by trying v1 verification first, and falling back
   * to v2 event notification verification if that fails.
   */

  let event: Stripe.Event | null = null;

  let eventNotification: Stripe.V2.Core.EventNotification | null = null;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (v1Error) {
    // NEW: v1 verification failed. This is expected for v2 event notifications,
    // since they're signed with a completely different secret. Before
    // treating this as a real error, try verifying it as a v2 event notification.

    try {
      eventNotification = stripe.parseEventNotification(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET_V2 as string,
      );
    } catch (v2Error) {
      // on Error response to Stripe server (TCP Connection)

      const errorMessage =
        v2Error instanceof Error ? v2Error.message : "Unknown error";

      /**
       * Type Guard: The `instanceof Error` check safely verifies that the
       * received value is an actual Error object before accessing its
       * message property.
       */

      if (v2Error instanceof Error) {
        console.log(v2Error);
      }

      console.log(`❌ Error message: ${errorMessage}`);

      return NextResponse.json(
        {
          message: `Webhook Error:${errorMessage}`,
        },
        { status: 400 },
      );
    }
  }

  const payload = getPayload({ config });

  /**
   * This replaces the old v1 "account.updated" case, which no longer fires
   * for accounts on the Accounts v2 model.
   *
   * V2 event notifications have a different shape and do not contain the
   * complete account object.
   *
   * We use `fetchRelatedObject()` to retrieve the current account before
   * processing its requirements.
   */

  if (eventNotification) {
    console.log("✅ Success (v2 event notification)", eventNotification.type);

    try {
      switch (eventNotification.type) {
        case "v2.core.account[requirements].updated": {
          // NEW: Event notifications contain a reference to the related object.
          // `fetchRelatedObject()` retrieves the current Stripe account.

          const account = await eventNotification.fetchRelatedObject();

          if (!account) {
            throw new Error("Missing related account on v2 event notification");
          }

          const accountId = account.id;

          const isVerified =
            account.requirements?.entries?.every(
              (entry) => entry.minimum_deadline?.status !== "currently_due",
            ) ?? false;

          (await payload).update({
            collection: "tenants",
            where: {
              stripeAccountId: {
                equals: accountId,
              },
            },
            data: {
              stripeDetailsSubmitted: isVerified,
            },
          });

          break;
        }

        default:
          // NEW: ignore v2 event types we haven't implemented instead of
          // throwing, so Stripe doesn't keep retrying delivery for events
          // we intentionally don't handle yet.

          console.log(`Unhandled v2 event: ${eventNotification.type}`);
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

    /**
     * We must always reply with '200 OK' to Stripe after successfully
     * processing the webhook.
     *
     * If we return an error status, Stripe may retry the webhook delivery.
     */

    return NextResponse.json({ message: "Received" }, { status: 200 });
  }

  // NEW: from here on, `event` is guaranteed to be a v1 Stripe.Event,
  // since the event notification branch above already returned.

  console.log("✅ Success", event!.type);

  // NEW: "account.updated" was removed from this list — it no longer fires
  // for our Connect accounts on the Accounts v2 model.
  //
  // The event is now handled through the v2 event notification branch above
  // using "v2.core.account[requirements].updated".

  const permittedEvents: string[] = ["checkout.session.completed"];

  if (permittedEvents.includes(event!.type)) {
    let data;

    try {
      switch (event!.type) {
        case "checkout.session.completed":
          data = event!.data.object as Stripe.Checkout.Session;

          console.log("Account: ", { account: event!.account });

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

          /**
           * By default, Stripe events return only basic IDs for purchased items.
           * This fetches the full checkout session and expands the relational data
           * to grab the actual product details (name, metadata, etc.) for provisioning.
           */

          // Fetch the complete details of the checkout session using its ID
          const expandedSession = await stripe.checkout.sessions.retrieve(
            data.id,
            {
              /**
               * Even though we send 'price_data' and 'product_data' during creation,
               * Stripe internally converts them into formal 'price' and 'product' objects.
               *
               * This path follows the response structure to access the generated product metadata.
               */

              // Tell Stripe to deeply unpack related objects so we can read the product metadata directly
              expand: ["line_items.data.price.product"],
            },
            {
              // The specific connected merchant's Stripe Account ID where this session took place

              /**
               * Why explicitly pass stripeAccount here?
               *
               * Stripe isolates data per merchant account. Even though the Session ID is unique,
               * the SDK queries our main platform account by default.
               *
               * We must pass `event.account` as a header to tell Stripe to look inside that specific merchant's database.
               */

              stripeAccount: event!.account, // the merchant id passed from the procedure
            },
          );

          if (
            !expandedSession.line_items?.data ||
            !expandedSession.line_items.data.length
          ) {
            throw new Error("No line items found");
          }

          /**
           * Type Narrowing after if check show the line_items. props... like data
           * and we have created ExpandedLineItem[] to read deeply -> metadata safely.
           */

          const lineItems = expandedSession.line_items
            .data as ExpandedLineItem[];

          for (const item of lineItems) {
            (await payload).create({
              collection: "orders",
              data: {
                stripeCheckoutSessionId: data.id, // the original session id

                stripeAccountId: event!.account,
                // The merchant ID passed from the procedure -> returned in the event -> saved to link the order to the correct merchant

                user: user.id, // the founded user in the database

                product: item.price.product.metadata.id,
                // we will save in db as we send it from procedure

                name: item.price.product.name,
                // we will save in db as we send it from procedure
              },
            });
          }

          break;

        default:
          throw new Error(`Unhandled event: ${event!.type}`);
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

  /**
   * We must always reply with '200 OK' to Stripe.
   *
   * If we return an error status, Stripe may retry the webhook delivery.
   */

  return NextResponse.json({ message: "Received" }, { status: 200 });
}

/**
 * STRIPE WEBHOOK EVENT REFERENCE
 * ------------------------------
 * This document tracks the event lifecycle for our checkout flow.
 * We prioritize 'checkout.session.completed' to handle database logic.
 */

// 1. customer.created
// Triggered when a new user is created in Stripe. We use this to map Stripe IDs to our local users.

// 2. payment_intent.created
// Triggered when a payment attempt is initialized. Useful for logging or tracking abandonment.

// 3. charge.succeeded
// Triggered when the payment is physically captured. Good for basic audit logs.

// 4. payment_intent.succeeded
// Triggered when the payment intent is fully authorized and confirmed by the bank.

// 5. mandate.updated
// Triggered if the payment method (like a saved card) is updated or confirmed for future billing.

// 6. checkout.session.completed
// THE CRITICAL EVENT. Triggered when the checkout is fully done.
//
// THIS IS WHERE WE SAVE ORDERS, LINK USERS, AND PROVISION PRODUCTS.

// 7. charge.updated
// Triggered when charge metadata or status changes (e.g., refund status or dispute).

// 8. invoice.created
// Triggered when a receipt is being drafted. We typically ignore this unless we need custom receipt logic.

// 9. invoice.finalized
// Triggered when the invoice data is locked and ready for distribution.

// 10. invoice.sent
// Triggered when the email with the receipt/invoice is dispatched.

// 11. invoice.paid
// Triggered when the invoice payment status transitions to paid.

// 12. invoice.payment_succeeded
// The final confirmation that the invoice transaction is complete and the money is settled.

// 13. v2.core.account[requirements].updated
// Replaces "account.updated" (v1) for Connect accounts on the Accounts v2 model.
//
// Event notification — it contains a reference to the account rather than
// the complete account data.
//
// We use `eventNotification.fetchRelatedObject()` to retrieve the current
// account before acting on its requirements.
//
