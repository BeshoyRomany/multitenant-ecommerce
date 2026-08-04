# Multitenant E-commerce Platform

<div align="center">
  <img src="public/auth-bg.png" alt="Multitenant E-commerce Platform" width="100%" />
</div>

---

## 📋 Overview

A modern, scalable **multi-tenant e-commerce platform** built with cutting-edge technologies. Each seller (tenant) gets their own isolated storefront with complete product management, inventory control, and payment processing through Stripe Connect. Buyers can browse multiple tenant stores, build per-tenant carts, and checkout securely.

**Live Features:**
- 🏪 **Multi-tenant architecture** — Complete isolation per seller/tenant
- 💳 **Stripe Connect integration** — Secure payments with destination charges
- 🔐 **Clerk Authentication** — Modern, secure user authentication
- 📱 **Responsive design** — Mobile-first, optimized for all devices
- 🌐 **Bilingual support** — English & Arabic (i18n)
- 📦 **Product management** — Rich content with media, categories, tags
- ⭐ **Review system** — Customer reviews and ratings
- 🛒 **Smart cart** — Per-tenant cart persistence with localStorage
- 🔒 **Access control** — Role-based permissions (super-admin, merchant, buyer)
- 📊 **Admin dashboard** — Payload CMS with tenant isolation

---

## 🚀 Tech Stack

