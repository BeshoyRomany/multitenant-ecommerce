import { ClientUser } from "payload";
import type { User } from "@/payload-types";

//Will retrieve the passed user from the payload cms config
export const isSuperAdmin = (user: User | ClientUser | null) => {
  return Boolean(user?.roles?.includes("super-admin"));
};
