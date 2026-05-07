import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(3, "Password must be at least 3 characters")
    .max(100),
  username: z
    .string()
    .min(3, "Username must be at least 3 character")
    .max(63, "Username must be less than 63 characters")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Username can only contain lowercase letters, numbers and hyphens. It must start and end with a letter or number",
    )
    .refine(
      /*  
              boolean true or false 
              -> if the user typed my--shop it means that val.includes("--") === true
              -- but the (!) it will reverse the true to false
              -> so the val of the refine will be  (val) => false 
              -> so the validation will apply "username cannot ....."
            */
      (val) => {
        if (val.includes("--")) return false;
        return true;

        //shortcut: !val.includes("--");
      },
      "Username cannot contain consecutive hyphens",
    )
    .transform((val) => val.toLocaleLowerCase()),
  //[username].shop.com
});

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string(),
});
