import React from "react";
import Header from "./components/header";

function DashbaordLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="p4 md:p-10 bg-page-background h-full">
      <Header />
      <main>{children}</main>
    </div>
  );
}

export default DashbaordLayout;
