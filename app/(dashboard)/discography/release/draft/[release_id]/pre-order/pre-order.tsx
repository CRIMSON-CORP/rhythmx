"use client";

import { Calendar } from "@/components/ui/calendar";
import ContinueButton from "../../ContinueButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { goeyToast } from "goey-toast";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";

function parseYYYYMMDD(str?: string | null): Date | undefined {
  if (!str) return undefined;
  const parts = str.split("-").map(Number);
  if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) return undefined;
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function format24To12(time24: string): string {
  const [hStr, mStr] = time24.split(":");
  let hour = parseInt(hStr, 10);
  if (isNaN(hour)) return "09:41 AM";
  const minute = mStr || "00";
  const period = hour >= 12 ? "PM" : "AM";
  if (hour > 12) hour -= 12;
  else if (hour === 0) hour = 12;
  return `${String(hour).padStart(2, "0")}:${minute} ${period}`;
}

interface PreOrderDateProps {
  releaseId: string;
  initialPreorderDate?: string | null;
  initialPreorderTime?: string | null;
}

function PreOrderDate({
  releaseId,
  initialPreorderDate,
  initialPreorderTime,
}: PreOrderDateProps) {
  const router = useRouter();

  const [preorderDate, setPreorderDate] = useState<Date | undefined>(() =>
    parseYYYYMMDD(initialPreorderDate),
  );
  const [preorderTime, setPreorderTime] = useState<string>(() =>
    initialPreorderTime ? format24To12(initialPreorderTime) : "09:41 AM",
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const value24 = useMemo(() => {
    const match = preorderTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return "09:41";
    let hour = parseInt(match[1]);
    const minute = match[2];
    const period = match[3].toUpperCase();
    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }
    return `${String(hour).padStart(2, "0")}:${minute}`;
  }, [preorderTime]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time24 = e.target.value;
    if (!time24) return;
    const [hourStr, minuteStr] = time24.split(":");
    let hour = parseInt(hourStr);
    const minute = minuteStr || "00";
    const period = hour >= 12 ? "PM" : "AM";
    if (hour > 12) {
      hour -= 12;
    } else if (hour === 0) {
      hour = 12;
    }
    const formattedHour = String(hour).padStart(2, "0");
    const newTime = `${formattedHour}:${minute} ${period}`;
    setPreorderTime(newTime);
  };

  const formattedDate = useMemo(() => {
    if (!preorderDate) return "Select date";
    return preorderDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [preorderDate]);

  const handleContinue = async () => {
    if (isLoading) return;

    if (!preorderDate) {
      // Pre-order is optional; proceed directly to release date step
      router.push(`/discography/release/draft/${releaseId}/release-date`);
      return;
    }

    setIsLoading(true);
    try {
      await api.patch(API_ROUTES.RELEASES.DRAFT(releaseId), {
        preorder_date: formatDateToYYYYMMDD(preorderDate),
        preorder_time: value24,
      });

      goeyToast.success("Pre-order date saved successfully");
      router.push(`/discography/release/draft/${releaseId}/release-date`);
    } catch (error) {
      console.error("Failed to save pre-order date:", error);
      const errorMsg = (error as { message?: string })?.message || "Failed to save pre-order date";
      goeyToast.error("Failed to save pre-order date", { description: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch pb-10">
      {/* Left Column: Form Fields Card */}
      <div className="flex flex-col gap-4">
        {/* Calendar Picker Card */}
        <div className="bg-white rounded-30 flex flex-col py-6">
          <div className="border-b border-b-default-default">
            <Calendar
              mode="single"
              selected={preorderDate}
              disabled={(date) => date < today}
              onSelect={(date) => {
                if (date) {
                  setPreorderDate(date);
                }
              }}
              className="w-full px-6 pb-4 pt-0"
            />
          </div>
          {/* Time Selector */}
          <div className="px-4 py-6 flex items-center justify-between">
            <span>Time</span>
            <div className="flex items-center bg-page-background rounded-full px-4 py-2 text-sm font-semibold text-default">
              <input
                type="time"
                value={value24}
                onChange={handleTimeChange}
                className="bg-transparent border-0 outline-none text-default font-semibold cursor-pointer w-28 text-center [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 p-8 bg-white rounded-30">
          <p className="font-medium text-default">
            Do review your release details before clicking “continue”
          </p>
          <ContinueButton
            pending={isLoading}
            onClick={handleContinue}
          />
        </div>
      </div>

      {/* Right Column: Dynamic Preview Panel */}
      <div className="relative isolate self-start bg-white rounded-30 p-8 min-h-125 overflow-hidden flex flex-col items-center gap-8">
        <div className="absolute w-full top-0 left-0 right-0 h-1/3 bg-linear-to-r from-[#9747FF]/50 to-[#0066FF]/50 -z-10 opacity-25 blur-3xl"></div>
        <p className="text-xl font-medium font-heading self-start">Preorder Set Date</p>
        <Image
          src="/images/lunch-pack.png"
          width={160}
          height={158}
          alt="Calendar Set Date"
          className="object-contain"
        />
        <div className="flex flex-col gap-2.5 text-center items-center">
          <h3 className="text-xl font-medium font-heading">Why set a preorder date?</h3>
          <p className="text-xs text-border-default-secondary font-medium max-w-93.25">
            Setting a preorder date lets fans purchase your tracks ahead of the official launch.
            This builds crucial anticipation, triggers early marketing momentum, and aggregates
            sales for a stronger release week chart position.
          </p>
        </div>

        <div className="grid grid-cols-[0.3fr_0.7fr] gap-x-2.5 gap-y-4 w-full max-w-118.75">
          <span className="text-xs text-border-default-secondary p-5 shadow-xs rounded-full leading-none">
            Preorder Date
          </span>
          <div className="bg-[#7676801F] rounded-full p-4 text-center leading-none">
            {formattedDate}
          </div>
          <span className="text-xs text-border-default-secondary p-5 shadow-xs rounded-full leading-none">
            Preorder Time
          </span>
          <div className="bg-[#7676801F] rounded-full p-4 text-center leading-none">
            {preorderTime}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreOrderDate;
