"use client";

import { useState, useEffect, useCallback } from "react";
import useWithdrawalStore from "@/store/withdrawal-store";
import { cn } from "@/lib/utils";
import { goeyToast } from "goey-toast";

function EnterOtpView() {
  const form = useWithdrawalStore((state) => state.form);
  const setForm = useWithdrawalStore((state) => state.setForm);
  const setView = useWithdrawalStore((state) => state.setView);

  // Loading state for verification request
  const [loading, setLoading] = useState(false);

  // Active OTP state is stored inside the Zustand store form object as a string
  const otp = form.otp;

  // Calculate the currently active digit box index (0 to 3)
  const activeIndex = Math.min(otp.length, 3);

  // Append a digit to the store's form.otp string
  const handleInputDigit = (digit: string) => {
    if (loading) return;
    if (otp.length < 4) {
      setForm({ otp: otp + digit });
    }
  };

  // Backspace removal
  const handleBackspace = () => {
    if (loading) return;
    if (otp.length > 0) {
      setForm({ otp: otp.slice(0, -1) });
    }
  };

  // Handle verify logic when Ok is clicked
  const handleVerify = useCallback(() => {
    if (otp.length === 4 && !loading) {
      setLoading(true);

      // Simulate verification api request (1.5s delay)
      setTimeout(() => {
        if (otp === "1234") {
          setView("tranfer-success");
        } else {
          goeyToast.error("Verification failed. Please type 1234 to proceed.");
          setForm({ otp: "" }); // reset field
        }
        setLoading(false);
      }, 1500);
    }
  }, [otp, loading, setForm, setView]);

  // Auto trigger verification once all 4 digits are completed
  useEffect(() => {
    if (otp.length === 4) {
      const timer = setTimeout(() => {
        handleVerify();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [handleVerify, otp]);

  return (
    <div className="p-6">
      <div className="absolute w-full top-0 right-0 h-64 bg-linear-to-r from-[#0080FF] to-[#9747FF] -z-10 opacity-25 blur-3xl"></div>

      <div className="flex flex-col items-center gap-6">
        {/* Verification layout */}
        <div className="flex flex-col items-center gap-4 my-3 select-none">
          <div className="text-2xl font-bold text-black tracking-tight">Enter OTP</div>
          <p className="text-[#8E8E93] text-center text-sm max-w-61.5 leading-relaxed">
            Enter the 4-digit code sent via SMS to 0802 345 6789
          </p>

          {/* 4 Digit OTP Boxes */}
          <div className="flex items-center gap-4 mt-2">
            {[0, 1, 2, 3].map((idx) => {
              const isActive = idx === activeIndex;
              const hasDigit = idx < otp.length;
              return (
                <div
                  key={idx}
                  className={cn(
                    "w-14 h-14 rounded-20 outline outline-black flex items-center justify-center font-bold text-xl text-black transition-all",
                    isActive ? "opacity-100" : "opacity-30",
                  )}
                >
                  {hasDigit ? otp[idx] : isActive ? "|" : ""}
                </div>
              );
            })}
          </div>
        </div>

        {/* Circular numeric pad */}
        <div className="w-full grid grid-cols-3 justify-items-center gap-y-4 max-w-xs mx-auto">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              onClick={() => handleInputDigit(num)}
              disabled={loading}
              className="w-18 h-18 bg-[#FFF0EB] hover:bg-[#FFE0D6] active:scale-95 transition-all rounded-full flex items-center justify-center text-[28px] font-medium text-black cursor-pointer select-none disabled:opacity-50"
            >
              {num}
            </button>
          ))}

          <button
            onClick={handleVerify}
            disabled={loading || otp.length < 4}
            className="w-18 h-18 hover:bg-neutral-100 rounded-full flex items-center justify-center text-[20px] font-bold text-black cursor-pointer select-none disabled:opacity-50"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Ok"
            )}
          </button>

          <button
            onClick={() => handleInputDigit("0")}
            disabled={loading}
            className="w-18 h-18 bg-[#FFF0EB] hover:bg-[#FFE0D6] active:scale-95 transition-all rounded-full flex items-center justify-center text-[28px] font-medium text-black cursor-pointer select-none disabled:opacity-50"
          >
            0
          </button>

          <button
            onClick={handleBackspace}
            disabled={loading}
            className="w-18 h-18 hover:bg-neutral-100 rounded-full flex items-center justify-center text-black cursor-pointer select-none disabled:opacity-50"
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

export default EnterOtpView;
