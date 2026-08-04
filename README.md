<div align="center">

<img src="./public/banner.jpg" alt="Multitenant E-commerce Platform" width="100%" />

# 🛍️ Multitenant E-commerce

**Complete multi-tenant marketplace with Stripe Connect payments, automated order processing, and tenant-scoped storefronts.**

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="tRPC" src="https://img.shields.io/badge/tRPC-2596BE?style=for-the-badge&logo=trpc&logoColor=white" />
  <img alt="Payload" src="https://img.shields.io/badge/Payload_CMS-000000?style=for-the-badge&logo=payload&logoColor=white" />
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-13AA52?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img alt="Stripe" src="https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white" />
  <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

</div>

---

## 📖 Overview

Multitenant E-commerce is a complete marketplace platform where sellers register, get isolated storefronts, and handle payments through Stripe Connect. The entire system is **multi-tenant by design** — each seller's products, orders, and data are automatically filtered and protected. Buyers browse multiple stores, build per-tenant carts, and checkout securely. Order processing flows through Stripe webhooks with verified, idempotent handling.

The entire API surface is **end-to-end type-safe** — a change to a Payload collection field propagates through the tRPC router into React component props with no codegen step and no hand-written API types.

**Design:** This application is designed with **neobrutalism** inspiration — bold typography, stark contrast, raw UI elements, and a no-nonsense aesthetic that emphasizes function over decoration.

---

## ✨ Features

### 🏪 Multi-Tenant Storefronts

- **Complete tenant isolation** — Products, orders, and content are automatically filtered by tenant
- **Dedicated store URLs** — Each seller's storefront at `/tenants/[slug]`
- **Automatic tenant assignment** — Products inherit the active tenant on creation
- **User-to-tenant mapping** — Sellers own and manage their store accounts
- **Super-admin override** — Platform admins can view and manage all tenants

### 💳 Stripe Connect Payments

- **Destination charges** — Each line item routes to the correct merchant's Stripe account
- **Server-side checkout validation** — Products and prices re-validated before payment
- **Secure checkout sessions** — Stripe Checkout with full tenant isolation
- **Webhook order recording** — `checkout.session.completed` creates Orders, tracks purchases
- **Idempotent webhook handling** — Duplicate deliveries can't corrupt state or orphan orders

### 🛒 Shopping & Cart

- **Per-tenant carts** — Cart state in localStorage, keyed by tenant slug
- **Smart cart UI** — Live product counts, prices, and availability
- **Order history** — Track all purchases with order details
- **Purchase verification** — Library only shows products the user actually bought

### 📦 Product Management

- **Bilingual CMS** — All labels support English and Arabic (i18n)
- **Rich content editor** — Lexical-based editor for descriptions
- **Media library** — Integrated with Vercel Blob + Sharp optimization
- **Categories & tags** — Hierarchical product organization
- **Dynamic images** — Automatic optimization, responsive delivery

### ⭐ Post-Purchase Features

- **Review system** — Verified purchasers leave ratings and feedback
- **Purchase-gated access** — Library and reviews only accessible after buying
- **Order tracking** — Full transaction history with status
- **Ownership gates** — Access control based on verified purchases

### 🎛️ Admin Dashboard

- **Payload CMS UI** — Full-featured admin at `/admin`
- **Tenant management** — Create and configure stores
- **Product management** — Full CRUD with rich content
- **User management** — Manage roles and permissions
- **Order tracking** — View all platform transactions
- **Stripe verification** — Custom component to verify merchant accounts

### 🔐 Platform

- **Clerk authentication** — Modern auth with social login
- **Role-based access** — Super-admin, Merchant, Buyer roles
- **Session validation** — Protected procedures validate via Payload auth
- **Server-side trust boundary** — Checkout and library re-validate server-side
- **Signature-verified webhooks** — Stripe webhook validation and idempotent handling

---

## 🧰 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router, React Server Components) |
| **Language** | TypeScript 5 (strict) |
| **UI** | React 19, Tailwind CSS, shadcn/ui, Radix UI, Lucide |
| **API** | tRPC 11 — end-to-end type safety, superjson |
| **Data fetching** | TanStack Query 5 (suspense + infinite queries) |
| **Database** | MongoDB via @payloadcms/db-mongodb |
| **CMS** | Payload CMS 3 (collections, webhooks, auth) |
| **Multi-tenancy** | @payloadcms/plugin-multi-tenant (automatic isolation) |
| **Auth** | Clerk + Payload CMS session management |
| **Payments** | Stripe Connect (destination charges, webhooks) |
| **File storage** | Vercel Blob + Sharp (image optimization) |
| **State** | Zustand (cart, theme) |
| **Forms** | React Hook Form + Zod |
| **Runtime / PM** | Bun |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### 1. Prerequisites

