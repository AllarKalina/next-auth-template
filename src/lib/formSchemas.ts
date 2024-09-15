import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must contain atleast 2 character(s)"),
  email: z
    .string()
    .min(2, "Email must contain atleast 2 character(s)")
    .email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one digit"),
});
