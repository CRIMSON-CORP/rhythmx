"use client";

import { Suspense } from "react";
import useApi from "@/hooks/useApi";
import useWithdrawalStore from "@/store/withdrawal-store";

interface ConversionResponse {
  amount: number;
  converted: number;
  formatted: string;
}

function AmountSkeleton() {
  return <div className="w-28 h-4 bg-default-default/50 animate-pulse rounded" />;
}

function AmountToGet({ amount }: { amount: number }) {
  // Call useApi hook which suspends rendering when fetching new query amounts
  const data = useApi<ConversionResponse>(`/api/convert?amount=${amount}`);
  return <span className="font-semibold text-black">{data.formatted}</span>;
}

function EnterAmountView() {
  const form = useWithdrawalStore((state) => state.form);
  const setForm = useWithdrawalStore((state) => state.setForm);
  const setView = useWithdrawalStore((state) => state.setView);

  const dollars = parseInt(form.amount.toString(), 10) / 100;

  return (
    <div className="p-6">
      <div className="absolute w-full top-0 right-0 h-64 bg-linear-to-r from-[#0080FF] to-[#9747FF] -z-10 opacity-25 blur-3xl"></div>

      <div className="flex flex-col items-center gap-6">
        {/* Dollar output displays cent-shifted values */}
        <div className="flex flex-col items-center gap-1 my-3 select-none">
          <div className="text-[54px] font-bold text-black tracking-tight select-none">
            {"$" +
              dollars.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
          </div>
          <p className="text-sm text-default-tertiary select-none">You&apos;ll receive</p>
          {/* Suspense boundary wrapping the api-based conversions */}
          <Suspense fallback={<AmountSkeleton />}>
            <AmountToGet amount={dollars} />
          </Suspense>
        </div>

        {/* Circular numeric pad */}
        <div className="w-full grid grid-cols-3 justify-items-center gap-y-4 max-w-xs mx-auto">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              onClick={() => {
                setForm({ amount: form.amount * 10 + parseInt(num, 10) });
              }}
              className="w-18 h-18 bg-[#FFF0EB] hover:bg-[#FFE0D6] active:scale-95 transition-all rounded-full flex items-center justify-center text-[28px] font-medium text-black cursor-pointer select-none"
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => {
              if (dollars > 0) {
                setView("withdrawal-bank");
              }
            }}
            className="w-18 h-18 hover:bg-neutral-100 rounded-full flex items-center justify-center text-[20px] font-bold text-black cursor-pointer select-none"
          >
            Ok
          </button>

          <button
            onClick={() => {
              setForm({ amount: form.amount * 10 });
            }}
            className="w-18 h-18 bg-[#FFF0EB] hover:bg-[#FFE0D6] active:scale-95 transition-all rounded-full flex items-center justify-center text-[28px] font-medium text-black cursor-pointer select-none"
          >
            0
          </button>

          <button
            onClick={() => {
              setForm({ amount: Math.floor(form.amount / 10) });
            }}
            className="w-18 h-18 hover:bg-neutral-100 rounded-full flex items-center justify-center text-black cursor-pointer select-none"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0 -2-2z" />
              <line x1="18" y1="9" x2="12" y2="15" />
              <line x1="12" y1="9" x2="18" y2="15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default EnterAmountView;
