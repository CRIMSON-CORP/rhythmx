"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function TabLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive =
    href === "/settings/plan-billing"
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      replace
      className={`px-4 py-2 rounded-full transition-all ${
        isActive
          ? "outline outline-default bg-white text-default font-medium"
          : "text-grey hover:text-default"
      }`}
    >
      {children}
    </Link>
  );
}

export default function PlanBillingTabs({ canShare }: { canShare: boolean }) {
  return (
    <div className="flex justify-center gap-3 p-3 shrink-0">
      <TabLink href="/settings/plan-billing">Manage Plan</TabLink>
      <TabLink href="/settings/plan-billing/billing">Billings</TabLink>
      {canShare && <TabLink href="/settings/plan-billing/sharing">Sharing</TabLink>}
    </div>
  );
}

