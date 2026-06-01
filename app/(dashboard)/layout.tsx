import React from "react";
import Header from "./components/header";

function DashbaordLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-page-background h-full flex flex-col gap-6">
      <Header />
      <main>{children}</main>
    </div>
  );
}

export default DashbaordLayout;
