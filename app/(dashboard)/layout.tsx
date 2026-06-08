import React from "react";
import Header from "./components/header";
import GooeyToaster from "./GooeyToaster";

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
    <div className="bg-page-background grow flex flex-col gap-6">
      <Header />
      <main className="grow flex flex-col">{children}</main>
      {notifications}
      {settings}
      <GooeyToaster />
    </div>
  );
}

export default DashbaordLayout;
