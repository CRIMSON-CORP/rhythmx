"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronDown, Check } from "lucide-react";
import Icon from "@/components/icon";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { cn, getErrorMessage } from "@/lib/utils";
import { goeyToast } from "goey-toast";
import { openFlutterwaveCheckout, loadFlutterwaveScript } from "@/lib/flutterwave";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PlanCard, { DURATION_OPTIONS, DurationKey, PlanWithTotal } from "./plan-card";
import { CONSTANTS } from "@/lib/constants";

function getCurrencySymbol(code: string): string {
  try {
    const parts = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      currencyDisplay: "narrowSymbol",
    }).formatToParts(0);
    return parts.find((p) => p.type === "currency")?.value || code;
  } catch {
    return code;
  }
}

function extractCurrencyCodes(res?: PaymentCurrenciesResponse | null): string[] {
  if (!res?.currencies?.length) return ["GBP", "NGN", "USD"];
  return res.currencies.map((item) => (typeof item === "string" ? item : item.code));
}

export default function BillingClient({
  plans,
  currencies,
  selectedCurrency,
  selectedDuration,
}: {
  plans: PlanWithTotal[];
  currencies?: PaymentCurrenciesResponse | null;
  selectedCurrency: string;
  selectedDuration: DurationKey;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { update: updateSession } = useSession();

  const currencyCodes = extractCurrencyCodes(currencies);
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);
  const [isVerifyingRedirect, setIsVerifyingRedirect] = useState(false);

  // Preload Flutterwave inline checkout script
  useEffect(() => {
    loadFlutterwaveScript();
  }, []);

  const buildQuery = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    params.set(name, value);
    return params.toString();
  };

  const handleCurrencyChange = (code: string) => {
    router.replace(`/billing?${buildQuery("currency", code)}`, { scroll: false });
  };

  const verifyPayment = async (
    reference: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await api.post<PaymentVerificationResponse>(API_ROUTES.PAYMENTS.VERIFICATION(reference), {});
      return { success: true };
    } catch (err) {
      console.warn("Direct verification pending or failed, polling status:", err);
      // Poll up to 5 times (total 12.5 seconds)
      for (let attempt = 1; attempt <= 5; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, 2500));
        try {
          const pollRes = await api.get<PaymentStatusResponse>(
            API_ROUTES.PAYMENTS.PAYMENT(reference),
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

  // Handle Flutterwave full-page redirect return (?status=successful&tx_ref=...)
  useEffect(() => {
    const status = searchParams.get("status");
    const txRef = searchParams.get("tx_ref");

    if (status && txRef && (status === "successful" || status === "completed")) {
      let isMounted = true;
      setIsVerifyingRedirect(true);
      goeyToast.success("Payment received! Verifying your transaction...");

      (async () => {
        const verifyRes = await verifyPayment(txRef);
        if (!isMounted) return;

        if (verifyRes.success) {
          goeyToast.success("Payment verified! Your subscription is now active.");
          try {
            await updateSession?.({ next_step: null });
          } catch (e) {
            console.warn("Failed to update session next_step:", e);
          }
          window.location.href = "/";
        } else {
          goeyToast.error(
            verifyRes.error || "Payment verification failed. Please check your dashboard.",
          );
          setIsVerifyingRedirect(false);
        }
      })();

      return () => {
        isMounted = false;
      };
    } else if (status === "cancelled") {
      goeyToast.error("Payment was cancelled.");
    }
  }, [searchParams, updateSession]);

  const handleSelectPlan = async (plan: PlanItem) => {
    if (plan.is_custom) {
      // User requested custom plan CTA does nothing for now
      return;
    }

    try {
      setLoadingPlanId(plan.id);

      const res = await api.post<StartSubscriptionResponse>(API_ROUTES.SUBSCRIPTION.START, {
        plan_id: plan.id,
        billing_cycle: selectedDuration,
        currency: selectedCurrency,
        redirect_url:
          typeof window !== "undefined" ? `${window.location.origin}/billing` : undefined,
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
              try {
                await updateSession?.({ next_step: null });
              } catch (e) {
                console.warn("Failed to update session next_step:", e);
              }
              window.location.href = "/";
              return;
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

  const selectedSymbol = getCurrencySymbol(selectedCurrency);
  const selectedLabel = `${selectedCurrency} (${selectedSymbol})`;

  return (
    <div className="relative min-h-screen w-full bg-white text-[#141414] overflow-x-hidden flex flex-col items-center">
      {isVerifyingRedirect && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-30 p-8 flex flex-col items-center gap-4 shadow-2xl max-w-sm text-center">
            <div className="w-10 h-10 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
            <div className="space-y-1">
              <h3 className="font-semibold text-lg text-[#141414]">Verifying Payment</h3>
              <p className="text-sm text-neutral-500">
                Please wait while we activate your subscription...
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Ambient Gradient Glow from Figma */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-full h-[70vh] blur-[200px] opacity-30"
        style={{
          background:
            "linear-gradient(86.95deg, rgba(151, 71, 255, 0.3) 2.53%, rgba(0, 102, 255,0.3) 102.88%)",
        }}
      />

      <div className="relative z-10 w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col items-center">
        {/* Brand Logo */}
        <div className="mb-8 flex items-center justify-center">
          <Icon name="logo" width={33} height={51} className="text-brand-orange" />
        </div>

        {/* Section Header */}
        <header className="flex flex-col items-center text-center gap-3 max-w-2xl mb-8">
          <h1 className="text-3xl md:text-[32px] font-medium leading-tight text-[#141414]">
            Choose your plan
          </h1>
          <p className="text-base font-medium text-[#707070]">
            Music distribution plans for artists and record labels.
          </p>
        </header>

        {/* Controls Container: Duration Segmented Control + Currency Selector */}
        <div className="flex flex-col items-center gap-4 mb-12">
          {/* Duration Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-[#FDFCFA] rounded-full">
            {DURATION_OPTIONS.map((opt) => {
              const isActive = selectedDuration === opt.key;
              return (
                <div key={opt.key} className="relative">
                  {opt.discountBadge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#DC2626] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-xs pointer-events-none">
                      {opt.discountBadge}
                    </span>
                  )}
                  <Link
                    href={`/billing?${buildQuery("cycle", opt.key)}`}
                    scroll={false}
                    className={cn(
                      "inline-block px-4 py-2 text-sm rounded-full transition-all cursor-pointer select-none text-center",
                      isActive
                        ? "bg-[#18151A] text-[#F5F4F2] font-semibold shadow-xs"
                        : "text-[#625C57] hover:text-[#18151A] hover:bg-neutral-100/50 font-medium",
                    )}
                  >
                    {opt.label}
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Currency Selector Pill */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="h-10 px-4 rounded-full bg-[#F9FAFC]/80 flex items-center gap-2 text-sm font-medium text-[#1E1E1E] cursor-pointer"
              >
                <span>{selectedLabel}</span>
                <ChevronDown size={16} className="text-[#1E1E1E] opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="w-48 max-h-72 overflow-y-auto bg-white border border-[#E5E7EB] shadow-xl p-1.5 rounded-2xl"
            >
              {currencyCodes.map((code) => {
                const symbol = getCurrencySymbol(code);
                return (
                  <DropdownMenuItem
                    key={code}
                    onClick={() => handleCurrencyChange(code)}
                    className="flex items-center justify-between px-3 py-2 text-sm rounded-xl cursor-pointer hover:bg-neutral-100 font-medium text-[#1E1E1E]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{code}</span>
                      <span className="text-xs text-neutral-500">({symbol})</span>
                    </div>
                    {selectedCurrency === code && (
                      <Check size={16} className="text-brand-blue shrink-0" />
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Plans Grid */}
        {plans.length === 0 ? (
          <div className="bg-white rounded-30 border border-[#D9D9D9] p-12 text-center max-w-md w-full">
            <h2 className="text-lg font-medium text-[#1E1E1E] mb-2">No plans available</h2>
            <p className="text-sm text-[#757575] mb-6">
              Unable to find distribution plans at this moment.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-10 bg-black text-white text-sm font-medium hover:bg-black/80"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div
            className={cn(
              "grid gap-6 w-full items-stretch justify-center",
              plans.length === 3
                ? "grid-cols-1 lg:grid-cols-3 max-w-6xl"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl",
            )}
          >
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                selectedCurrency={selectedCurrency}
                selectedDuration={selectedDuration}
                isLoadingAction={loadingPlanId === plan.id}
                onSelectPlanAction={handleSelectPlan}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
