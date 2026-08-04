# Multitenant E-commerce Platform

<div align="center">
  <img src="public/banner.jpg" alt="Multitenant E-commerce Platform" width="100%" />
  
  [![GitHub stars](https://img.shields.io/github/stars/BeshoyRomany/multitenant-ecommerce?style=social)](https://github.com/BeshoyRomany/multitenant-ecommerce)
  [![GitHub forks](https://img.shields.io/github/forks/BeshoyRomany/multitenant-ecommerce?style=social)](https://github.com/BeshoyRomany/multitenant-ecommerce)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
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

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 15](https://nextjs.org/) — React framework with App Router
- **UI Library:** [React 19](https://react.dev/) — Latest React features
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) — Utility-first CSS
- **Components:** [shadcn/ui](https://ui.shadcn.com/) — Beautiful, accessible UI components
- **UI Framework:** [Radix UI](https://radix-ui.com/) — Low-level component primitives
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) — Lightweight state management
- **Data Fetching:** [tRPC](https://trpc.io/) + [TanStack React Query](https://tanstack.com/query) — Type-safe API queries
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) — Form validation
- **Icons:** [Lucide React](https://lucide.dev/) — Consistent icon library
- **Themes:** [next-themes](https://github.com/pacocoursey/next-themes) — Dark mode support
- **Charts:** [Recharts](https://recharts.org/) — React charting library
- **Toast Notifications:** [Sonner](https://sonner.emilkowal.ski/) — Beautiful toast messages
- **Command Palette:** [cmdk](https://cmdk.paco.sh/) — Command menu component

### Backend & Database
- **CMS:** [Payload CMS 3](https://payloadcms.com/) — Headless CMS with rich API
- **Database:** [MongoDB](https://www.mongodb.com/) via [@payloadcms/db-mongodb](https://github.com/payloadcms/payload/tree/main/packages/db-mongodb)
- **Multi-tenancy:** [@payloadcms/plugin-multi-tenant](https://github.com/payloadcms/payload/tree/main/packages/plugin-multi-tenant) — Automatic isolation
- **Rich Text:** [@payloadcms/richtext-lexical](https://github.com/payloadcms/payload/tree/main/packages/richtext-lexical) — Modern editor

### Authentication & Authorization
- **Auth:** [Clerk](https://clerk.com/) — Modern authentication platform
- **Session:** Payload CMS built-in session management
- **Access Control:** Custom role-based middleware

### Payments
- **Payment Provider:** [Stripe](https://stripe.com/) — Payment processing
- **Integration:** Stripe Connect (destination charges)
- **Webhooks:** Server-side webhook handling for order management

### Storage & Media
- **Cloud Storage:** [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) — Media hosting
- **Image Optimization:** [Sharp](https://sharp.pixelplumbing.com/) — Image processing

### Development Tools
- **Package Manager:** [Bun](https://bun.sh/) — Fast JavaScript runtime and package manager
- **Build Tool:** Next.js built-in bundler
- **Linting:** [ESLint 9](https://eslint.org/) with Next.js config
- **Type Checking:** [TypeScript 5](https://www.typescriptlang.org/) — Static type safety
- **Testing:** No test runner configured (consider adding Jest/Vitest)
- **SSL Proxy:** [local-ssl-proxy](https://github.com/cameronhunter/local-ssl-proxy) — HTTPS for webhooks
- **Task Runner:** [concurrently](https://github.com/open-cli-tools/concurrently) — Run multiple tasks

---

## 🚀 Getting Started

### Prerequisites
Before you begin, ensure you have the following installed:

- **Node.js** 18+ or [Bun](https://bun.sh/) 1.0+
- **MongoDB** (local installation or [MongoDB Atlas](https://mongodb.com/cloud))
- **Stripe account** ([stripe.com](https://stripe.com)) for payment processing
- **Git** for version control

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/BeshoyRomany/multitenant-ecommerce.git
cd multitenant-ecommerce
```

#### 2. Install dependencies
```bash
bun install
# or
npm install
# or
yarn install
```

#### 3. Set up environment variables
Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

**Required environment variables:**

```env
# Database
DATABASE_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname

# Payload CMS
PAYLOAD_SECRET=your-random-secret-key-here

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3002

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### 4. Generate Payload types
```bash
bun run payload:types
```

#### 5. Initialize the database
```bash
bun run payload:migrate:fresh
```

#### 6. (Optional) Seed sample data
```bash
bun run db:seed
```

#### 7. Start the development server
```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

---

## 📚 Available Scripts

### Development
```bash
bun run dev          # Start Next.js dev server + SSL proxy (port 3002)
bun run next-dev     # Start Next.js dev server only (port 3000)
```

### Build & Deploy
```bash
bun run build        # Build for production
bun run start        # Start production server
```

### Code Quality
```bash
bun run lint         # Run ESLint
```

### Database
```bash
bun run payload:types           # Regenerate types from collections
bun run payload:migrate:fresh   # Drop and recreate database
bun run db:seed                 # Seed sample data
```

---

## 📁 Project Structure

```
multitenant-ecommerce/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (app)/                   # Storefront layout
│   │   │   ├── (home)/              # Marketplace homepage
│   │   │   ├── (tenants)/           # Tenant storefronts
│   │   │   │   └── tenants/[slug]/
│   │   │   ├── (library)/           # Buyer's purchases
│   │   │   ├── (auth)/              # Sign-in/Sign-up
│   │   │   └── (checkout)/          # Checkout flow
│   │   ├── (payload)/               # Payload CMS admin
│   │   │   └── api/                 # REST/GraphQL API
│   │   ├── api/
│   │   │   ├── trpc/                # tRPC endpoints
│   │   │   └── stripe/              # Stripe webhooks
│   │   └── layout.tsx
│   │
│   ├── collections/                 # Payload CMS collections
│   │   ├── Users.ts
│   │   ├── Media.ts
│   │   ├── Products.ts
│   │   ├── Categories.ts
│   │   ├── Tags.ts
│   │   ├── Tenants.ts
│   │   ├── Orders.ts
│   │   └── Reviews.ts
│   │
│   ├── modules/                     # Feature modules
│   │   ├── auth/
│   │   ├── checkout/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── tenants/
│   │   ├── library/
│   │   ├── reviews/
│   │   └── home/
│   │
│   ├── trpc/                        # tRPC configuration
│   │   ├── init.ts
│   │   ├── routers/
│   │   ├── server.tsx
│   │   └── client.tsx
│   │
│   ├── components/                  # Shared UI components
│   │   ├── ui/                      # shadcn/ui primitives
│   │   └── [other components]
│   │
│   ├── lib/                         # Utilities
│   │   ├── access.ts
│   │   └── [other utilities]
│   │
│   ├── payload.config.ts            # CMS configuration
│   └── seed.ts                      # Database seeding
│
├── public/                          # Static assets
│   ├── banner.jpg
│   └── [other images]
│
├── .env.example                     # Environment template
├── CLAUDE.md                        # Developer guide
├── MULTITENANT.md                   # Architecture notes
└── package.json
```

---

## 🔗 API Routes

### tRPC Routers
All endpoints at `/api/trpc/[trpc]`:

| Router | Procedures |
|--------|-----------|
| `auth` | `register`, `signin`, `signout`, `profile` |
| `tenants` | `getOne`, `getMany`, `create`, `update` |
| `products` | `getOne`, `getMany`, `create`, `update`, `delete` |
| `checkout` | `purchase`, `getProducts`, `getSession` |
| `library` | `getOne`, `getMany` (purchase-verified) |
| `reviews` | `getMany`, `create`, `update`, `delete` |
| `categories` | `getMany` |
| `tags` | `getMany` |

### Payload REST/GraphQL
- **REST API:** `/api/[collection]`
- **GraphQL:** `/graphql`

### Stripe Webhooks
- **Endpoint:** `/api/stripe/webhooks`
- **Events:** `checkout.session.completed`, `charge.failed`, etc.

---

## 🌐 Routes

### Public Routes
- `/` — Marketplace homepage
- `/[category]/[subcategory]` — Browse by category
- `/tenants/[slug]` — Tenant storefront
- `/tenants/[slug]/products/[productId]` — Product detail
- `/auth/sign-in` — Sign-in page
- `/auth/sign-up` — Sign-up page

### Protected Routes
- `/tenants/[slug]/checkout` — Checkout (authenticated)
- `/library` — My purchases (authenticated)
- `/library/[productId]` — Owned product + reviews (purchase-verified)
- `/admin` — Payload CMS dashboard (admin role)

---

## 🔐 Security

This project follows security best practices:

- **Trust boundary enforcement** — Server-side validation for checkout and ownership
- **Tenant isolation** — Automatic filtering via Payload multi-tenant plugin
- **Session validation** — Protected procedures validate via Payload auth
- **Role-based access** — Collections enforce access based on roles and tenant membership
- **Environment secrets** — All sensitive keys kept in `.env` (never committed)
- **HTTPS for webhooks** — SSL proxy (port 3002) for local Stripe webhook testing

---

## 📦 Collections Schema

### Users
- Email, password, roles, tenant ownership array
- Role-based access control (super-admin, merchant, buyer)

### Tenants
- Store name, slug, description, Stripe account ID
- Owned by users (seller accounts)

### Products
- Title, description, price, media, categories, tags
- Tenant-scoped (automatic isolation via plugin)

### Orders
- User reference, product reference, quantity, total price, Stripe session ID
- Marks completed purchases for ownership verification

### Reviews
- Author, rating, content, product reference
- Only accessible to verified purchasers

### Media
- Uploaded images and files
- Stored in Vercel Blob, optimized with Sharp

### Categories & Tags
- Product taxonomy for navigation

---

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Set environment variables in project settings
4. Deploy (automatic on push to main)

### Environment Variables for Production
```env
DATABASE_URI=your-mongodb-atlas-uri
PAYLOAD_SECRET=your-strong-secret
NEXT_PUBLIC_APP_URL=https://yourdomain.com
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Database
Use [MongoDB Atlas](https://mongodb.com/cloud) for production:
1. Create a cluster
2. Copy connection string
3. Allowlist your Vercel IP in network settings

### Media Storage
Use [Vercel Blob](https://vercel.com/docs/storage/vercel-blob):
- Automatically available on Vercel
- No additional configuration needed

---

## 📖 Documentation

- **[CLAUDE.md](./CLAUDE.md)** — Detailed architecture for developers
- **[MULTITENANT.md](./MULTITENANT.md)** — Multi-tenancy deep dive
- **[Payload CMS Docs](https://payloadcms.com/docs)** — Official documentation
- **[Next.js Docs](https://nextjs.org/docs)** — Framework documentation
- **[Stripe Docs](https://stripe.com/docs)** — Payment integration
- **[tRPC Docs](https://trpc.io/docs)** — Type-safe APIs

---

## 🐛 Troubleshooting

### Issue: Stripe webhooks not working locally
**Solution:** Use `bun run dev` to start the SSL proxy on port 3002. Alternatively, use Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhooks
```

### Issue: Database connection errors
**Solution:** 
- Verify `DATABASE_URI` in `.env`
- Check MongoDB Atlas network access (allowlist your IP)
- Ensure MongoDB service is running (if local)

### Issue: Types out of sync
**Solution:** Regenerate types after editing collections:
```bash
bun run payload:types
```

### Issue: Port already in use
**Solution:**
```bash
# Find process on port 3000
lsof -i :3000
# Kill it
kill -9 <PID>
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to branch: `git push origin feature/your-feature`
5. **Open** a Pull Request

Please ensure:
- Code follows the existing style
- No console errors or warnings
- Meaningful commit messages

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — free to use for personal and commercial projects.

---

## 👨‍💻 Author

**Beshoy Romany**

- [GitHub](https://github.com/BeshoyRomany)
- [Email](mailto:beshoyromany.jobs@gmail.com)
- [Portfolio](https://beshoyromany.com)

---

## 🙏 Acknowledgments

Special thanks to:
- [Payload CMS](https://payloadcms.com/) — Incredible headless CMS
- [Next.js](https://nextjs.org/) — Amazing React framework
- [Stripe](https://stripe.com/) — Payment processing
- [Clerk](https://clerk.com/) — Modern authentication
- [shadcn/ui](https://ui.shadcn.com/) — Beautiful components
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS
- [Bun](https://bun.sh/) — Fast package manager

---

<div align="center">

### ⭐ If you find this useful, please give it a star!

Made with ❤️ by [Beshoy Romany](https://github.com/BeshoyRomany)

[⬆ Back to Top](#multitenant-e-commerce-platform)

</div>
