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
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { VisuallyHidden } from "radix-ui";
import { goeyToast } from "goey-toast";

export interface PlanMember {
  id: string;
  reference?: string;
  name: string;
  email: string;
  status: "active" | "pending";
  role?: string;
}

interface RemoveMemberModalProps {
  member: PlanMember;
  planName?: string;
  trigger?: React.ReactNode;
  onRemove?: (memberRef: string) => void;
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
    const memberRef = member.reference || member.id;
    try {
      setLoading(true);
      await api.delete(API_ROUTES.SUBSCRIPTION.MEMBERS.MEMBER(memberRef));
      goeyToast.success(`${member.name} has been removed from your plan.`);
      setOpen(false);
      onRemove?.(memberRef);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : (err as { message?: string })?.message || "Failed to remove member.";
      goeyToast.error(errorMsg);
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
          <h2 className="font-medium text-black">Remove {firstName} from your plan?</h2>
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
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.75 6.41671L22.0267 18.1125C21.8423 21.1004 21.7502 22.5949 21 23.6694C20.6297 24.2004 20.1529 24.6486 19.6 24.9854C18.4835 25.6667 16.9867 25.6667 13.993 25.6667C10.9947 25.6667 9.4955 25.6667 8.37667 24.9842C7.82354 24.6467 7.34675 24.1977 6.97667 23.6659C6.22767 22.5902 6.13667 21.0934 5.957 18.1009L5.25 6.41671M10.5 13.6909H17.5M12.25 18.263H15.75M3.5 6.41671H24.5M18.7308 6.41671L17.9352 4.77404C17.4055 3.68204 17.1418 3.13721 16.6857 2.79654C16.5843 2.72108 16.477 2.65397 16.3648 2.59587C15.8597 2.33337 15.253 2.33337 14.0397 2.33337C12.7972 2.33337 12.1753 2.33337 11.6608 2.60637C11.5471 2.66729 11.4386 2.73753 11.3365 2.81637C10.8745 3.16987 10.6167 3.73571 10.101 4.86621L9.39517 6.41671"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke="black"
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
            {firstName} will lose access to your shared {planName} Plan when you remove them.
            Taylor&apos;s pending invitation will stay in place.
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
