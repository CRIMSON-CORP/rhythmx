"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import Icon from "@/components/icon";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { cn, getErrorMessage } from "@/lib/utils";
import { goeyToast } from "goey-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PlanCard, { DURATION_OPTIONS, DurationKey } from "./plan-card";

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
  initialPlans,
  initialCurrencies,
}: {
  initialPlans: PlanItem[];
  initialCurrencies?: PaymentCurrenciesResponse | null;
}) {
  const [plans, setPlans] = useState<PlanItem[]>(initialPlans);
  const [isLoadingPlans, setIsLoadingPlans] = useState(initialPlans.length === 0);

  const initialCodes = extractCurrencyCodes(initialCurrencies);
  const [currencyCodes, setCurrencyCodes] = useState<string[]>(initialCodes);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    initialCurrencies?.default || initialCodes[0] || "GBP",
  );

  const [selectedDuration, setSelectedDuration] = useState<DurationKey>("annual");
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);

  // 1. Fetch live plans if not provided by server
  useEffect(() => {
    if (initialPlans.length > 0) return;

    let isMounted = true;
    async function fetchPlans() {
      try {
        setIsLoadingPlans(true);
        const res = await api.get<PlansResponse>(API_ROUTES.PLANS.LIST);
        if (isMounted && res?.plans) {
          setPlans(res.plans);
        }
      } catch (err) {
        console.error("Failed to load plans on client:", err);
        goeyToast.error("Could not load plans from server. Please refresh the page.");
      } finally {
        if (isMounted) setIsLoadingPlans(false);
      }
    }

    fetchPlans();
    return () => {
      isMounted = false;
    };
  }, [initialPlans]);

  // 2. Fetch supported currencies from GET /api/payments/currencies
  useEffect(() => {
    let isMounted = true;
    async function fetchCurrencies() {
      try {
        const res = await api.get<PaymentCurrenciesResponse>(API_ROUTES.PAYMENTS.CURRENCIES);
        console.log("[GET /api/payments/currencies]:", res);
        if (isMounted && res?.currencies?.length) {
          const codes = res.currencies.map((c) => (typeof c === "string" ? c : c.code));
          setCurrencyCodes(codes);

          setSelectedCurrency((prev) => {
            if (codes.includes(prev)) return prev;
            if (res.default && codes.includes(res.default)) return res.default;
            return codes[0] || prev;
          });
        }
      } catch (err) {
        console.error("Failed to fetch currencies from /api/payments/currencies:", err);
      }
    }

    fetchCurrencies();
    return () => {
      isMounted = false;
    };
  }, []);

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
        redirect_url: typeof window !== "undefined" ? `${window.location.origin}/` : undefined,
      });

      if (res?.payment_link) {
        window.location.href = res.payment_link;
      } else {
        goeyToast.error("Failed to generate payment link. Please try again.");
      }
    } catch (error) {
      console.error("Subscription start failed:", error);
      const msg = getErrorMessage(error, "Failed to start subscription. Please try again.");
      goeyToast.error(msg);
    } finally {
      setLoadingPlanId(null);
    }
  };

  const selectedSymbol = getCurrencySymbol(selectedCurrency);
  const selectedLabel = `${selectedCurrency} (${selectedSymbol})`;

  return (
    <div className="relative min-h-screen w-full bg-white text-[#141414] overflow-x-hidden flex flex-col items-center">
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
                  <button
                    type="button"
                    onClick={() => setSelectedDuration(opt.key)}
                    className={cn(
                      "px-4 py-2 text-sm rounded-full transition-all cursor-pointer select-none",
                      isActive
                        ? "bg-[#18151A] text-[#F5F4F2] font-semibold shadow-xs"
                        : "text-[#625C57] hover:text-[#18151A] hover:bg-neutral-100/50 font-medium",
                    )}
                  >
                    {opt.label}
                  </button>
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
                    onClick={() => setSelectedCurrency(code)}
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
        {isLoadingPlans ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[560px] rounded-[30px] border border-[#D9D9D9] p-6 bg-white animate-pulse flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="h-7 bg-neutral-200 rounded-md w-1/2" />
                  <div className="h-4 bg-neutral-100 rounded-md w-1/3" />
                  <div className="h-10 bg-neutral-200 rounded-md w-2/5 mt-4" />
                  <div className="h-12 bg-neutral-100 rounded-md w-full mt-2" />
                </div>
                <div className="h-14 bg-neutral-200 rounded-[10px] w-full" />
              </div>
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="bg-white rounded-[30px] border border-[#D9D9D9] p-12 text-center max-w-md w-full">
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
