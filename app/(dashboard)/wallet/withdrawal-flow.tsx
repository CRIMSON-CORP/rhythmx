"use client";
import useWithdrawalStore, { WithdrawalView } from "@/store/withdrawal-store";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SelectArtistView from "./views/select-artist";
import EnterAmountView from "./views/enter-amount";
import WithdrawalBank from "./views/withdrawal-bank";
import EnterOtpView from "./views/enter-otp";
import TransferSuccess from "./views/transfer-success";
import { VisuallyHidden } from "radix-ui";
import { ArrowUpRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const VIEW_MAP: Record<WithdrawalView, React.ComponentType> = {
  "select-artist": SelectArtistView,
  "enter-amount": EnterAmountView,
  "withdrawal-bank": WithdrawalBank,
  "enter-otp": EnterOtpView,
  "tranfer-success": TransferSuccess,
};

const TITLE_MAP: Record<WithdrawalView, string> = {
  "select-artist": "Select Artist",
  "enter-amount": "Enter Amount",
  "withdrawal-bank": "Withdraw to Bank",
  "enter-otp": "Withdraw to Bank",
  "tranfer-success": "Transferred",
};

interface WithdrawalFlowProps {
  initialArtistReference?: string | null;
  trigger?: React.ReactNode;
}

function WithdrawalFlow({ initialArtistReference, trigger }: WithdrawalFlowProps = {}) {
  const view = useWithdrawalStore((state) => state.view);
  const resetState = useWithdrawalStore((state) => state.resetState);
  const setForm = useWithdrawalStore((state) => state.setForm);
  const setView = useWithdrawalStore((state) => state.setView);
  const Component = VIEW_MAP[view];
  const title = TITLE_MAP[view];

  const handleOpenChange = (open: boolean) => {
    if (open) {
      if (initialArtistReference) {
        setForm({ selected_artist: initialArtistReference, amount: 0 });
        setView("enter-amount");
      } else {
        resetState();
      }
    } else {
      resetState();
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button>
            <span>Withdraw</span>
            <ArrowUpRight size={16} />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className="overflow-hidden rounded-30 isolate gap-0 max-w-150"
        showCloseButton={false}
      >
        <DialogHeader className="flex-row items-center justify-between px-6 py-5 relative z-10 bg-transparent">
          <DialogTitle className="text-sm text-default font-medium">{title}</DialogTitle>
          <DialogClose className="p-2 text-default hover:bg-black/5 rounded-full transition-colors cursor-pointer">
            <X size={20} />
          </DialogClose>
        </DialogHeader>
        <VisuallyHidden.Root>
          <DialogDescription>Withdrawal Popup</DialogDescription>
        </VisuallyHidden.Root>
        <Component />
      </DialogContent>
    </Dialog>
  );
}

export default WithdrawalFlow;