### Frontend
- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **UI Framework:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Component Library:** [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://radix-ui.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching:** [tRPC](https://trpc.io/) + [TanStack React Query](https://tanstack.com/query)
- **Form Handling:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Themes:** [next-themes](https://github.com/pacocoursey/next-themes)

### Backend & Database
- **CMS:** [Payload CMS 3](https://payloadcms.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) via [@payloadcms/db-mongodb](https://github.com/payloadcms/payload/tree/main/packages/db-mongodb)
- **ORM/Query:** Mongoose (via Payload)
- **Multi-tenancy:** [@payloadcms/plugin-multi-tenant](https://github.com/payloadcms/payload/tree/main/packages/plugin-multi-tenant)

### Authentication & Authorization
- **Authentication:** [Clerk](https://clerk.com/) (via Payload's built-in auth)
- **Session Management:** Payload session tokens + custom access control
- **Role-based Access Control:** Super-admin, Merchant, Buyer roles

### Payments & Commerce
- **Payment Provider:** [Stripe](https://stripe.com/)
- **Integration Pattern:** Stripe Connect (destination charges per line item)
- **Checkout Flow:** Server-side validation + Stripe Checkout Sessions
- **Webhook Handling:** `src/app/api/stripe/webhooks/route.ts`

### Utilities & Libraries
- **Media Storage:** [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) + [Sharp](https://sharp.pixelplumbing.com/) for image optimization
- **Rich Text Editor:** [@payloadcms/richtext-lexical](https://github.com/payloadcms/payload/tree/main/packages/richtext-lexical)
- **Date Handling:** [date-fns](https://date-fns.org/)
- **Toast Notifications:** [Sonner](https://sonner.emilkowal.ski/)
- **Command Palette:** [cmdk](https://cmdk.paco.sh/)
- **Charts:** [Recharts](https://recharts.org/)
- **Utilities:** clsx, class-variance-authority, tailwind-merge

### Development Tools
- **Package Manager:** [Bun](https://bun.sh/)
- **Build Tool:** Next.js built-in bundler
- **Linting:** [ESLint 9](https://eslint.org/) with Next.js config
- **Type Checking:** [TypeScript 5](https://www.typescriptlang.org/)
- **SSL Proxy:** [local-ssl-proxy](https://github.com/cameronhunter/local-ssl-proxy) (for Stripe webhook testing)
- **Task Runner:** [concurrently](https://github.com/open-cli-tools/concurrently)

---

## 📦 Installation

### Prerequisites
- **Node.js** 18+ (or [Bun](https://bun.sh/) 1.0+)
- **MongoDB** (local or Atlas)
- **Stripe account** (for payment integration)
- **Environment variables** (see `.env.example`)

### Setup Steps

#### 1. Clone the repository
```bash
git clone https://github.com/BeshoyRomany/multitenant-ecommerce.git
cd multitenant-ecommerce
```

#### 2. Install dependencies
```bash
bun install
# or with npm/yarn/pnpm
npm install
```

#### 3. Configure environment variables
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

**Required environment variables:**
- `DATABASE_URI` — MongoDB connection string
- `PAYLOAD_SECRET` — Random string for session encryption
- `NEXT_PUBLIC_APP_URL` — Your app's public URL (e.g., `https://localhost:3002` for local testing)
- `STRIPE_SECRET_KEY` — Stripe secret key
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret

#### 4. Generate Payload types
```bash
bun run payload:types
```

#### 5. Set up the database
```bash
bun run payload:migrate:fresh
```

#### 6. (Optional) Seed sample data
```bash
bun run db:seed
```

---

## 🛠️ Development

### Start the development server
```bash
bun run dev
```

This runs two services concurrently:
- **Next.js dev server** on `http://localhost:3000`
- **SSL proxy** forwarding `https://localhost:3002` → `http://localhost:3000` (required for Stripe webhook testing)

### Next.js dev only (without SSL proxy)
```bash
bun run next-dev
```

### Build for production
```bash
bun run build
```

### Start production server
```bash
bun run start
```

### Lint code
```bash
bun run lint
```

### Regenerate Payload types (after editing collections)
```bash
bun run payload:types
```

### Refresh database schema
```bash
bun run payload:migrate:fresh
```

### Seed the database
```bash
bun run db:seed
```

---

## 🏗️ Project Structure

### Key Directories
```
src/
├── app/                          # Next.js App Router
│   ├── (app)/                    # Storefront layout
│   │   ├── (home)/              # Main marketplace
│   │   ├── (tenants)/           # Tenant storefronts
│   │   ├── (library)/           # Buyer's purchased products
│   │   ├── (auth)/              # Sign-in / Sign-up
│   │   └── (checkout)/          # Checkout flow
│   ├── (payload)/               # Payload CMS admin & API
│   │   └── api/                 # REST/GraphQL endpoints
│   ├── api/
│   │   ├── trpc/               # tRPC endpoints
│   │   └── stripe/             # Stripe webhooks
│   └── layout.tsx              # Root layout
│
├── collections/                 # Payload CMS collections
│   ├── Users.ts
│   ├── Media.ts
│   ├── Products.ts
│   ├── Categories.ts
│   ├── Tags.ts
│   ├── Tenants.ts
│   ├── Orders.ts
│   └── Reviews.ts
│
├── modules/                     # Feature modules (domain-organized)
│   ├── auth/                   # Authentication logic
│   ├── checkout/               # Cart & checkout
│   ├── products/               # Product browsing
│   ├── categories/             # Category management
│   ├── tenants/                # Tenant/store management
│   ├── library/                # Purchased products
│   ├── reviews/                # Review system
│   └── home/                   # Homepage & marketplace
│
├── trpc/                        # tRPC configuration
│   ├── init.ts                 # Procedure definitions
│   ├── routers/                # Router definitions
│   ├── server.tsx              # Server-side helpers
│   └── client.tsx              # Client-side provider
│
├── components/                 # Shared UI components
│   ├── ui/                     # shadcn/ui primitives
│   └── [other shared components]
│
├── lib/                         # Utilities & helpers
│   ├── access.ts               # Access control logic
│   └── [utilities]
│
├── payload.config.ts           # Payload CMS configuration
└── seed.ts                      # Database seeding
```

---

## 🎯 Core Features

### 1. Multi-Tenant Architecture
- **Complete isolation** — Each tenant's data is automatically filtered by the Payload multi-tenant plugin
- **Tenant slug routing** — Storefronts accessible at `/tenants/[slug]`
- **Automatic tenant assignment** — Products, orders, and content are linked to the active tenant on creation
- **User-to-tenant mapping** — Each user can own and manage multiple tenants (sellers)

### 2. Authentication & Authorization
- **Clerk integration** — Modern, secure authentication with support for social login
- **Role-based access control** — Roles: `super-admin`, `merchant`, `buyer`
- **Multi-tenant user matrix** — Users have a `tenants` array to track which stores they own
- **Protected procedures** — tRPC protected procedures validate session and attach `ctx.db` and `ctx.session.user`

### 3. Checkout & Payments
- **Per-tenant carts** — Cart state stored in localStorage, keyed by tenant slug
- **Server-side validation** — Products and pricing re-validated on server before checkout
- **Stripe Connect** — Each line item routed to the correct merchant account via destination charges
- **Secure sessions** — Stripe Checkout Sessions created with tenant isolation
- **Order recording** — Stripe webhook handler creates `Orders` docs linking user + product + checkout session

### 4. Library & Ownership Verification
- **Purchase verification** — `/library` only shows products the user has actually purchased
- **Orders collection** — Tracks all transactions with links to user, product, and Stripe session ID
- **Post-purchase features** — Reviews and digital content access gated by verified purchase

### 5. Content Management
- **Bilingual CMS** — All collection labels and field labels support English (`en`) and Arabic (`ar`)
- **Rich text editor** — Lexical-based editor for product descriptions, blogs, etc.
- **Media management** — Integrated media library with Vercel Blob storage
- **Categories & tags** — Hierarchical product organization
- **Dynamic images** — Automatic image optimization with Sharp

### 6. Admin Dashboard
- **Payload CMS UI** — Accessible at `/admin`
- **Tenant-scoped views** — Admin users see only their tenant's data
- **Super-admin overrides** — Super-admin users can view/manage all tenants
- **Stripe verification component** — Custom sidebar component to verify Stripe account status

---

## 🔐 Security Highlights

- **Trust boundary enforcement** — Checkout and library procedures re-validate data server-side
- **Tenant isolation** — Multi-tenant plugin filters all reads/writes automatically
- **Session validation** — Protected procedures validate the session via Payload
- **Environment secrets** — Stripe keys, database URIs, and secrets are never exposed client-side
- **Role-based access** — Collections enforce access control based on user roles and tenant membership

---

## 🌐 API Routes

### tRPC Routers
All routers are mounted at `/api/trpc/[trpc]` and organized by domain:

| Router | Key Procedures |
|--------|-----------------|
| `auth` | `register`, `signin`, `signout`, `profile` |
| `tenants` | `getOne`, `getMany`, `create`, `update` |
| `products` | `getOne`, `getMany`, `create`, `update`, `delete` |
| `checkout` | `purchase`, `getProducts`, `getSession` |
| `library` | `getOne`, `getMany` (purchase-gated) |
| `reviews` | `getMany`, `create`, `update`, `delete` |
| `categories` | `getMany` |
| `tags` | `getMany` |

### Stripe Webhooks
- **Endpoint:** `/api/stripe/webhooks`
- **Events:** `checkout.session.completed`, `charge.failed`, etc.
- **Actions:** Creates `Orders` docs, updates inventory, sends confirmations

### Payload REST/GraphQL
- **REST:** `/api/...` (auto-generated from collections)
- **GraphQL:** `/graphql` (auto-generated from collections)

---

## 📊 Database Schema

### Key Collections
- **Users** — Registered users with roles and tenant ownership
- **Tenants** — Store/merchant accounts linked to users
- **Products** — Merchant products, isolated per tenant
- **Orders** — Purchase records linking user + product + Stripe session
- **Reviews** — Product reviews from verified purchasers
- **Media** — Images, files, and rich-text assets
- **Categories** — Product taxonomy
- **Tags** — Product tagging system

---

## 🛣️ Routing Map

### Public Routes
- `/` — Marketplace homepage
- `/[category]/[subcategory]` — Category browsing
- `/tenants/[slug]` — Tenant storefront
- `/tenants/[slug]/products/[productId]` — Product detail
- `/auth/sign-in` — Sign-in page
- `/auth/sign-up` — Sign-up page

### Protected Routes
- `/tenants/[slug]/checkout` — Checkout (authenticated users only)
- `/library` — My purchases (authenticated users only)
- `/library/[productId]` — Product + reviews (purchase-verified)
- `/admin` — Payload CMS admin (authenticated + admin role)

---

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect to [Vercel](https://vercel.com/)
3. Set environment variables in project settings
4. Deploy with `git push` (auto-builds and deploys)

### Environment Variables for Deployment
Ensure these are set in your hosting provider:
```
DATABASE_URI
PAYLOAD_SECRET
NEXT_PUBLIC_APP_URL
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

### Database
Use **MongoDB Atlas** for a managed, scalable database:
1. Create a free cluster at [mongodb.com/cloud](https://mongodb.com/cloud)
2. Get the connection string
3. Set `DATABASE_URI` to your connection string

### Media Storage
Use **Vercel Blob** for media storage (works out-of-the-box on Vercel):
1. Enable Blob in Vercel project settings
2. Create an API token
3. Media will be stored and served automatically

---

## 📝 Environment Variables Reference

Create a `.env` file in the root directory with these variables:

```env
# Database
DATABASE_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Payload & Security
PAYLOAD_SECRET=your-random-secret-key-here

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3002

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional: Payload Cloud (if using)
PAYLOAD_CLOUD_ENDPOINT=...
```

See `.env.example` for a complete template.

---

## 📚 Documentation

- **[CLAUDE.md](./CLAUDE.md)** — Detailed architecture guide for developers
- **[MULTITENANT.md](./MULTITENANT.md)** — Multi-tenant plugin deep-dive
- **[Payload CMS Docs](https://payloadcms.com/docs)** — Official Payload documentation
- **[Next.js Docs](https://nextjs.org/docs)** — Next.js 15 App Router documentation
- **[Stripe Docs](https://stripe.com/docs)** — Stripe payment integration guides
- **[tRPC Docs](https://trpc.io/docs)** — tRPC full-stack type safety

---

## 🐛 Troubleshooting

### Stripe webhooks not working locally
Ensure you're running `bun run dev` (which starts the SSL proxy on port 3002). The proxy is required for local HTTPS testing. Alternatively, use `stripe listen --forward-to localhost:3000/api/stripe/webhooks` with the Stripe CLI.

### Database connection errors
- Verify your `DATABASE_URI` is correct
- Check MongoDB Atlas network access (allow your IP)
- Ensure the MongoDB service is running (if local)

### Type generation issues
After modifying any collection in `src/collections/`, run:
```bash
bun run payload:types
```

### Port 3000 already in use
Kill the process on port 3000:
```bash
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Beshoy Romany**  
[GitHub](https://github.com/BeshoyRomany) • [Email](mailto:beshoyromany.jobs@gmail.com)

---

## 🙏 Acknowledgments

- [Payload CMS](https://payloadcms.com/) — Amazing headless CMS
- [Next.js](https://nextjs.org/) — React framework for production
- [Stripe](https://stripe.com/) — Payment processing
- [Clerk](https://clerk.com/) — Authentication
- [shadcn/ui](https://ui.shadcn.com/) — Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS

---

<div align="center">

**⭐ If you find this project useful, please give it a star!**

Made with ❤️ by [Beshoy Romany](https://github.com/BeshoyRomany)

</div>
