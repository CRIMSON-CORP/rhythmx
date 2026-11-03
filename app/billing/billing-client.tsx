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

  const verifyPaymentAndPollNextStep = async (
    reference: string,
  ): Promise<{ success: boolean; next_step: string | null; error?: string }> => {
    // Poll up to 10 attempts (every 3 seconds up to ~30s) per Bruno docs
    const maxAttempts = 10;
    const delay = 3000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      // 1. Check verification endpoint directly with Flutterwave
      try {
        const res = await api.post<PaymentVerificationResponse>(
          API_ROUTES.PAYMENTS.VERIFICATION(reference),
          {},
        );

        if (res?.subscription?.status === "active" || res?.payment?.status === "successful") {
          return {
            success: true,
            next_step: res.next_step !== undefined ? res.next_step : null,
          };
        }

        if (res?.payment_status === "pending" || res?.payment?.status === "pending") {
          console.log(`[Verification attempt ${attempt}]: payment is still processing...`);
        }
      } catch (err: unknown) {
        const errorMsg = getErrorMessage(err);
        console.warn(`[Verification attempt ${attempt}] error:`, errorMsg);

        if (errorMsg.includes("not successful") || errorMsg.includes("failed")) {
          return { success: false, next_step: null, error: errorMsg };
        }
      }

      // 2. Cross-check status poll endpoint
      try {
        const pollRes = await api.get<PaymentStatusResponse>(
          API_ROUTES.PAYMENTS.PAYMENT(reference),
        );
        if (pollRes?.payment?.status === "successful") {
          return {
            success: true,
            next_step: pollRes.next_step !== undefined ? pollRes.next_step : null,
          };
        }
        if (pollRes?.payment?.status === "failed") {
          return { success: false, next_step: null, error: "Payment was marked as failed." };
        }
      } catch {
        // continue
      }

      // 3. Check onboarding endpoint for next_step single source of truth
      try {
        const onboardingRes = await api.get<OnboardingStateResponse>(
          API_ROUTES.ONBOARDING.INDEX,
        );
        if (onboardingRes?.wizard?.plan_selected || onboardingRes?.next_step === null) {
          return {
            success: true,
            next_step: onboardingRes.next_step,
          };
        }
      } catch {
        // continue
      }

      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    return {
      success: false,
      next_step: null,
      error: "We are still confirming your payment with Flutterwave. Please check your dashboard in a moment.",
    };
  };

  // Handle Flutterwave return via redirect or reload (?status=successful&tx_ref=...)
  useEffect(() => {
    const status = searchParams.get("status");
    const txRef =
      searchParams.get("tx_ref") ||
      (typeof window !== "undefined" ? sessionStorage.getItem("pending_payment_ref") : null);

    if (txRef && (status === "successful" || status === "completed" || searchParams.has("tx_ref"))) {
      let isMounted = true;
      setIsVerifyingRedirect(true);
      goeyToast.success("Payment received! Verifying your transaction...");

      (async () => {
        const verifyRes = await verifyPaymentAndPollNextStep(txRef);
        if (!isMounted) return;

        if (verifyRes.success) {
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("pending_payment_ref");
          }
          goeyToast.success("Payment verified! Your subscription is now active.");
          try {
            await updateSession?.({ next_step: verifyRes.next_step });
          } catch (e) {
            console.warn("Failed to update session next_step:", e);
          }
          if (verifyRes.next_step === "profile_setup") {
            window.location.href = "/settings/account";
          } else {
            window.location.href = "/";
          }
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
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("pending_payment_ref");
      }
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

      if (typeof window !== "undefined" && res.reference) {
        sessionStorage.setItem("pending_payment_ref", res.reference);
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
            const ref = res.reference || res.checkout!.tx_ref;
            const verifyRes = await verifyPaymentAndPollNextStep(ref);
            if (verifyRes.success) {
              if (typeof window !== "undefined") {
                sessionStorage.removeItem("pending_payment_ref");
              }
              goeyToast.success("Payment verified! Your subscription is now active.");
              try {
                await updateSession?.({ next_step: verifyRes.next_step });
              } catch (e) {
                console.warn("Failed to update session next_step:", e);
              }
              if (verifyRes.next_step === "profile_setup") {
                window.location.href = "/settings/account";
              } else {
                window.location.href = "/";
              }
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
