# HOW THE MULTI-TENANT PLUGIN WORKS IN THE BACKGROUND (AUTOMATIC ISOLATION):

1. FOR PRODUCTS (AUTOMATIC INJECTION):
   - Field Injection: The plugin automatically adds a hidden 'tenant' relationship field
     into 'products, orders etc...' , linking every product to the 'tenants' collection.
   - Automatic Filtering:
     - On Create: It assigns the active tenant ID to the product or order etc...
     - On Read: It filters the database to show ONLY products or order etc... of the active tenant.

2. FOR USERS (MANUAL LINKING VIA CONFIG): - Because 'includeDefaultField' is set to false, the plugin does NOT inject the field automatically. - Instead, we manually import and spread 'defaultTenantArrayField' inside 'Users.ts'. - This gives us full control over its placement (e.g., inside the Sidebar) and access permissions.

## TODO: Protected Media Redesign (Future — Private Media phase)

**Current state (temporary):** `Media.access.read` is `() => true` — all files,
including anything embedded in RichText content, are fully public. This is a
known, intentional simplification for the MVP/learning phase and must be
revisited before real production launch.

### Problem with the old approach

The original `read` access function queried **all products** on every single
file request to check if the file was embedded in protected RichText content,
then cross-checked orders/tenants. This was expensive (content search on every
image load) and fragile — Payload also calls `read` with no `id`/`filename`
when just opening the admin Media list/drawer, which broke that logic entirely
(see the `not-found` crash investigation from this session).

### New design: direct ownership via relationship, not content search

1. **Add two fields to `Media.ts`:**
   - `isProtected` (checkbox, default `false`) — marks a file as needing access control
   - `authorizedUsers` (relationship → `users`, `hasMany: true`, shown only when `isProtected` is true) — explicit list of users allowed to access this file

2. **Simplify `access.read` to:**
   - No `id` (browsing list/drawer) → `true`
   - `id` present but `doc.isProtected` is falsy → `true` (public asset)
   - `doc.isProtected` is true:
     - No `user` → `false`
     - `isSuperAdmin(user)` → `true`
     - `user.id` is in `doc.authorizedUsers` → `true`
     - otherwise → `false`

3. **Populate `authorizedUsers` automatically** in the Stripe webhook
   (`checkout.session.completed` handler), right after an `Order` is created:
   - Identify which purchased product(s) contain protected media in their RichText content
   - `payload.update` the relevant `Media` doc(s), appending the buyer's `user.id`
     to `authorizedUsers`

4. **Decide on tenant-owner access:** merchants who own the product should
   probably also be added to `authorizedUsers` automatically when the protected
   media is attached to their product (not just buyers) — confirm this rule
   before implementing.

### Why this is better

- No content-scanning query on every file request — just a direct relationship
  check (fast, indexable)
- Merchant can see exactly who has access to a protected file from the admin UI
- Easy to grant manual/exceptional access (e.g. support cases) by just adding
  a user to the list directly, without needing a real Stripe order

## TODO: Field-Level Encryption (Post-launch security hardening)

**Goal:** Encrypt sensitive fields at the application level before they're
written to MongoDB, so the data is unreadable even to anyone with direct
database access (including MongoDB Atlas support staff or, in the worst case,
a legal/subpoena scenario).

**Plan:**

1. Decide which fields actually need this (likely: user PII, payment-adjacent
   metadata — NOT Stripe card data itself, since Stripe never touches our DB
   directly for that; check what's actually stored vs. just referenced)
2. Use a Payload `beforeChange` hook to encrypt on write, and `afterRead` hook
   to decrypt on read, per collection/field
3. Store the encryption key OUTSIDE Vercel's environment variables — e.g. a
   separate secrets manager (AWS KMS, HashiCorp Vault, or similar) not tied to
   the same infrastructure as the app/DB
4. This requires a full DB wipe + reseed once implemented, since existing
   plaintext data won't match the new encrypted format
5. Research: Node's built-in `crypto` module (AES-256-GCM) is likely sufficient
   for a first pass — no need for an external library unless requirements grow
