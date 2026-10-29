"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Asterisk, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { goeyToast } from "goey-toast";
import { formatCurrency, getErrorMessage } from "@/lib/utils";
import { CONSTANTS } from "@/lib/constants";
import { openFlutterwaveCheckout, loadFlutterwaveScript } from "@/lib/flutterwave";

const PLAN_TIER_RANK: Record<string, number> = {
  starter: 1,
  kickstart: 2,
  "rhythm-elite": 3,
  "label-master": 4,
};

function getPlanActionLabel(
  plan: PlanItem,
  currentPlan?: { id?: number; slug?: string; price?: number; is_custom?: boolean } | null,
): "Upgrade" | "Downgrade" | "Get Started" {
  if (!currentPlan) return "Get Started";

  const targetSlug = plan.slug?.toLowerCase();
  const currentSlug = currentPlan.slug?.toLowerCase();

  const targetRank = targetSlug ? PLAN_TIER_RANK[targetSlug] : undefined;
  const currentRank = currentSlug ? PLAN_TIER_RANK[currentSlug] : undefined;

  if (targetRank !== undefined && currentRank !== undefined) {
    return targetRank > currentRank ? "Upgrade" : "Downgrade";
  }

  // Fallback if slug ranking is not present
  if (currentPlan.is_custom && !plan.is_custom) return "Downgrade";
  if (plan.is_custom && !currentPlan.is_custom) return "Upgrade";

  return (plan.price ?? 0) > (currentPlan.price ?? 0) ? "Upgrade" : "Downgrade";
}

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
  currentPlan: passedCurrentPlan,
}: {
  plans: PlanItem[];
  activePlanId?: number;
  currentPlan?: { id?: number; slug?: string; name?: string; price?: number; is_custom?: boolean } | null;
}) {
  const router = useRouter();
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);

  const activePlan =
    passedCurrentPlan ??
    (activePlanId !== undefined ? plans.find((p) => p.id === activePlanId) : null);

  // Preload Flutterwave inline checkout script
  useEffect(() => {
    loadFlutterwaveScript();
  }, []);

  const verifyPayment = async (
    reference: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await api.post<PaymentVerificationResponse>(API_ROUTES.PAYMENTS.VERIFY(reference), {});
      return { success: true };
    } catch (err) {
      console.warn("Direct verification pending or failed, polling status:", err);
      // Poll up to 5 times (total 12.5 seconds)
      for (let attempt = 1; attempt <= 5; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, 2500));
        try {
          const pollRes = await api.get<PaymentStatusResponse>(
            API_ROUTES.PAYMENTS.STATUS(reference),
          );
          if (pollRes?.payment?.status === "successful") {
            return { success: true };
          }
          if (pollRes?.payment?.status === "failed") {
            return { success: false, error: "Payment was marked as failed by provider." };
          }
        } catch (pollErr) {
          console.warn(`[Poll attempt ${attempt}] error:`, pollErr);
        }
      }
      return {
        success: false,
        error: "Verification is taking longer than usual. Please check your dashboard in a moment.",
      };
    }
  };

  const handleSelectPlan = async (plan: PlanItem) => {
    if (plan.is_custom) {
      return;
    }

    try {
      setLoadingPlanId(plan.id);
      const res = await api.post<StartSubscriptionResponse>(API_ROUTES.SUBSCRIPTION.START, {
        plan_id: plan.id,
        billing_cycle: "annual",
        currency: plan.currency || "GBP",
        redirect_url: typeof window !== "undefined" ? window.location.href : undefined,
      });

      if (!res?.checkout) {
        throw new Error("Invalid response from server: checkout details missing");
      }

      const checkoutResult = await openFlutterwaveCheckout({
        public_key: res.checkout.public_key,
        tx_ref: res.checkout.tx_ref,
        amount: res.checkout.amount,
        currency: res.checkout.currency,
        payment_options: res.checkout.payment_options || "card, mobilemoney, ussd, banktransfer",
        customer: res.checkout.customer,
        customizations: {
          ...res.checkout.customizations,
          logo: typeof window !== "undefined" ? `${window.location.origin}/favicon.ico` : undefined,
        },
        callback: async (paymentData) => {
          console.log("[Flutterwave Payment Callback]:", paymentData);
          if (paymentData.status === "successful" || paymentData.status === "completed") {
            goeyToast.success("Payment received! Activating your subscription...");
            const verifyRes = await verifyPayment(res.reference || res.checkout!.tx_ref);
            if (verifyRes.success) {
              goeyToast.success("Payment verified! Your subscription is now active.");
              router.refresh();
            } else {
              goeyToast.error(
                verifyRes.error || "Payment verification failed. Please check your dashboard.",
              );
            }
          } else {
            goeyToast.error(`Payment was not successful (Status: ${paymentData.status})`);
          }
          setLoadingPlanId(null);
        },
        onclose: (incomplete) => {
          console.log("[Flutterwave Modal Closed]:", incomplete);
          setLoadingPlanId(null);
        },
      });

      if (!checkoutResult.success) {
        goeyToast.error(checkoutResult.error || "Failed to open payment modal");
        setLoadingPlanId(null);
      }
    } catch (error) {
      console.warn("Subscription start failed:", error);
      const msg = getErrorMessage(error, "Failed to start subscription. Please try again.");
      goeyToast.update(CONSTANTS.GLOBAL_ERROR_TOAST_ID, {
        title: msg,
      });
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
        const isCurrentPlan =
          (activePlan?.id !== undefined && plan.id === activePlan.id) ||
          (activePlanId !== undefined && plan.id === activePlanId);
        const actionLabel = getPlanActionLabel(plan, activePlan);
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
                  <span>{actionLabel}</span>
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
