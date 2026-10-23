"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "radix-ui";
import { goeyToast } from "goey-toast";

export interface PlanMember {
  id: string;
  name: string;
  email: string;
  status: "active" | "pending";
  role?: string;
}

interface RemoveMemberModalProps {
  member: PlanMember;
  planName?: string;
  trigger?: React.ReactNode;
  onRemove?: () => void;
}

export default function RemoveMemberModal({
  member,
  planName = "Kickstart",
  trigger,
  onRemove,
}: RemoveMemberModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const firstName = member.name ? member.name.split(" ")[0] : "User";

  const handleRemove = async () => {
    try {
      setLoading(true);
      // Backend route pending; simulate and trigger router.refresh per user specification
      await new Promise((resolve) => setTimeout(resolve, 400));
      goeyToast.success(`${member.name} has been removed from your plan.`);
      setOpen(false);
      onRemove?.();
      router.refresh();
    } catch {
      goeyToast.error("Failed to remove member.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <button
            type="button"
            className="px-4 py-1.5 rounded-full border border-[#D92D20] text-[#D92D20] text-xs font-semibold hover:bg-red-50 transition-all cursor-pointer"
          >
            Remove
          </button>
        )}
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="max-w-120 p-0 rounded-20 bg-white shadow-2xl overflow-hidden gap-0"
      >
        <VisuallyHidden.Root>
          <DialogTitle>Remove {firstName} from your plan?</DialogTitle>
        </VisuallyHidden.Root>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
          <h2 className="text-base font-semibold text-default">
            Remove {firstName} from your plan?
          </h2>
          <DialogClose asChild>
            <button
              type="button"
              className="p-1 rounded-full text-black hover:text-default hover:bg-black/5 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </DialogClose>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-6 flex flex-col gap-5">
          {/* Trash Icon */}
          <div className="w-8 h-8 flex items-center justify-start text-default">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M19.25 5.4167L18.5267 17.113C18.3423 20.1 18.2502 21.595 17.5 22.669C17.1297 23.2 16.6529 23.649 16.1 23.985C14.9835 24.667 13.4867 24.667 10.493 24.667C7.4947 24.667 5.9955 24.667 4.8767 23.984C4.3235 23.647 3.8467 23.198 3.4767 22.666C2.7277 21.59 2.6367 20.093 2.457 17.101L1.75 5.4167M7 12.6909H14M8.75 17.263H12.25M0 5.4167H21M15.2308 5.4167L14.4352 3.774C13.9055 2.682 13.6418 2.1372 13.1857 1.7965C13.0843 1.7211 12.977 1.654 12.8648 1.5959C12.3597 1.3334 11.753 1.3334 10.5397 1.3334C9.2972 1.3334 8.6753 1.3334 8.1608 1.6064C8.0471 1.6673 7.9386 1.7375 7.8365 1.8164C7.3745 2.1699 7.1167 2.7357 6.601 3.8662L5.8952 5.4167"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Member Card */}
          <div className="bg-[#F9FAFC] rounded-xl px-4 py-3 flex items-center gap-3 border border-black/5">
            <div className="w-10 h-10 rounded-full bg-neutral-200/70 flex items-center justify-center text-neutral-400 shrink-0">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <h4 className="text-sm font-semibold text-default truncate">{member.name}</h4>
              <p className="text-xs text-border-default-secondary font-medium truncate">
                {member.email}
              </p>
            </div>
          </div>

          {/* Warning Copy */}
          <p className="text-sm text-border-default-secondary leading-relaxed">
            {firstName} will lose access to your shared {planName} Plan when you remove them. Taylor&apos;s
            pending invitation will stay in place.
          </p>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <DialogClose asChild>
              <button
                type="button"
                className="px-6 py-2.5 rounded-full border border-black text-default text-xs font-medium hover:bg-black/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="button"
              onClick={handleRemove}
              disabled={loading}
              className="px-6 py-2.5 rounded-full border border-[#C00F0C] text-[#C00F0C] text-xs font-semibold hover:bg-red-50 active:scale-98 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              {loading && <Loader2 size={13} className="animate-spin" />}
              <span>Remove member</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
