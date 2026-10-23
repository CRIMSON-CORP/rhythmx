"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { GooeyToaster } from "goey-toast";
import "goey-toast/styles.css";
import SessionUpdateListener from "@/components/SessionUpdateListener";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionUpdateListener />
      {children}
      <GooeyToaster position="top-center" />
    </SessionProvider>
  );
}
