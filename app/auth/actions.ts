"use server";

import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";

export async function handleGetStartedAction(email: string) {
  try {
    await api.post(API_ROUTES.AUTH.REGISTER, { email });
  } catch (error: unknown) {
    console.log(error);
    return {
      success: false,
      error: (error as Error).message || "An error occurred while processing your request.",
    };
  }

  if (email) {
    redirect(`/auth/verify?email=${encodeURIComponent(email)}`);
  }
  redirect("/auth/get-started");
}
