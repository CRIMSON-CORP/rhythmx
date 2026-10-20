import React from "react";
import Header from "./components/header";
import SessionUpdateListener from "@/components/SessionUpdateListener";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { isRedirectError } from "next/dist/client/components/redirect-error";

async function DashbaordLayout({
  children,
  notifications,
  settings,
}: Readonly<{
  children: React.ReactNode;
  notifications: React.ReactNode;
  settings: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  // Check subscription status
  try {
    const subRes = await api.get<SubscriptionResponse>(API_ROUTES.SUBSCRIPTION.GET);
    const subscription = subRes?.subscription;
    const isActive = subscription && subscription.status === "active";

    if (!isActive) {
      redirect("/billing");
    }
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Subscription check failed in dashboard layout:", error);
    redirect("/billing");
  }

  return (
    <>
      <div className="bg-page-background grow flex flex-col gap-3 md:gap-6 h-svh overflow-auto">
        <Header />
        <main className="flex flex-col h-full overflow-auto">{children}</main>
      </div>
      <SessionUpdateListener />
      {notifications}
      {settings}
    </>
  );
}

export default DashbaordLayout;
