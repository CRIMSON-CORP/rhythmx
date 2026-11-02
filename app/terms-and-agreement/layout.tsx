"use client";
import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [error, setError] = useState("");
  const [activeAction, setActiveAction] = useState<"agree" | "disagree" | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleTermsAgreement = (accepted: boolean) => {
    return () => {
      setActiveAction(accepted ? "agree" : "disagree");
      startTransition(async () => {
        try {
          setError("");
          await api.patch(API_ROUTES.ONBOARDING.ACCEPT_TERMS, {
            accepted,
          });
          router.push(accepted ? "/billing" : "/");
        } catch (error: unknown) {
          setError(
            (error as Record<string, string>).accepted ||
              (error as Error).message ||
              "Failed to accept terms",
          );
        }
      });
    };
  };

  return (
    <div className="grow max-w-3xl px-5 w-full h-svh mx-auto flex flex-col items-center gap-10 py-16 overflow-auto">
      <Icon name="logo" width={33} height={51} className="text-brand-orange" />
      <header className="flex flex-col items-center text-center gap-1">
        <h1 className="font-medium text-[32px] leading-tight">Terms of Agreement</h1>
        <p className="text-black/50 font-medium">Accept the terms of agreement to continue</p>
      </header>
      <main className="grow overflow-auto rounded-4xl w-full h-full flex -outline-offset-1 outline outline-default-default p-8">
        <div className="grow h-full overflow-auto text-xs font-medium">{children}</div>
      </main>
      {error && (
        <div className="text-red-500 text-sm font-medium text-center bg-red-50 p-3 rounded-md border border-red-200">
          {error}
        </div>
      )}
      <footer className="max-w-xl flex items-center gap-6 w-full">
        <Button
          onClick={handleTermsAgreement(false)}
          disabled={isPending}
          rounded={10}
          variant="outline"
          className="grow"
        >
          {isPending && activeAction === "disagree" ? "Disagreeing..." : "Disagree"}
        </Button>
        <Button
          onClick={handleTermsAgreement(true)}
          disabled={isPending}
          rounded={10}
          className="grow"
          variant="blue"
        >
          {isPending && activeAction === "agree" ? "Agreeing..." : "Agree"}
        </Button>
      </footer>
    </div>
  );
}

export default Layout;
