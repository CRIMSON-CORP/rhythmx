"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Check, Search } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

function formatBillingDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr.includes(" ") ? dateStr.replace(" ", "T") : dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function BillingHistoryClient({
  initialHistory = [],
}: {
  initialHistory: SubscriptionPaymentHistoryItem[];
}) {
  const [search, setSearch] = useState("");

  const filteredHistory = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return initialHistory;

    return initialHistory.filter((item) => {
      const planMatch = item.plan_name?.toLowerCase().includes(q);
      const formattedDate = formatBillingDate(item.created_at).toLowerCase();
      const rawDateMatch = item.created_at?.toLowerCase().includes(q);
      const methodMatch = item.method?.toLowerCase().includes(q);
      return planMatch || formattedDate.includes(q) || rawDateMatch || methodMatch;
    });
  }, [initialHistory, search]);

  return (
    <div className="px-3 md:px-8 py-4 flex flex-col gap-3 flex-1 overflow-auto">
      {/* Billing History Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Billing History</h3>

        {/* If populated, show the search input; if empty, show Help? */}
        {initialHistory.length > 0 ? (
          <div className="flex items-center gap-2 px-4 py-3 text-sm text-default-tertiary w-full max-w-82 bg-white rounded-xl">
            <Search size={16} className="shrink-0 text-grey" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search history by date or plan"
              className="bg-transparent outline-none w-full text-sm font-medium placeholder-grey text-default"
            />
          </div>
        ) : (
          <a href="#" className="text-xs text-brand-blue font-bold hover:underline">
            Help?
          </a>
        )}
      </div>

      {/* Billing History Table / Empty State */}
      {initialHistory.length === 0 ? (
        <div className="flex-1 bg-white rounded-2xl flex flex-col gap-8 items-center justify-center py-16 px-6 text-center">
          <Image
            src="/images/old-computer-with-sprouted-clover.png"
            alt="old computer with sprouted clover"
            width={86}
            height={74}
          />
          <div className="flex flex-col gap-1">
            <h4 className="text-lg font-medium">No billing history</h4>
            <p className="text-black/50 max-w-sm font-medium leading-relaxed">
              You currently do not have any billing history yet, but if you do it will show up here
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-auto border border-black/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse overflow-auto">
              <thead>
                <tr className="border-b border-black/5 font-medium text-default/50 text-xs">
                  <th className="py-4 px-6">Plan</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Method</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/3 overflow-auto">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-sm text-default-tertiary font-medium"
                    >
                      No matching billing records found.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((item, idx) => (
                    <tr
                      key={idx}
                      className="text-xs text-default font-medium hover:bg-black/1 transition-colors"
                    >
                      <td className="py-4.5 px-6 font-medium text-default">{item.plan_name}</td>
                      <td className="py-4.5 px-6">{formatBillingDate(item.created_at)}</td>
                      <td className="py-4.5 px-6">
                        {formatCurrency(item.amount, item.currency || "NGN")}
                      </td>
                      <td className="py-4.5 px-6">{item.method || "Card"}</td>
                      <td className="py-4.5 px-6">
                        <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-default-secondary">
                          <Check size={16} className="text-positive-tertiary" />
                          Paid
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
