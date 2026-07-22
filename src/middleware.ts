import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    //#region (subdomain middleware matcher config rules) Match all paths except for:
    //1. /api routes
    //2. /_next (Next.js internals)
    //3. /_static (inside /public)
    //4. all root files inside /public (e.g. /favicon.ico)
    //
    // WHY: these paths never run through the middleware at all,
    // so "/tenants/beshoy/" never gets prepended to them.
    //#endregion
    "/((?!api|_next|_static|media|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  //#region req.nextUrl properties — visiting: http://beshoy.localhost:3002/products/123?color=red
  //
  // req.nextUrl.href       → "http://beshoy.localhost:3002/products/123?color=red"  (full URL)
  // req.nextUrl.origin     → "http://beshoy.localhost:3002"                          (protocol + host)
  // req.nextUrl.protocol   → "http:"
  // req.nextUrl.host       → "beshoy.localhost:3002"                                 (hostname + port)
  // req.nextUrl.hostname   → "beshoy.localhost"                                      (no port)
  // req.nextUrl.port       → "3002"
  // req.nextUrl.pathname   → "/products/123"                                        (path only)
  // req.nextUrl.search     → "?color=red"                                           (raw query string)
  // req.nextUrl.searchParams.get("color") → "red"                                   (parsed query param)
  //
  // Next.js-specific extras (not on the native URL class):
  // req.nextUrl.locale     → e.g. "en"  (if i18n routing is configured)
  // req.nextUrl.basePath   → e.g. ""    (if app is served under a subpath)
  //#endregion
  const url = req.nextUrl;
  //Extract the hostname (e.q., "beshoy.sellroad.com" or "john.sellroad.com" or "beshoy.localhost:3002")
  const hostname = req.headers.get("host") || "";
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || ""; //rootDomain localhost:3002

  if (hostname.endsWith(`.${rootDomain}`)) {
    //domainName -> localhost:3002 || "sellroad.com"

    // checks about (the end of the hostname) and replace from (.sellroad.com || .localhost:3002) with -> ""
    const tenantSlug = hostname.replace(`.${rootDomain}`, "");

    // TODO: Add subdomain exceptions for `www`, `admin`, `api` etc. before going to production
    // e.g. www.sellroad.com should NOT be rewritten to /tenants/www

    return NextResponse.rewrite(
      //#region new URL(path, req.url OR req.nextUrl.origin) — transformation walkthrough
      //
      // Visiting: http://beshoy.localhost:3002/products/123?color=red
      //
      // req.url  → "http://beshoy.localhost:3002/products/123?color=red"   (full string, used as BASE)
      // tenantSlug = "beshoy"
      // url.pathname = "/products/123"
      //
      // new URL(`/tenants/${tenantSlug}${url.pathname}`, req.url)
      //        ↑ path param                              ↑ base param
      //
      // STEP 1 — build the new path string:
      //   `/tenants/${tenantSlug}${url.pathname}` → "/tenants/beshoy/products/123"
      //
      // STEP 2 — new URL() takes only the protocol + host + port from the base (req.url):
      //   base kept   → "http://beshoy.localhost:3002"
      //   base discarded → "/products/123?color=red"  (old path + query, thrown away)
      //
      // STEP 3 — new path is appended to what was kept from the base:
      //   "http://beshoy.localhost:3002" + "/tenants/beshoy/products/123"
      //
      // RESULT:
      //   → "http://beshoy.localhost:3002/tenants/beshoy/products/123"
      //
      // req.url is passed again NOT to repeat it — it's used only as a template
      // to borrow the domain/protocol/port, since new URL() requires a full,
      // valid URL and can't build one from a relative path alone.

      //NOTE: I Used (req.nextUrl.origin) instead of "req.url" -> it's the same but more cleaner
      //#endregion
      new URL(`/tenants/${tenantSlug}${url.pathname}`, req.nextUrl.origin),
    );
  }
  return NextResponse.next();
}
