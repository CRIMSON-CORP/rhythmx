import z from "zod";

export const verifySchema = z.object({
  email: z.email("Please enter a valid email address"),
  otp: z.string().min(1, "OTP is required"),
});
