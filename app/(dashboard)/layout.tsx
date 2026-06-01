import React from "react";
import Header from "./components/header";

function DashbaordLayout({
  children,
  notifications,
}: Readonly<{
  children: React.ReactNode;
  notifications: React.ReactNode;
}>) {
  return (
    <div className="bg-page-background h-full flex flex-col gap-6">
      <Header />
      <main>{children}</main>
      {notifications}
    </div>
  );
}

export default DashbaordLayout;
