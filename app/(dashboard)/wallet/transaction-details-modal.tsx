"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { StatusBadge } from "./status-badge";
import ReportTransactionModal from "./report-transaction-modal";

interface TransactionDetailsModalProps {
  reference: string;
  initialData?: WalletTransaction;
}

function formatCurrency(amount: number, currencyCode: string = "GBP"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr.replace(" ", "T"));
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function TransactionDetailsModal({
  reference,
  initialData,
}: TransactionDetailsModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState<WalletTransaction | null>(
    initialData || null
  );

  const handleOpenChange = async (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setLoading(true);
      try {
        const cleanRef = reference.replace(/^#/, "");
        const res = await api.get<TransactionDetailsResponse>(
          API_ROUTES.EARNINGS.TRANSACTIONS.DETAILS(cleanRef)
        );
        if (res?.transaction) {
          setTransaction(res.transaction);
        }
      } catch (error) {
        console.warn("Failed to fetch transaction details on demand:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const tx = transaction || initialData;
  const isCredit = (tx?.type || "credit").toLowerCase() === "credit";
  const displaySource =
    tx?.source
      ? tx.source.charAt(0).toUpperCase() + tx.source.slice(1).replace(/_/g, " ")
      : "Royalty";
  const displayType =
    tx?.type
      ? tx.type.charAt(0).toUpperCase() + tx.type.slice(1)
      : "Credit";

  const transactByName = tx?.transact_by?.name;
  const transactByAvatar = tx?.transact_by?.avatar_url || "/images/release-1.png";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-brand-blue hover:underline text-left font-medium"
        >
          #{reference.replace(/^#/, "")}
        </button>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="max-w-173 overflow-hidden gap-0 rounded-30">
        <DialogHeader className="flex-row items-center justify-between px-6 py-5 border-b border-default-default">
          <DialogTitle className="text-sm text-default font-medium">
            Transaction Details
          </DialogTitle>
          <DialogClose className="p-2 text-default hover:bg-default-secondary/10 rounded-full transition-colors">
            <X size={20} />
          </DialogClose>
        </DialogHeader>

        {loading && !tx ? (
          <div className="p-16 flex items-center justify-center gap-2 text-default-tertiary">
            <Loader2 size={24} className="animate-spin text-brand-orange" />
            <span>Loading transaction details...</span>
          </div>
        ) : tx ? (
          <div className="p-6 flex flex-col gap-6">
            <div className="p-6 bg-default-secondary/5 rounded-20 flex items-center justify-between text-xl">
              <div className="flex items-center gap-2.5 flex-wrap">
                <p className="text-default font-semibold">#{tx.reference.replace(/^#/, "")}</p>
                <div
                  className={`rounded-full p-1 ${
                    isCredit ? "bg-[#EBFFEE] text-[#14AE5C]" : "bg-red-50 text-red-500"
                  }`}
                >
                  {isCredit ? <ArrowDown size={14} /> : <ArrowUpRight size={14} />}
                </div>
                <StatusBadge status={tx.status} />
              </div>
              <p className="font-semibold text-2xl text-default">
                {isCredit ? "+" : "-"}
                {formatCurrency(tx.amount, tx.currency)}
              </p>
            </div>

            <div className="flex flex-col divide-y divide-default-default text-sm">
              <div className="flex items-center justify-between py-3.5">
                <p className="text-default/50 font-medium">Transaction Date</p>
                <p className="font-medium text-default">{formatDate(tx.created_at)}</p>
              </div>
              <div className="flex items-center justify-between py-3.5">
                <p className="text-default/50 font-medium">Transaction Type</p>
                <p className="font-medium text-default">{displaySource}</p>
              </div>
              <div className="flex items-center justify-between py-3.5">
                <p className="text-default/50 font-medium">Transaction Action</p>
                <p className="font-medium text-default">{displayType}</p>
              </div>
              <div className="flex items-center justify-between py-3.5">
                <p className="text-default/50 font-medium">Status</p>
                <StatusBadge status={tx.status} />
              </div>
              <div className="flex items-center justify-between py-3.5">
                <p className="text-default/50 font-medium">Transact by</p>
                <p className="flex items-center gap-2.5">
                  <Image
                    src={transactByAvatar}
                    alt={transactByName || "avatar"}
                    width={24}
                    height={24}
                    unoptimized
                    className="rounded-full object-cover w-6 h-6 shrink-0"
                  />
                  <span className="text-default font-medium">{transactByName}</span>
                </p>
              </div>
              <div className="flex items-center justify-between py-3.5">
                <p className="text-default/50 font-medium">Reference ID</p>
                <p className="font-mono text-default font-medium">{tx.reference}</p>
              </div>
              {tx.amount_ngn !== undefined && tx.amount_ngn !== null && (
                <div className="flex items-center justify-between py-3.5">
                  <p className="text-default/50 font-medium">Local Amount (NGN)</p>
                  <p className="font-medium text-default">
                    ₦{Number(tx.amount_ngn).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {tx.report ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 text-center font-medium">
                Reported ({tx.report.status}) on {formatDate(tx.report.reported_at)}
              </div>
            ) : (
              <div className="outline outline-black rounded-full w-fit mx-auto mt-2">
                <ReportTransactionModal defaultRefId={tx.reference} />
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 text-center text-default-tertiary">
            Failed to load transaction details.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
