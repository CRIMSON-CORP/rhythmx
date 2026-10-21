"use client";

import useWithdrawalStore from "@/store/withdrawal-store";

function EnterAmountView() {
  const form = useWithdrawalStore((state) => state.form);
  const setForm = useWithdrawalStore((state) => state.setForm);
  const setView = useWithdrawalStore((state) => state.setView);

  const pounds = parseInt(form.amount.toString(), 10) / 100;

  return (
    <div className="p-6 relative">
      <div className="absolute w-full top-0 right-0 h-27.75 bg-linear-to-r from-[#0080FF] to-[#9747FF] -z-10 opacity-25 blur-3xl"></div>

      <div className="flex flex-col items-center gap-6 relative z-10">
        {/* Pounds display with ATM-style decimal shift */}
        <div className="flex flex-col items-center gap-1 my-3 select-none">
          <div className="text-[32px] font-medium text-black tracking-tight select-none">
            {"£" +
              pounds.toLocaleString("en-GB", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
          </div>
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
              if (pounds > 0) {
                setView("withdrawal-bank");
              }
            }}
            disabled={pounds <= 0}
            className="w-18 h-18 hover:bg-neutral-100 disabled:opacity-30 rounded-full flex items-center justify-center text-[20px] font-bold text-black cursor-pointer select-none"
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
