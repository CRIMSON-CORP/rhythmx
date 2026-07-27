"use client";

import { CommandItem } from "@/components/ui/command";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <CommandItem
      key="logout"
      className="px-4 py-3 cursor-pointer"
      onSelect={() => signOut({ callbackUrl: "/auth/login" })}
      onClick={() => signOut({ callbackUrl: "/auth/login" })}
    >
      <span>Logout</span>
    </CommandItem>
  );
}
