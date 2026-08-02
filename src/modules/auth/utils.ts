import { cookies as getCookies } from "next/headers";

interface Props {
  prefix: string;
  value: string;
}
export const generateAuthCookie = async ({ prefix, value }: Props) => {
  const cookies = await getCookies();
  cookies.set({
    name: `${prefix}-token`,
    value: value,
    httpOnly: true,
    path: "/",
    sameSite: "none",
    // Must prefix with "." so the cookie is shared across ALL subdomains
    // (beshoy.sellroad.shop, john.sellroad.shop, sellroad.shop itself),
    // not scoped to a single host only.
    domain:
      process.env.NODE_ENV === "production"
        ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
        : process.env.NEXT_PUBLIC_ROOT_DOMAIN,
    // secure:false in dev + sameSite:"none" = browser rejects the cookie entirely
    // (Chrome/modern browsers require Secure when SameSite is "none")
    // this will cause login to silently fail in development ("not logged in" even after sign-in)
    secure: process.env.NODE_ENV === "production",
  });
};
