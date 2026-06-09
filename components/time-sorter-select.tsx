"use client";
import { Suspense } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useRouter, useSearchParams } from "next/navigation";

function TimeSorterSelectInner() {
  const { push } = useRouter();
  const searchParams = useSearchParams();

  const handleSorterChange = (value: string) => {
    const url = new URLSearchParams(searchParams.toString());
    url.set("time-sort", value);
    push(`/?${url.toString()}`);
  };
  return (
    <Select
      defaultValue={searchParams.get("time-sort") || "monthly"}
      onValueChange={handleSorterChange}
    >
      <SelectTrigger className="w-fit px-4 py-2 bg-white rounded-full ring-0! shadow-none border-none gap-2">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent position="popper" align="end" className="rounded-20! outline-0! ring-0">
        <SelectItem value="daily">Daily</SelectItem>
        <SelectItem value="weekly">Weekly</SelectItem>
        <SelectItem value="monthly">Monthly</SelectItem>
        <SelectItem value="yearly">Yearly</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default function TimeSorterSelect() {
  return (
    <Suspense fallback={<div className="w-28 h-10 bg-white rounded-full animate-pulse" />}>
      <TimeSorterSelectInner />
    </Suspense>
  );
}
