import z from "zod";

export const getStartedSchema = z.object({
  email: z.email("Please enter a valid email address"),
});
