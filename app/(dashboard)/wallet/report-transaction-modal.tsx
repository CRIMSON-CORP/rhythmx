"use client";
import { MessageSquare, X } from "lucide-react";

import { useEffect, useState } from "react";
import Image from "next/image";
import Icon from "@/components/icon";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "radix-ui";
import { goeyToast } from "goey-toast";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { cn } from "@/lib/utils";

function ReportTransactionModal({ defaultRefId }: { defaultRefId?: string }) {
  const [open, setOpen] = useState(false);
  const [refId, setRefId] = useState(defaultRefId || "");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const isReadOnly = Boolean(defaultRefId);

  useEffect(() => {
    if (defaultRefId) {
      setRefId(defaultRefId);
    }
  }, [defaultRefId]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setDescription("");
      if (!defaultRefId) {
        setRefId("");
      }
    } else {
      if (defaultRefId) {
        setRefId(defaultRefId);
      }
    }
  };

  const handleSubmit = async () => {
    if (loading) return;

    const targetRefId = (defaultRefId || refId).trim();

    if (!targetRefId || !description.trim()) {
      goeyToast.error("Transaction Reference ID and Description are required.");
      return;
    }

    setLoading(true);

    try {
      await api.post(API_ROUTES.EARNINGS.TRANSACTIONS.REPORT(targetRefId), {
        description: description.trim(),
      });
      goeyToast.success("Transaction reported successfully.");
      setDescription("");
      if (!defaultRefId) {
        setRefId("");
      }
      setOpen(false);
    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message || "Failed to report transaction. Please try again.";
      goeyToast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="white">
          <span>Report Transaction</span>
          <MessageSquare size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="overflow-hidden rounded-30 isolate gap-0 max-w-150"
        showCloseButton={false}
      >
        <DialogHeader className="flex-row items-center justify-between px-6 py-5">
          <DialogTitle className="text-sm text-default font-medium">Report Transaction</DialogTitle>
          <DialogClose className="p-2 text-default">
            <X size={20} />
          </DialogClose>
        </DialogHeader>
        <VisuallyHidden.Root>
          <DialogDescription>Report Transaction Popup</DialogDescription>
        </VisuallyHidden.Root>
        <div className="absolute w-full top-0 right-0 h-27.75 bg-linear-to-r from-[#0080FF] to-[#9747FF] -z-10 opacity-25 blur-3xl pointer-events-none"></div>

        <div className="px-8 pb-8 flex flex-col gap-8 relative select-none">
          {/* Header Warning Graphic & Texts */}
          <div className="flex flex-col items-center gap-1">
            <Image
              src="/images/excalamtion-mark.png"
              width={68}
              height={68}
              alt="Warning Exclamation Mark"
              className="object-contain"
            />
            <h2 className="text-lg font-medium text-black leading-tight">
              Want to report a transaction?
            </h2>
            <p className="opacity-50 font-medium">Fill in the transaction details below</p>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-4 text-left">
            {/* Input: Reference ID */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-default leading-tight">
                Transaction Reference ID
              </label>
              <input
                type="text"
                placeholder="Enter the transaction reference ID"
                readOnly={isReadOnly}
                disabled={loading}
                value={isReadOnly ? defaultRefId : refId}
                onChange={(e) => !isReadOnly && setRefId(e.target.value)}
                className={cn(
                  "w-full px-4 py-3.5 rounded-10 outline outline-default-default text-default font-medium placeholder:text-neutral-400 transition-colors focus:outline-black disabled:opacity-50",
                  isReadOnly ? "bg-neutral-100/70 cursor-not-allowed select-all" : "bg-white cursor-text"
                )}
              />
            </div>

            {/* Input: Description */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-default leading-tight">Description</label>
              <div className="w-full p-4 rounded-10 outline outline-default-default focus:outline-black bg-white overflow-hidden transition-colors flex flex-col">
                <textarea
                  placeholder="Describe the issue"
                  rows={6}
                  className="w-full outline-none resize-none bg-transparent text-default font-medium placeholder:text-neutral-400 disabled:opacity-50"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                />
                <div className="flex items-center gap-2 py-3 border-t border-default-default text-xs text-grey font-medium select-none">
                  <Icon name="info-square" size={16} className="shrink-0" />
                  <span>Keep it detailed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="min-w-36 mx-auto mt-4"
            variant="outline"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Done"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ReportTransactionModal;
