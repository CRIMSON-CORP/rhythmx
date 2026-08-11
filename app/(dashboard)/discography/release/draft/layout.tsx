import React from "react";
import Header from "./header";

async function DraftLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-page-background h-full flex flex-col gap-6">
      <div className="container">
        <Header />
        {children}
      </div>
    </div>
  );
}

export default DraftLayout;
