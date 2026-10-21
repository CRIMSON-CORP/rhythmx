"use client";

import { Suspense } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const PLATFORM_RANGE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "7d", label: "Last 7 days" },
  { value: "14d", label: "Last 14 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "60d", label: "Last 60 days" },
  { value: "120d", label: "Last 120 days" },
  { value: "180d", label: "Last 180 days" },
  { value: "1yr", label: "Last 1 year" },
];

function PlatformRangeSelectInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentRange = searchParams.get("platform_range") || "30d";

  const handleRangeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("platform_range", value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Select value={currentRange} onValueChange={handleRangeChange}>
      <SelectTrigger className="w-fit px-4 py-2 bg-white rounded-full ring-0! shadow-none border-none gap-2 text-sm font-medium text-default cursor-pointer">
        <SelectValue placeholder="Select Range" />
      </SelectTrigger>
      <SelectContent position="popper" align="end" className="rounded-20! outline-0! ring-0">
        {PLATFORM_RANGE_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className="cursor-pointer">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function PlatformRangeSelect() {
  return (
    <Suspense fallback={<div className="w-32 h-9 bg-white rounded-full animate-pulse" />}>
      <PlatformRangeSelectInner />
    </Suspense>
  );
}
