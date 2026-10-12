"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Check, Loader2 } from "lucide-react";
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

interface CurrencyOption {
  code: string;
  label: string;
  name: string;
  symbol: string;
  rateFromGBP: number;
}

const CURRENCIES: CurrencyOption[] = [
  { code: "USD", label: "USD, US Dollar", name: "US Dollar", symbol: "$", rateFromGBP: 1.28 },
  {
    code: "NGN",
    label: "NGN, Nigerian Naira",
    name: "Nigerian Naira",
    symbol: "₦",
    rateFromGBP: 2050,
  },
  {
    code: "GBP",
    label: "GBP, British Pound",
    name: "British Pound",
    symbol: "£",
    rateFromGBP: 1.0,
  },
  { code: "EUR", label: "EUR, Euro", name: "Euro", symbol: "€", rateFromGBP: 1.17 },
];

function AsteriskIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 4V20M19 8L5 16M19 16L5 8" />
    </svg>
  );
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

function getPlanShortName(name: string): string {
  return name.replace(/^Rhythm\s+/i, "");
}

function getPriorityScore(featureName: string): number {
  const lower = featureName.toLowerCase();
  if (lower.includes("artist")) return 1;
  if (lower.includes("release")) return 2;
  if (lower.includes("schedule")) return 3;
  if (lower.includes("lead time")) return 4;
  if (lower.includes("royalt")) return 5;
  if (lower.includes("platform")) return 6;
  if (lower.includes("manager")) return 7;
  if (lower.includes("report")) return 8;
  return 99;
}

