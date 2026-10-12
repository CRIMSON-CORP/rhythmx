import type { Metadata } from "next";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import BillingClient from "./billing-client";

export const metadata: Metadata = {
  title: "Choose your plan | RhythmX",
  description: "Music distribution plans for artists and record labels.",
};

export default async function BillingPage() {
  let initialPlans: PlanItem[] = [];

  try {
    const res = await api.get<PlansResponse>(API_ROUTES.PLANS.LIST);
    initialPlans = res?.plans || [];
  } catch (error) {
    console.error("Failed to load plans on server for billing page:", error);
  }

  return <BillingClient initialPlans={initialPlans} />;
}
