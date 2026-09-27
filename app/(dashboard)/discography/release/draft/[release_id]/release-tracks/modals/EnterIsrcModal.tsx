"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "radix-ui";
import { X } from "lucide-react";
import { goeyToast } from "goey-toast";
import { Button } from "@/components/ui/button";

interface EnterIsrcModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue?: string;
  onConfirm: (isrc: string) => void;
}

export function EnterIsrcModal({
  open,
  onOpenChange,
  initialValue = "",
  onConfirm,
}: EnterIsrcModalProps) {
  const [isrc, setIsrc] = useState(initialValue);

  useEffect(() => {
    if (open) {
      setIsrc(initialValue);
    }
  }, [open, initialValue]);

  const handleDone = () => {
    const trimmed = isrc.trim();
    if (!trimmed) {
      goeyToast.error("ISRC Code Required", {
        description: "Please enter an ISRC code to check this option.",
      });
      return;
    }

    onConfirm(trimmed);
    onOpenChange(false);
    goeyToast.success("ISRC code saved");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-150 rounded-30 p-0 overflow-hidden isolate gap-0 border border-default-default/20 shadow-2xl"
        showCloseButton={false}
      >
        <VisuallyHidden.Root>
          <DialogHeader>
            <DialogTitle>Enter ISRC</DialogTitle>
            <DialogDescription>Enter the ISRC code for this track</DialogDescription>
          </DialogHeader>
        </VisuallyHidden.Root>

        {/* Top glow */}
        <div className="absolute w-full top-0 left-0 right-0 h-28 bg-linear-to-r from-[#9747FF] to-[#FFC107] -z-10 opacity-20 blur-3xl pointer-events-none" />

        {/* Header */}
        <header className="px-6 py-5 flex items-center justify-between border-b border-default-default/10">
          <span className="text-sm font-medium">Enter ISRC</span>
          <DialogClose className="p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer">
            <X size={20} className="text-default" />
          </DialogClose>
        </header>

        <div className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-medium text-default">ISRC</label>
            <input
              type="text"
              value={isrc}
              onChange={(e) => setIsrc(e.target.value.toUpperCase())}
              placeholder="Enter ISRC code"
              autoFocus
              className="w-full bg-white rounded-md border border-default-default p-4 leading-none font-medium outline-none focus:border-brand-orange transition-colors placeholder:text-border-default-secondary/70 tracking-wider uppercase"
            />
          </div>

          <div className="pt-2 flex justify-center">
            <Button type="button" rounded={10} onClick={handleDone} className="w-full max-w-60">
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EnterIsrcModal;