export default function BillingClient({ initialPlans }: { initialPlans: PlanItem[] }) {
  const [plans, setPlans] = useState<PlanItem[]>(initialPlans);
  const [isLoadingPlans, setIsLoadingPlans] = useState(initialPlans.length === 0);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption>(CURRENCIES[0]);
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);
  const [expandedPlanIds, setExpandedPlanIds] = useState<Record<number, boolean>>({});

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

  const toggleExpand = (planId: number) => {
    setExpandedPlanIds((prev) => ({ ...prev, [planId]: !prev[planId] }));
  };

  const handleSelectPlan = async (plan: PlanItem) => {
    if (plan.is_custom) {
      // User requested custom plan CTA does nothing for now
      return;
    }

    try {
      setLoadingPlanId(plan.id);
      const res = await api.post<StartSubscriptionResponse>(API_ROUTES.SUBSCRIPTION.START, {
        plan_id: plan.id,
        billing_cycle: "annual",
        currency: selectedCurrency.code,
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

  const calculateConvertedPrice = (plan: PlanItem): number => {
    const baseGbpPrice = plan.price;
    if (!baseGbpPrice) return 0;
    if (selectedCurrency.code === "GBP") return baseGbpPrice;

    const converted = baseGbpPrice * selectedCurrency.rateFromGBP;
    if (selectedCurrency.code === "NGN") {
      return Math.round(converted / 100) * 100;
    }
    return Math.round(converted);
  };

  return (
    <div className="relative min-h-screen w-full bg-white text-[#141414] overflow-x-hidden flex flex-col items-center">
      {/* Ambient Gradient Glow from Figma */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-[1440px] h-[480px] rounded-full blur-[100px] opacity-25"
        style={{
          background:
            "linear-gradient(69deg, rgba(151, 71, 255, 0.5) 0%, rgba(0, 102, 255, 0.5) 100%)",
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

        {/* Currency Selector Pill & Caption */}
        <div className="flex flex-col items-center gap-3 mb-12">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="h-10 px-4 rounded-full bg-[#F9FAFC]/80 border border-[#E5E7EB] hover:bg-neutral-50 hover:border-[#D1D5DB] transition-all flex items-center gap-2 text-sm font-medium text-[#1E1E1E] cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
              >
                <span>{selectedCurrency.label}</span>
                <ChevronDown size={16} className="text-[#1E1E1E] opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="w-56 bg-white border border-[#E5E7EB] shadow-xl p-1.5 rounded-2xl"
            >
              {CURRENCIES.map((currency) => (
                <DropdownMenuItem
                  key={currency.code}
                  onClick={() => setSelectedCurrency(currency)}
                  className="flex items-center justify-between px-3 py-2 text-sm rounded-xl cursor-pointer hover:bg-neutral-100 font-medium text-[#1E1E1E]"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-neutral-500 w-8">
                      {currency.code}
                    </span>
                    <span>{currency.name}</span>
                  </div>
                  {selectedCurrency.code === currency.code && (
                    <Check size={16} className="text-brand-blue shrink-0" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <p className="text-sm md:text-base font-medium text-[#0066FF] text-center">
            Annual billing • Prices shown in {selectedCurrency.code}
          </p>
        </div>

        {/* Plans Grid */}
        {isLoadingPlans ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
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
            {plans.map((plan) => {
              const isPopular =
                plan.slug === "rhythm-elite" || plan.name.toLowerCase().includes("elite");
              const isCustom = plan.is_custom;
              const convertedPrice = calculateConvertedPrice(plan);
              const allIncludedFeatures = (plan.features || []).filter(
                (f) => f.value !== false && f.value !== "false",
              );

              // Sort features: prioritize key highlight features
              const sortedFeatures = [...allIncludedFeatures].sort(
                (a, b) => getPriorityScore(a.name) - getPriorityScore(b.name),
              );

              const isExpanded = !!expandedPlanIds[plan.id];
              const displayedFeatures = isExpanded ? sortedFeatures : sortedFeatures.slice(0, 5);

              const isLoadingThis = loadingPlanId === plan.id;

              return (
                <article
                  key={plan.id}
                  className="bg-white rounded-30 border border-[#D9D9D9] p-6 flex flex-col justify-between duration-200 hover:border-[#BFBFBF]"
                >
                  {/* Card Header & Content */}
                  <div>
                    {/* Title & Badge */}
                    <div className="flex items-center justify-between gap-3 min-h-[32px]">
                      <h2 className="text-2xl font-semibold text-[#1E1E1E] tracking-tight">
                        {plan.name}
                      </h2>
                      {isPopular && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#0066FF]">
                          Popular
                        </span>
                      )}
                    </div>

                    {/* Subtitle */}
                    <p className="text-base font-medium text-[#707070] mt-1">
                      {isCustom ? "For labels & agencies" : "For artists"}
                    </p>

                    {/* Pricing Display */}
                    <div className="mt-5 flex flex-col gap-0.5">
                      <div className="text-[32px] font-medium text-[#1E1E1E] leading-tight tracking-tight">
                        {isCustom
                          ? "Custom"
                          : `${selectedCurrency.code} ${convertedPrice.toLocaleString()}`}
                      </div>
                      <p className="text-xs font-medium text-[#757575]">
                        {isCustom ? "Contact us" : "per year"}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="mt-4 text-sm font-normal text-[#757575] leading-relaxed min-h-[42px]">
                      {plan.description ||
                        (isCustom
                          ? "It depends on the number of artist accounts to be managed, offering a more suitable service."
                          : "Music distribution plan with world-class support and global DSP delivery.")}
                    </p>

                    {/* Features List */}
                    <div className="mt-6 border-t border-[#D9D9D9]/50 flex flex-col">
                      {displayedFeatures.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 py-3 border-b border-[#D9D9D9]/50 text-xs font-medium text-[#757575]"
                        >
                          <AsteriskIcon className="size-5 shrink-0 text-brand-orange" />
                          <span className="leading-snug">{formatFeature(feature)}</span>
                        </div>
                      ))}

                      {sortedFeatures.length > 5 && (
                        <button
                          type="button"
                          onClick={() => toggleExpand(plan.id)}
                          className="mt-2 text-xs font-medium text-brand-blue hover:underline py-1.5 self-start cursor-pointer"
                        >
                          {isExpanded
                            ? "Show fewer features"
                            : `+${sortedFeatures.length - 5} more features`}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card CTA Button */}
                  <div className="pt-6">
                    <button
                      type="button"
                      disabled={isLoadingThis}
                      onClick={() => handleSelectPlan(plan)}
                      className={cn(
                        "w-full h-14 rounded-[10px] font-medium text-base transition-all duration-200 flex items-center justify-center gap-2",
                        isCustom
                          ? "bg-black text-white hover:bg-black/90 cursor-default"
                          : "bg-black text-white hover:bg-black/85 active:scale-[0.99] cursor-pointer",
                        isLoadingThis && "opacity-75 cursor-wait",
                      )}
                    >
                      {isLoadingThis ? (
                        <>
                          <Loader2 className="size-5 animate-spin text-white" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <span>
                          {isCustom ? "Contact us" : `Continue with ${getPlanShortName(plan.name)}`}
                        </span>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