- **Bun** ≥ 1.0 (or Node.js 18+)
- A **MongoDB** database (local or Atlas)
- Accounts for **Stripe**, **Clerk**, and **Vercel Blob**

### 2. Clone and install

```bash
git clone https://github.com/BeshoyRomany/multitenant-ecommerce.git
cd multitenant-ecommerce
bun install
```

### 3. Environment variables

Create a `.env` file in the project root:

```bash
# App — must match the URL the browser and webhooks actually use
NEXT_PUBLIC_APP_URL=https://localhost:3002

# Database (MongoDB)
DATABASE_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname

# Payload CMS
PAYLOAD_SECRET=your-random-secret-key-here

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional: Clerk Auth (if integrating)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

### 4. Set up the database

```bash
bun run payload:migrate:fresh   # initialize schema
bun run db:seed                 # seed sample data
```

### 5. Run it

```bash
bun run dev
```

The dev command starts:
- **Next.js dev server** on `:3000`
- **SSL proxy** on `:3002` — Required for Stripe webhook testing locally

Open **https://localhost:3002** in your browser.

> **⚠️ Webhooks:** In another terminal, listen for Stripe events using the Stripe CLI:
> ```bash
> stripe listen --forward-to https://localhost:3002/api/stripe/webhooks --skip-verify
> ```
> The `--skip-verify` flag is needed because localhost uses a self-signed certificate. Without the webhook listener, orders won't be recorded and checkouts will stay pending.

To run just the app (without SSL proxy):

```bash
bun run next-dev
```

---

## 📜 Scripts

| Command | Description |
| :--- | :--- |
| `bun run dev` | Start Next.js + SSL proxy (port 3002) |
| `bun run next-dev` | Start Next.js dev server only (port 3000) |
| `bun run build` | Production build (type-check included) |
| `bun run start` | Serve the production build |
| `bun run lint` | Run ESLint |
| `bun run payload:types` | Regenerate types from collections |
| `bun run payload:migrate:fresh` | Drop and recreate database schema |
| `bun run db:seed` | Seed sample data (tenants, products, users) |

---

## 🏗️ Architecture

### Modular by feature

Every feature is self-contained — its tRPC router, derived types, and UI all live together:

```
src/
├── app/                       # Next.js routes — thin: prefetch data, render a view
│   ├── (home)/                # Marketplace homepage, categories, browse
│   ├── (tenants)/             # Tenant storefronts (products, checkout)
│   ├── (library)/             # Buyer's purchases and reviews
│   ├── (auth)/                # Sign-in / sign-up
│   ├── (payload)/             # Payload CMS admin + REST/GraphQL API
│   └── api/                   # tRPC handler, Stripe webhooks
├── modules/<feature>/
│   ├── server/procedures.ts   # tRPC router
│   ├── types.ts               # types inferred from router output
│   └── ui/{views,components}
├── collections/               # Payload CMS collections (Users, Products, Orders, etc)
├── db/schema.ts               # Single source of truth for database
├── trpc/                      # Router registry, server caller, client provider
├── lib/                       # Stripe, Payload, access control helpers
└── components/ui/             # shadcn/ui primitives
```

Pages prefetch on the server and hydrate on the client, so storefronts render immediately without a loading waterfall.

### The checkout pipeline

```
Add to cart (client) → Checkout (user submits) → Server validation
                    → Stripe Checkout Session created → Payment
                    → webhook (checkout.session.completed) → Order created
                    → Order links user + product + Stripe session
```

The checkout handler is deliberately ordered **validate → create session**: the expensive Stripe call happens *outside* any row lock, and the final write only lands if the order hasn't already been recorded. Duplicate webhook deliveries are therefore safe and never leave orphaned orders behind.

### Multi-tenant isolation

The Payload multi-tenant plugin automatically:
1. Injects a hidden `tenant` relationship field into products, orders, and tagged collections
2. Filters all reads/writes to the active tenant on request
3. Associates new documents with the current tenant on creation

Result: every tRPC procedure inherits tenant filtering automatically — no manual access checks needed.

### Realtime updates

Server events (order confirmations, payment status) are recorded to the database, and the client refetches via **query invalidation** rather than merging the payload into local state. The UI always reflects the database state, so it can never drift out of sync.

---

## 📄 License

Released under the MIT License.

---

<div align="center">

**Built by [Beshoy Romany](https://github.com/BeshoyRomany)**

⭐ If you find this project useful, consider giving it a star!

</div>
