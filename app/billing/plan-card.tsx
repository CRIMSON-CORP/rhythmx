"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type DurationKey = "monthly" | "quarterly" | "biannual" | "annual";

export interface DurationOption {
  key: DurationKey;
  label: string;
  unit: string;
  discountBadge?: string;
}

export const DURATION_OPTIONS: DurationOption[] = [
  { key: "monthly", label: "Monthly", unit: "per month" },
  { key: "quarterly", label: "3 months", unit: "per 3 months" },
  { key: "biannual", label: "6 months", unit: "per 6 months" },
  { key: "annual", label: "Yearly", unit: "per year", discountBadge: "16%OFF" },
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

export function formatPriceWithIntl(amount: number, currencyCode: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currencyCode} ${amount}`;
  }
}

export interface PlanWithTotal extends PlanItem {
  converted_total?: number | null;
}

export default function PlanCard({
  plan,
  selectedCurrency,
  selectedDuration,
  isLoadingAction,
  onSelectPlanAction: onSelectPlan,
}: {
  plan: PlanWithTotal;
  selectedCurrency: string;
  selectedDuration: DurationKey;
  isLoadingAction: boolean;
  onSelectPlanAction: (plan: PlanItem) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isPopular = plan.slug === "rhythm-elite" || plan.name.toLowerCase().includes("elite");
  const isCustom = plan.is_custom;

  const currentDurationOpt =
    DURATION_OPTIONS.find((d) => d.key === selectedDuration) || DURATION_OPTIONS[3];

  let displayedPrice = "";
  let durationUnit = currentDurationOpt.unit;

  if (isCustom) {
    displayedPrice = "Custom";
    durationUnit = "";
  } else if (typeof plan.converted_total === "number") {
    displayedPrice = formatPriceWithIntl(plan.converted_total, selectedCurrency);
  }

  const includedFeatures = (plan.features || []).filter(
    (f) => f.value !== false && f.value !== "false",
  );

  const displayedFeatures = isExpanded ? includedFeatures : includedFeatures.slice(0, 5);

  return (
    <article className="bg-white rounded-30 border border-[#D9D9D9] p-6 flex flex-col justify-between duration-200 hover:border-[#BFBFBF]">
      {/* Card Header & Content */}
      <div>
        {/* Title & Badge */}
        <div className="flex items-center justify-between gap-3 min-h-8">
          <h2 className="text-2xl font-semibold text-[#1E1E1E] tracking-tight">{plan.name}</h2>
          {isPopular && (
            <span className="inline-flex items-center px-3 py-1 rounded-20 text-xs font-semibold bg-[#6F2C91]/5 text-[#6F2C91]">
              Popular
            </span>
          )}
        </div>

        {/* Subtitle */}
        <p className="text-base font-medium text-[#707070] mt-1">
          {isCustom ? "For labels & agencies" : "For artists"}
        </p>

        {/* Pricing Display in Row (Bricolage Grotesque Bold 32px formatted via Intl) */}
        <div className="mt-5 flex items-center flex-wrap gap-2">
          <span className="font-heading font-bold text-[32px] text-[#1E1E1E] leading-none tracking-tight">
            {displayedPrice}
          </span>
          {durationUnit && (
            <span className="text-base font-medium text-[#757575] leading-none">
              {durationUnit}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="mt-4 text-sm font-normal text-[#757575] leading-relaxed min-h-10.5">
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

          {includedFeatures.length > 5 && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-xs font-medium text-brand-blue hover:underline py-1.5 self-start cursor-pointer"
            >
              {isExpanded ? "Show fewer features" : `+${includedFeatures.length - 5} more features`}
            </button>
          )}
        </div>
      </div>

      {/* Card CTA Button */}
      <div className="pt-6">
        <button
          type="button"
          disabled={isLoadingAction}
          onClick={() => onSelectPlan(plan)}
          className={cn(
            "w-full h-14 rounded-10 font-medium text-base transition-all duration-200 flex items-center justify-center gap-2",
            isCustom
              ? "bg-black text-white hover:bg-black/90 cursor-default"
              : "bg-black text-white hover:bg-black/85 active:scale-[0.99] cursor-pointer",
            isLoadingAction && "opacity-75 cursor-wait",
          )}
        >
          {isLoadingAction ? (
            <>
              <Loader2 className="size-5 animate-spin text-white" />
              <span>Processing...</span>
            </>
          ) : (
            <span>{isCustom ? "Contact us" : `Continue with ${getPlanShortName(plan.name)}`}</span>
          )}
        </button>
      </div>
    </article>
  );
}
