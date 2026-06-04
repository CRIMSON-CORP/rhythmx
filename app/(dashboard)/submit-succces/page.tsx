"use client";

import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SubmitSuccessPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center grow min-h-[70vh] px-4 py-12">
      <div className="bg-white rounded-30 p-10 max-w-md w-full flex flex-col items-center text-center gap-8 relative overflow-hidden">
        {/* Colorful blur background effect */}
        <div className="absolute w-full top-0 left-0 right-0 h-32 bg-linear-to-r from-[#FF7247]/20 to-[#FFC107]/20 -z-10 opacity-30 blur-2xl pointer-events-none"></div>

        {/* Success Icon */}
        <div className="size-20 rounded-full bg-[#EBFFEE] flex items-center justify-center text-[#009951]">
          <Icon name="check-circle" size={40} />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold font-heading text-default">
            Release Submitted!
          </h2>
          <p className="text-sm text-border-default-secondary font-medium leading-relaxed max-w-sm">
            Your release has been successfully submitted and queued for distribution. You can monitor its processing status inside your discography.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full">
          <Button
            variant="orange"
            onClick={() => router.push("/discography")}
            className="w-full justify-center rounded-xl py-6 text-sm font-semibold cursor-pointer"
          >
            <span>Go to Discography</span>
            <Icon name="arrow-right" size={16} />
          </Button>

          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="w-full justify-center text-border-default-secondary hover:text-default text-xs font-semibold py-2 cursor-pointer"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
