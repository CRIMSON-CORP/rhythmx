"use client";

import { signOut } from "next-auth/react";
import { PopoverClose } from "@/components/ui/popover";

export default function LogoutButton() {
  return (
    <PopoverClose asChild>
      <button
        type="button"
        className="flex items-center px-4 py-3 cursor-pointer w-full text-left text-sm hover:bg-page-background rounded-xl transition-colors text-default font-medium"
        onClick={() => signOut({ callbackUrl: "/auth/login" })}
      >
        <span>Logout</span>
      </button>
    </PopoverClose>
  );
}
