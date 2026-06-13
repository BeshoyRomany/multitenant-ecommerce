# HOW THE MULTI-TENANT PLUGIN WORKS IN THE BACKGROUND (AUTOMATIC ISOLATION):

1. FOR PRODUCTS (AUTOMATIC INJECTION):
   - Field Injection: The plugin automatically adds a hidden 'tenant' relationship field
     into 'products, orders etc...' , linking every product to the 'tenants' collection.
   - Automatic Filtering:
     - On Create: It assigns the active tenant ID to the product or order etc...
     - On Read: It filters the database to show ONLY products or order etc... of the active tenant.

2. FOR USERS (MANUAL LINKING VIA CONFIG): - Because 'includeDefaultField' is set to false, the plugin does NOT inject the field automatically. - Instead, we manually import and spread 'defaultTenantArrayField' inside 'Users.ts'. - This gives us full control over its placement (e.g., inside the Sidebar) and access permissions.
