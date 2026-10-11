"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Asterisk, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { goeyToast } from "goey-toast";
import { formatCurrency } from "@/lib/utils";

function formatFeature(feature: PlanFeature): string {
  if (typeof feature.value === "boolean") {
    return feature.name;
  }
  if (typeof feature.value === "number") {
    return `${feature.value} ${feature.name}`;
  }
  return `${feature.name}: ${feature.value}`;
}

export default function PlansGrid({
  plans,
  activePlanId,
}: {
  plans: PlanItem[];
  activePlanId?: number;
}) {
  const router = useRouter();
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);
  const [waitingForPayment, setWaitingForPayment] = useState(false);

  useEffect(() => {
    if (!waitingForPayment) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setWaitingForPayment(false);
        router.refresh();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, [waitingForPayment, router]);

  const handleSelectPlan = async (plan: PlanItem) => {
    try {
      setLoadingPlanId(plan.id);
      const res = await api.post<StartSubscriptionResponse>(API_ROUTES.SUBSCRIPTION.START, {
        plan_id: plan.id,
        billing_cycle: "annual",
        currency: plan.currency || "GBP",
        redirect_url: typeof window !== "undefined" ? window.location.href : undefined,
      });

      if (res?.payment_link) {
        setWaitingForPayment(true);
        const popup = window.open(res.payment_link, "_blank");
        if (!popup) {
          window.location.href = res.payment_link;
        }
      } else {
        goeyToast.error("Failed to generate payment link. Please try again.");
      }
    } catch (error) {
      console.error("Subscription start failed:", error);
    } finally {
      setLoadingPlanId(null);
    }
  };

  if (!plans || plans.length === 0) {
    return (
      <div className="bg-white rounded-20 p-8 text-center text-sm text-default-tertiary">
        No plans currently available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-20">
      {plans.map((plan) => {
        const isCurrentPlan = activePlanId !== undefined && plan.id === activePlanId;
        const includedFeatures = (plan.features || []).filter((f) => f.value !== false);

        return (
          <div key={plan.id} className="rounded-2xl flex flex-col overflow-hidden p-3">
            {/* Top Info */}
            <div className="p-4 flex flex-col gap-2">
              <h4 className="font-medium text-default">{plan.name}</h4>
              <div className="flex items-baseline gap-0.5 text-sm leading-none text-default font-mono">
                {plan.is_custom ? (
                  <span>Custom</span>
                ) : (
                  <>
                    <span>{formatCurrency(plan.price, plan.currency)}</span>
                    <span>/ Year</span>
                  </>
                )}
              </div>
              <p className="text-xs text-default-tertiary font-medium">{plan.description}</p>

              {isCurrentPlan ? (
                <button
                  type="button"
                  disabled
                  className="w-fit mt-1 py-2 px-4 rounded-xl border border-default-default text-default-tertiary font-bold text-xs cursor-default opacity-70"
                >
                  Current Plan
                </button>
              ) : plan.is_custom ? (
                <a
                  href={`mailto:support@rhythmx.com?subject=${encodeURIComponent(
                    `Inquiry about ${plan.name} Plan`,
                  )}`}
                  className="w-fit mt-1 py-2 px-4 rounded-xl border border-brand-orange text-brand-orange font-bold text-xs hover:bg-brand-orange/5 active:scale-98 transition-all text-center"
                >
                  Contact us
                </a>
              ) : (
                <button
                  type="button"
                  disabled={loadingPlanId === plan.id}
                  onClick={() => handleSelectPlan(plan)}
                  className="w-fit mt-1 py-2 px-4 rounded-xl border border-brand-orange text-brand-orange font-bold text-xs hover:bg-brand-orange/5 active:scale-98 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {loadingPlanId === plan.id && <Loader2 size={13} className="animate-spin" />}
                  <span>{activePlanId ? "Upgrade" : "Get Started"}</span>
                </button>
              )}
            </div>

            {/* Bottom Features List */}
            {includedFeatures.length > 0 && (
              <div className="bg-page-background grow p-4 flex flex-col gap-3 rounded-20">
                {includedFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-default-tertiary">
                    <Asterisk className="text-brand-orange flex-none" size={12} />
                    <span className="leading-tight text-default-tertiary font-medium">
                      {formatFeature(feature)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
