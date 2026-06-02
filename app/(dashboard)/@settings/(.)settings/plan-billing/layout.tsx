"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PlanBillingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBilling = pathname.endsWith("/plan-billing/billing");

  return (
    <div className="flex flex-col h-full bg-page-background">
      {/* Top Switcher */}
      <div className="flex justify-center gap-3 p-3 shrink-0">
        <Link
          href="/settings/plan-billing"
          className={`px-4 py-2 rounded-full transition-all ${
            !isBilling
              ? "outline outline-default bg-white text-default"
              : "text-grey hover:text-default"
          }`}
        >
          Manage Plan
        </Link>
        <Link
          href="/settings/plan-billing/billing"
          className={`px-4 py-2 rounded-full transition-all ${
            isBilling
              ? "outline outline-default bg-white text-default"
              : "text-grey hover:text-default"
          }`}
        >
          Billings
        </Link>
      </div>

      {/* Scrollable Sub-Page Content */}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
