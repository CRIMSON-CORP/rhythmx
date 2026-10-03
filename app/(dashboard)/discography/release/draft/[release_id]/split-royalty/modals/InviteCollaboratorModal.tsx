"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "radix-ui";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { goeyToast } from "goey-toast";
import Input from "@/components/Input";

interface InviteCollaboratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maxPercentage?: number;
  onSendInvite: (data: { name: string; email: string; percentage: number }) => void;
}

export function InviteCollaboratorModal({
  open,
  onOpenChange,
  maxPercentage = 100,
  onSendInvite,
}: InviteCollaboratorModalProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [percentage, setPercentage] = useState<number | "">("");

  // Saved info for the success screen
  const [submittedData, setSubmittedData] = useState<{ name: string; email: string } | null>(null);

  const handleClose = () => {
    onOpenChange(false);
    // Reset back to form after closing
    setTimeout(() => {
      setStep("form");
      setName("");
      setEmail("");
      setPercentage("");
      setSubmittedData(null);
    }, 200);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      handleClose();
    } else {
      onOpenChange(true);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!name.trim()) {
      goeyToast.error("Name Required", {
        description: "Please enter the collaborator's name.",
      });
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      goeyToast.error("Invalid Email", {
        description: "Please enter a valid email address.",
      });
      return;
    }

    const percentNum = Number(percentage);
    if (!percentage || percentNum <= 0) {
      goeyToast.error("Invalid Percentage", {
        description: "Please enter a percentage greater than 0%.",
      });
      return;
    }

    if (percentNum > maxPercentage) {
      goeyToast.error("Limit Exceeded", {
        description: `Split percentage cannot exceed remaining ${maxPercentage}%.`,
      });
      return;
    }

    // Call parent to add collaborator into split list
    onSendInvite({
      name: name.trim(),
      email: email.trim(),
      percentage: percentNum,
    });

    // Save submitted data and transition to success step
    setSubmittedData({
      name: name.trim(),
      email: email.trim(),
    });
    setStep("success");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="gap-0 max-w-150 w-full p-0 overflow-hidden isolate border border-default-default/20 rounded-30 shadow-2xl"
        showCloseButton={false}
      >
        <VisuallyHidden.Root>
          <DialogHeader>
            <DialogTitle>{step === "success" ? "Invite sent" : "Invite Collaborator"}</DialogTitle>
            <DialogDescription>
              {step === "success"
                ? "Royalty split invite sent successfully"
                : "Send an email invite with royalty split"}
            </DialogDescription>
          </DialogHeader>
        </VisuallyHidden.Root>

        {/* Top glow background */}
        <div className="absolute w-full top-0 left-0 right-0 h-40 bg-linear-to-r from-[#9747FF] to-[#FFC107] -z-10 opacity-20 blur-3xl pointer-events-none" />

        {/* Header */}
        <header className="p-6 pb-0 flex items-center justify-between">
          <span className="text-default text-sm font-medium">
            {step === "form" ? "Invite Collaborator" : ""}
          </span>
          <DialogClose
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer ml-auto"
          >
            <X size={24} className="text-default" />
          </DialogClose>
        </header>

        {step === "form" ? (
          /* Form Body */
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            {/* Name Field */}
            <Input
              name="name"
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter"
            />

            {/* Email and Percentage */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-default-tertiary font-medium">
                An email will sent to the collaborated with the percentage split
              </label>
              <div className="flex items-center gap-3">
                <Input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter collaborator's email"
                />
                <div className="relative w-28 shrink-0">
                  <Input
                    name="percentage"
                    type="number"
                    value={percentage}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "") {
                        setPercentage("");
                        return;
                      }
                      const num = parseInt(val, 10);
                      if (isNaN(num)) return;
                      setPercentage(Math.min(maxPercentage, Math.max(0, num)));
                    }}
                    placeholder="50%"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button size="sm" type="submit" variant="white-outline">
                <span>Send invite</span>
                <Send size={24} />
              </Button>
            </div>
          </form>
        ) : (
          /* Success Screen Body (Image provided) */
          <div className="p-8 pt-4 pb-12 flex flex-col items-center justify-center text-center animate-in fade-in">
            {/* 3D Checkmark Graphic */}
            <div className="relative size-32 sm:size-36 mb-6">
              <Image
                src="/images/checkmark.png"
                alt="Invite sent"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Heading */}
            <h3 className="text-xl sm:text-2xl font-heading font-semibold text-default mb-2.5">
              Invite sent
            </h3>

            {/* Subtitle */}
            <p className="text-sm text-border-default-secondary font-medium max-w-sm leading-relaxed mb-8">
              You have successfully send royalty split invite to{" "}
              <span className="text-default font-medium">
                {submittedData?.name || "Davido"} ({submittedData?.email || "davido@gmail.com"})
              </span>
            </p>

            {/* Done Action Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="rounded-full px-10 py-3 border-black text-default text-sm font-medium hover:bg-black/5 min-w-32"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default InviteCollaboratorModal;
