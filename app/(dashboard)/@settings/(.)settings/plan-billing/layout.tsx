import * as React from "react";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import BillingErrorToast from "./billing-error-toast";
import PlanBillingTabs from "./plan-billing-tabs";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default async function PlanBillingLayout({ children }: { children: React.ReactNode }) {
  const subRes = await api
    .get<SubscriptionResponse>(API_ROUTES.SUBSCRIPTION.INDEX)
    .catch((err) => {
      if (isRedirectError(err)) throw err;
      return null;
    });

  const canShare = subRes?.subscription?.plan?.slug === "rhythm-elite";

  return (
    <div className="flex flex-col h-full bg-page-background">
      <React.Suspense fallback={null}>
        <BillingErrorToast />
      </React.Suspense>

      {/* Top Switcher */}
      <PlanBillingTabs canShare={canShare} />

      {/* Scrollable Sub-Page Content */}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
