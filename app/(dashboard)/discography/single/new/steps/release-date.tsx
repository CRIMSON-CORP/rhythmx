"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useNewReleaseStore from "@/store/new-release-store";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, X } from "lucide-react";

export function XpressDialog({
  xpressRelease,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: {
  xpressRelease: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [localOpen, setLocalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : localOpen;
  const setIsOpen = controlledOnOpenChange !== undefined ? controlledOnOpenChange : setLocalOpen;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="text-brand-orange hover:underline cursor-pointer font-medium ml-1 outline-none">
          Learn More
        </button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="max-w-101.25 w-full p-8 overflow-hidden rounded-30 bg-white"
      >
        <div className="absolute w-full top-0 left-0 right-0 h-40 bg-linear-to-r from-[#FF7247] to-[#FFC107] -z-10 opacity-30 blur-3xl pointer-events-none"></div>

        <DialogHeader className="flex flex-row items-center justify-between pb-2">
          <DialogTitle className="text-default font-medium text-base">
            {xpressRelease ? "GO Xpress" : "Learn about Xpress Release"}
          </DialogTitle>
          <DialogClose>
            <X size={22} />
          </DialogClose>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 mt-4">
          <div className="p-8">
            <Image
              src="/images/ai-robot-assistant.png"
              width={154.5}
              height={90}
              alt="AI Robot Assistant"
              className="object-contain"
            />
          </div>

          {xpressRelease ? (
            <>
              <div className="bg-[#EBFFEE] text-[#009951] font-semibold text-xs rounded-full px-4 py-1.5 uppercase tracking-wider">
                Xpress Release is ON
              </div>
              <h3 className="text-2xl font-bold font-heading text-default mt-2">Xpress Release</h3>
              <DialogDescription className="text-xs text-border-default-secondary leading-normal max-w-sm">
                Get your release published on streaming platforms within 24-48 Hours
              </DialogDescription>
              <div className="bg-page-background font-bold text-2xl text-default rounded-full px-8 py-3.5 mt-2 w-full max-w-md">
                $15.00
              </div>
              <DialogClose asChild>
                <Button className="w-full max-w-md rounded-full py-6 mt-4 text-sm font-semibold bg-black hover:bg-black/90 text-white border-0 cursor-pointer">
                  Done
                </Button>
              </DialogClose>
            </>
          ) : (
            <div className="flex flex-col w-full">
              <h3 className="text-2xl font-semibold">Xpress Release</h3>
              <DialogDescription className="text-2xl text-black/50 leading-tight">
                Get your release published on streaming platforms within 24-48 Hours with just{" "}
                <span className="font-bold">$15 fee</span>
              </DialogDescription>
              <DialogClose asChild>
                <Button className="w-full max-w-md rounded-full py-6 mt-6 text-sm font-semibold bg-black hover:bg-black/90 text-white border-0 cursor-pointer">
                  Got It
                </Button>
              </DialogClose>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ReleaseDate() {
  const { form, setForm, next } = useNewReleaseStore();
  const [isXpressDialogOpen, setIsXpressDialogOpen] = useState(false);

  const artworkUrl = useMemo(() => {
    if (!form.artwork) return "/images/release-2.png";
    return URL.createObjectURL(form.artwork);
  }, [form.artwork]);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(artworkUrl);
    };
  }, [artworkUrl]);

  const releaseDate = useMemo(
    () => (form.release_date ? new Date(form.release_date) : new Date("2025-04-20")),
    [form.release_date],
  );
  const releaseTime = form.release_time || "09:41 AM";
  const xpressRelease = form.xpress_release ?? false;

  const value24 = useMemo(() => {
    const match = releaseTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
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
  }, [releaseTime]);

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
    setForm({ release_time: newTime });
  };

  const formattedDate = useMemo(() => {
    return releaseDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [releaseDate]);

  const isStepValid = !!form.release_date;

  const handleContinue = () => {
    if (isStepValid) {
      next();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[0.55fr_0.45fr] gap-8 items-stretch pb-10">
      {/* Left Column: Form Fields Card */}
      <div className="flex flex-col gap-4">
        {/* Calendar Picker Card */}
        <div className="bg-white rounded-30 flex flex-col gap-6 py-6">
          <div className="border-b border-b-default-default">
            <Calendar
              mode="single"
              selected={releaseDate}
              onSelect={(date) => {
                if (date) {
                  setForm({ release_date: date });
                }
              }}
              className="w-full px-6 pb-4 pt-0"
            />
          </div>
          {/* Time Selector */}
          <div className="p-4 flex items-center justify-between">
            <span className="text-lg">Time</span>
            <div className="flex items-center bg-page-background rounded-full px-4 py-2 text-sm font-semibold text-default">
              <input
                type="time"
                value={value24}
                onChange={handleTimeChange}
                className="bg-transparent border-0 outline-none text-default font-semibold cursor-pointer w-28 text-center [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-80"
              />
            </div>
          </div>
          {/* Xpress Release Switch */}
          <div className="p-6 flex items-center flex-wrap gap-4 justify-between border-t border-t-default-default">
            <div className="flex items-center justify-between">
              <span className="font-medium text-default">Xpress Release</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-default font-medium flex items-center">
                Use fast release
                <XpressDialog
                  xpressRelease={xpressRelease}
                  open={isXpressDialogOpen}
                  onOpenChange={setIsXpressDialogOpen}
                />
              </span>
              <Switch
                checked={xpressRelease}
                onCheckedChange={(checked) => {
                  setForm({ xpress_release: checked });
                  if (checked) {
                    setIsXpressDialogOpen(true);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 p-8 bg-white rounded-30">
          <p className="font-medium text-default text-center text-sm">
            Do review your release details before clicking “continue”
          </p>
          <Button
            variant="orange"
            onClick={handleContinue}
            disabled={!isStepValid}
            className="w-fit"
          >
            <span>Continue</span>
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>

      {/* Right Column: Dynamic Preview Panel */}
      <div className="relative isolate self-start bg-white rounded-30 p-8 min-h-125 overflow-hidden flex flex-col items-center gap-8">
        <div className="absolute w-full top-0 left-0 right-0 h-1/3 bg-linear-to-r from-[#9747FF]/50 to-[#0066FF]/50 -z-10 opacity-25 blur-3xl"></div>
        <p className="text-xl font-medium font-heading self-start">Release Set Date</p>
        <Image
          src="/images/calendar.png"
          width={124}
          height={124}
          alt="Calendar Set Date"
          className="object-contain"
        />
        <div className="flex flex-col gap-2.5 text-center items-center">
          <h3 className="text-xl font-medium font-heading">Why release date & time?</h3>
          <p className="text-xs text-border-default-secondary font-medium max-w-93.25">
            When you set release date your song will be schedule for the set release date and time,
            so you don&apos;t have to worry about when your song or album will go live.
          </p>
        </div>

        <div className="grid grid-cols-[0.3fr_0.7fr] gap-x-2.5 gap-y-4 w-full max-w-118.75">
          <span className="text-xs text-border-default-secondary p-5 shadow-xs rounded-full leading-none">
            Release Date
          </span>
          <div className="bg-[#7676801F] rounded-full p-4 text-center leading-none">
            {formattedDate}
          </div>
          <span className="text-xs text-border-default-secondary p-5 shadow-xs rounded-full leading-none">
            Release Time
          </span>
          <div className="bg-[#7676801F] rounded-full p-4 text-center leading-none">
            {releaseTime}
          </div>
        </div>
        {xpressRelease && (
          <div className="w-full border border-default-default bg-white rounded-30 p-6 flex flex-col gap-8 max-w-118.75">
            <div className="font-medium text-lg text-default flex flex-col gap-1">
              <span>Xpress Release Added ✅</span>
              <p className="text-lg text-black/50 font-medium leading-normal">
                Get your release published on streaming platforms within 24-48 Hours
              </p>
            </div>
            <div className="bg-page-background rounded-20 p-4 text-center text-2xl font-semibold">
              + $15.00
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReleaseDate;
