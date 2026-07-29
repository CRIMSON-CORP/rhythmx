import React from "react";
import Header from "./components/header";
import GooeyToaster from "./GooeyToaster";
import SessionUpdateListener from "@/components/SessionUpdateListener";

function DashbaordLayout({
  children,
  notifications,
  settings,
}: Readonly<{
  children: React.ReactNode;
  notifications: React.ReactNode;
  settings: React.ReactNode;
}>) {
  return (
    <>
      <div className="bg-page-background grow flex flex-col gap-3 md:gap-6 h-svh overflow-auto">
        <Header />
        <main className="flex flex-col h-full overflow-auto">{children}</main>
      </div>
      <GooeyToaster />
      <SessionUpdateListener />
      {notifications}
      {settings}
    </>
  );
}

export default DashbaordLayout;
