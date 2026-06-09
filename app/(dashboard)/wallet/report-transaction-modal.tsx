"use client";
import { X } from "lucide-react";

import { X } from "lucide-react";
import { useState } from "react";
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

function ReportTransactionModal({ defaultRefId }: { defaultRefId?: string }) {
  // Use React controlled state to manage opening and programmatically closing the modal
  const [open, setOpen] = useState(false);
  const [refId, setRefId] = useState(defaultRefId || "");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;

    // Validate fields
    if (!refId.trim() || !description.trim()) {
      goeyToast.error("Transaction Reference ID and Description are required.");
      return;
    }

    setLoading(true);

    // Simulate API request delay (1.5 seconds)
    setTimeout(() => {
      goeyToast.success("Transaction reported successfully.");

      // Clean up fields and programmatically close Dialog
      setRefId("");
      setDescription("");
      setOpen(false);
      setLoading(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-white text-black p-4 flex items-center gap-2 rounded-full cursor-pointer">
          <span>Report Transaction</span>
          <Icon name="chat" size={16} />
        </button>
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
                placeholder="Enter the transaction"
                className="w-full px-4 py-3.5 rounded-10 outline outline-default-default focus:outline-black text-default font-medium placeholder:text-neutral-400 transition-colors disabled:opacity-50"
                value={refId}
                onChange={(e) => setRefId(e.target.value)}
                disabled={loading}
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
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full max-w-36 py-3.5 rounded-full border border-black hover:bg-black hover:text-white transition-all text-black font-semibold cursor-pointer select-none disabled:opacity-50 flex items-center justify-center mx-auto mt-4"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Done"
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ReportTransactionModal;
