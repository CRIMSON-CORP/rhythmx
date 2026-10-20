import type { Metadata } from "next";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import BillingClient from "./billing-client";
import { DurationKey } from "./plan-card";

export const metadata: Metadata = {
  title: "Choose your plan | RhythmX",
  description: "Music distribution plans for artists and record labels.",
};

interface BillingPageProps {
  searchParams: Promise<{
    currency?: string;
    cycle?: string;
  }>;
}

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const { currency, cycle } = await searchParams;

  const [plansRes, currenciesRes] = await Promise.all([
    api.get<PlansResponse>(API_ROUTES.PLANS.LIST),
    api.get<PaymentCurrenciesResponse>(API_ROUTES.PAYMENTS.CURRENCIES),
  ]);

  const selectedCurrency = currency || currenciesRes?.default || "GBP";
  const selectedDuration = (cycle as DurationKey) || "annual";

  const plans = await Promise.all(
    (plansRes.plans || []).map(async (plan) => {
      if (plan.is_custom) {
        return { ...plan, converted_total: null };
      }
      const convertRes = await api.get<PaymentConvertResponse>(
        API_ROUTES.PAYMENTS.CONVERT(selectedCurrency, plan.id, selectedDuration),
      );
      return {
        ...plan,
        converted_total: convertRes?.total ?? null,
      };
    }),
  );

  return (
    <BillingClient
      plans={plans}
      currencies={currenciesRes}
      selectedCurrency={selectedCurrency}
      selectedDuration={selectedDuration}
    />
  );
}
