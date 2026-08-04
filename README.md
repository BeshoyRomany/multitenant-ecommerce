# Multitenant E-commerce Platform

<div align="center">
  <img src="public/banner.jpg" alt="Multitenant E-commerce Platform" width="100%" />
</div>

---

## 📋 Overview

A modern, scalable **multi-tenant e-commerce platform** built with cutting-edge technologies. This is a full-stack solution where each seller (tenant) gets their own isolated storefront with complete product management, inventory control, and payment processing through Stripe Connect.

**Key Highlights:**
- 🏪 **Complete multi-tenant isolation** — Each tenant's data is automatically filtered and protected
- 💳 **Stripe Connect integration** — Secure payments with destination charges per merchant
- 🔐 **Authentication** — Clerk + Payload CMS built-in auth with role-based access control
- 📱 **Fully responsive** — Mobile-first design optimized for all devices
- 🌐 **Bilingual support** — English & Arabic (i18n) built-in
- 📦 **Product management** — Rich content editor, media library, categories, tags
- ⭐ **Review system** — Customer reviews from verified purchasers
- 🛒 **Smart cart** — Per-tenant cart with localStorage persistence
- 📊 **Admin dashboard** — Payload CMS with tenant isolation and super-admin override
- 🔒 **Security first** — Server-side validation, ownership verification, trust boundaries

---

## ⭐ Features

### Multi-Tenant Architecture
- **Complete data isolation** — Each tenant's products, orders, and content are automatically filtered
- **Automatic tenant assignment** — Products and orders inherit the active tenant on creation
- **Tenant-scoped routing** — Each store accessible via `/tenants/[slug]`
- **User-to-tenant mapping** — Each user can own and manage multiple stores
- **Super-admin override** — Admins can view and manage all tenants

### Authentication & Authorization
- **Modern auth** — Clerk integration with social login support
- **Role-based access control** — Super-admin, Merchant, Buyer roles
- **Session management** — Payload session tokens with custom access control
- **Protected procedures** — tRPC protected procedures validate session and user
- **Multi-tenant user matrix** — Track which tenants each user owns

### Checkout & Payments
- **Per-tenant carts** — Cart state in localStorage, keyed by tenant slug
- **Server-side validation** — Products and prices re-validated before checkout
- **Stripe Connect** — Each line item routed to correct merchant via destination charges
- **Secure checkout sessions** — Stripe Checkout with tenant isolation
- **Order recording** — Webhooks create Orders linking user + product + Stripe session

### Content & Media Management
- **Bilingual CMS** — All labels support English and Arabic
- **Rich text editor** — Lexical-based editor for product descriptions
- **Media library** — Integrated with Vercel Blob storage and Sharp optimization
- **Hierarchical organization** — Categories, subcategories, and tags
- **Dynamic images** — Automatic optimization and responsive images

### Post-Purchase Features
- **Purchase verification** — Library shows only purchased products
- **Review system** — Leave reviews only on purchased items
- **Ownership gates** — Access control based on verified purchases
- **Order history** — Track all transactions and purchases

### Admin Features
- **Payload CMS dashboard** — Accessible at `/admin`
- **Tenant management** — Create, edit, and manage stores
- **Product management** — Full CRUD with rich content
- **User management** — Manage users and roles
- **Stripe verification** — Custom component to verify merchant accounts
- **Order tracking** — View all orders and transactions

---

## 🏗️ Architecture

### Modular by feature

Every feature is self-contained — its tRPC router, derived types, and UI all live together:

