"use client";
import useWithdrawalStore, { WithdrawalView } from "@/store/withdrawal-store";
import React, { useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Icon from "@/components/icon";
import SelectArtistView from "./views/select-artist";
import EnterAmountView from "./views/enter-amount";
import WithdrawalBank from "./views/withdrawal-bank";
import EnterOtpView from "./views/enter-otp";
import TransferSuccess from "./views/transfer-success";
import { VisuallyHidden } from "radix-ui";

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

function WithdrawalFlow() {
  const view = useWithdrawalStore((state) => state.view);
  const resetState = useWithdrawalStore((state) => state.resetState);
  const Component = VIEW_MAP[view];
  const title = TITLE_MAP[view];

  useEffect(() => resetState, [resetState]);
  return (
    <Dialog>
      <DialogTrigger className="bg-black text-white p-4 flex items-center gap-2 rounded-full">
        <span>Withdraw</span>
        <Icon name="arrow-up-right" size={16} />
      </DialogTrigger>
      <DialogContent
        className="overflow-hidden rounded-30 isolate gap-0 max-w-150"
        showCloseButton={false}
      >
        <DialogHeader className="flex-row items-center justify-between px-6 py-5">
          <DialogTitle className="text-sm text-default font-medium">{title}</DialogTitle>
          <DialogClose className="p-2 text-default">
            <Icon name="cancel" size={20} />
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
