import z from "zod";

export const createAccountSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  marketing_opt_in: z.boolean().default(false),
});

export type CreateAccountFormData = z.infer<typeof createAccountSchema>;