```
src/
├── app/                          # Next.js routes — thin: prefetch data, render a view
│   ├── (home)/                   # Feed, search, watch page, playlists, channels
│   ├── (tenants)/                # Tenant storefronts
│   ├── (auth)/                   # Clerk sign-in / sign-up
│   └── api/                      # tRPC handler, webhooks, AI workflows, uploads
│
├── modules/<feature>/            # Feature module (domain-organized)
│   ├── server/procedures.ts      # tRPC router
│   ├── types.ts                  # Types inferred from router output
│   └── ui/
│       ├── views/                # Top-level page components
│       └── components/           # Domain-specific components
│
├── collections/                  # Payload CMS collections (data layer)
│   ├── Users.ts
│   ├── Products.ts
│   ├── Orders.ts
│   └── ...
│
├── db/schema.ts                  # Single source of truth for database schema
├── trpc/                         # tRPC registry, server caller, client provider
├── lib/                          # Shared utilities (auth, validation, helpers)
└── components/ui/               # shadcn/ui primitives
```

---

## 📚 Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start the Next.js dev server + SSL proxy (port 3002) |
| `bun run next-dev` | Start Next.js dev server only (port 3000) |
| `bun run build` | Production build (type-check included) |
| `bun run start` | Serve the production build |
| `bun run lint` | Run ESLint |
| `bun run payload:types` | Regenerate types from collections |
| `bun run payload:migrate:fresh` | Drop and recreate database |
| `bun run db:seed` | Seed sample data |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router, React Server Components) |
| **Language** | TypeScript 5 (strict) |
| **UI** | React 19, Tailwind CSS 4, shadcn/ui, Radix UI, Lucide |
| **API** | tRPC 11 — end-to-end type safety, superjson |
| **Data fetching** | TanStack React Query 5 (suspense + infinite queries) |
| **Database** | MongoDB via @payloadcms/db-mongodb |
| **ORM** | Payload CMS 3 + Mongoose |
| **Auth** | Clerk + Payload CMS session management |
| **Payments** | Stripe Connect (destination charges) |
| **File storage** | Vercel Blob + Sharp (image optimization) |
| **State** | Zustand (cart, theme) |
| **Forms** | React Hook Form + Zod |
| **Utilities** | date-fns, clsx, tailwind-merge |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ or [Bun](https://bun.sh/)
- **MongoDB** (local or Atlas)
- **Stripe account** for payments

### 1. Clone and install

```bash
git clone https://github.com/BeshoyRomany/multitenant-ecommerce.git
cd multitenant-ecommerce
bun install
```

### 2. Environment variables

Create a `.env.local` file in the project root:

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
```

### 3. Initialize the database

```bash
bun run payload:migrate:fresh
bun run db:seed
```

### 4. Start the dev server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Documentation

Detailed guides are in:
- **[CLAUDE.md](./CLAUDE.md)** — Architecture for developers
- **[MULTITENANT.md](./MULTITENANT.md)** — Multi-tenancy deep dive
- **[Payload CMS Docs](https://payloadcms.com/docs)** — Official CMS docs
- **[Next.js Docs](https://nextjs.org/docs)** — Framework docs
- **[Stripe Docs](https://stripe.com/docs)** — Payment integration

---

## 🔐 Security

This project follows these security practices:

- **Trust boundary enforcement** — Checkout and library procedures re-validate server-side
- **Tenant isolation** — Automatic filtering via Payload multi-tenant plugin
- **Session validation** — Protected procedures validate via Payload auth
- **Role-based access** — Collections enforce access based on roles and tenant membership
- **Environment secrets** — All sensitive keys in `.env.local` (never committed)
- **HTTPS for webhooks** — SSL proxy on port 3002 for local Stripe webhook testing

---

## 🤝 Contributing

Contributions are welcome!

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m "feat: describe your change"`
4. **Push** to the branch: `git push origin feature/your-feature`
5. **Open** a Pull Request

---

## 📄 License

Released under the MIT License.

---

<div align="center">

### Built by [Beshoy Romany](https://github.com/BeshoyRomany)

⭐ If you find this project useful, consider giving it a star!

Made with ❤️ by [Beshoy Romany](https://github.com/BeshoyRomany)

[⬆ Back to Top](#multitenant-e-commerce-platform)

</div>
