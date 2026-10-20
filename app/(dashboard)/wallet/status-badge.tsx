import React from "react";
import { Activity, Check, CheckCircle2, Clock, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status?: string;
}

export function StatusBadge({ status = "paid" }: StatusBadgeProps) {
  const normalized = (status || "paid").toLowerCase().replace(/[\s-]/g, "_");

  switch (normalized) {
    case "paid":
      return (
        <div className="px-2.5 py-1 rounded-full flex items-center gap-1.5 bg-[#EBFFEE] text-[#14AE5C] w-fit font-medium text-xs">
          <Check size={14} className="text-[#14AE5C]" />
          <span>Paid</span>
        </div>
      );
    case "approved":
      return (
        <div className="px-2.5 py-1 rounded-full flex items-center gap-1.5 bg-[#EBFFEE] text-[#14AE5C] w-fit font-medium text-xs">
          <CheckCircle2 size={14} className="text-[#14AE5C]" />
          <span>Approved</span>
        </div>
      );
    case "pending":
      return (
        <div className="px-2.5 py-1 rounded-full flex items-center gap-1.5 bg-[#F5F5F5] text-black/70 w-fit font-medium text-xs">
          <Clock size={14} className="text-black/60" />
          <span>Pending</span>
        </div>
      );
    case "on_hold":
      return (
        <div className="px-2.5 py-1 rounded-full flex items-center gap-1.5 bg-brand-orange/10 text-brand-orange w-fit font-medium text-xs">
          <Clock size={14} className="text-brand-orange" />
          <span>On Hold</span>
        </div>
      );
    case "processing":
      return (
        <div className="px-2.5 py-1 rounded-full flex items-center gap-1.5 bg-brand-purple/10 text-brand-purple w-fit font-medium text-xs">
          <Activity size={14} className="text-brand-purple" />
          <span>Processing</span>
        </div>
      );
    case "canceled":
    case "failed":
      return (
        <div className="px-2.5 py-1 rounded-full flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 w-fit font-medium text-xs">
          <XCircle size={14} className="text-red-500" />
          <span>Canceled</span>
        </div>
      );
    default:
      return (
        <div className="px-2.5 py-1 rounded-full flex items-center gap-1.5 bg-[#EBFFEE] text-[#14AE5C] w-fit font-medium text-xs">
          <Check size={14} className="text-[#14AE5C]" />
          <span className="capitalize">{status}</span>
        </div>
      );
  }
}
