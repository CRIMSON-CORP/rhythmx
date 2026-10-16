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
  let initialCurrencies: PaymentCurrenciesResponse | null = null;

  try {
    const [plansRes, currenciesRes] = await Promise.allSettled([
      api.get<PlansResponse>(API_ROUTES.PLANS.LIST),
      api.get<PaymentCurrenciesResponse>(API_ROUTES.PAYMENTS.CURRENCIES),
    ]);

    if (plansRes.status === "fulfilled") {
      initialPlans = plansRes.value?.plans || [];
    }
    if (currenciesRes.status === "fulfilled") {
      initialCurrencies = currenciesRes.value;
    }
  } catch (error) {
    console.error("Failed to load plans or currencies on server:", error);
  }

  return <BillingClient initialPlans={initialPlans} initialCurrencies={initialCurrencies} />;
}
