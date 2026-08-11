"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";

export async function handleGetStartedAction(email: string) {
  try {
    const reqHeaders = await headers();
    const userAgent = reqHeaders.get("user-agent") || undefined;
    await api.post(API_ROUTES.AUTH.REGISTER, { email, userAgent });
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
