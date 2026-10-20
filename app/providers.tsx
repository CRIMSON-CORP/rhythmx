"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { GooeyToaster } from "goey-toast";
import "goey-toast/styles.css";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <GooeyToaster position="top-center" />
    </SessionProvider>
  );
}
