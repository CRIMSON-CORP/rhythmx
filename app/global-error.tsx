"use client";

import React, { useState } from "react";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import {
  AlertTriangle,
  RefreshCw,
  Home,
  ArrowLeft,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Terminal,
  ShieldAlert,
  Disc3,
  Sparkles,
} from "lucide-react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-heading",
});

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = () => {
    setIsResetting(true);
    try {
      reset();
    } catch {
      window.location.reload();
    }
  };

  const handleCopy = async () => {
    const errorDetails = `
=== Rhythmx System Error Log ===
Timestamp: ${new Date().toISOString()}
Message: ${error?.message || "Unknown error"}
Digest: ${error?.digest || "N/A"}
Stack Trace:
${error?.stack || "No stack trace available"}
`.trim();

    try {
      await navigator.clipboard.writeText(errorDetails);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = errorDetails;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <html
      lang="en"
      className={`h-full dark font-sans antialiased ${inter.variable} ${bricolage.variable}`}
    >
      <body className="min-h-full bg-[#07090e] text-zinc-100 flex items-center justify-center p-4 sm:p-6 overflow-x-hidden selection:bg-[#ff4907]/30 selection:text-white">
        {/* Dynamic Background Ambient Gradients */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#ff4907]/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-1/2 -right-40 w-[30rem] h-[30rem] bg-[#9747ff]/20 rounded-full blur-[140px]" />
          <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-[#0066ff]/20 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        </div>

        {/* Main Error Container */}
        <main className="relative z-10 w-full max-w-2xl mx-auto my-auto">
          <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden transition-all duration-300">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff4907] via-50% to-transparent opacity-70" />

            {/* Header Icon Graphic */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#ff4907] via-[#9747ff] to-[#0066ff] blur-md opacity-50 animate-pulse" />
                <div className="relative size-20 sm:size-24 rounded-2xl bg-zinc-950/80 border border-white/15 flex items-center justify-center shadow-xl">
                  <Disc3 className="size-10 sm:size-12 text-[#ff4907] animate-[spin_8s_linear_infinite]" />
                  <div className="absolute -bottom-1 -right-1 size-7 rounded-full bg-[#ec221f] text-white flex items-center justify-center border-2 border-zinc-950 shadow-md">
                    <AlertTriangle className="size-4" />
                  </div>
                </div>
              </div>

              {/* Title & Tagline */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 mb-3">
                <Sparkles className="size-3.5 text-[#ff4907]" />
                <span>System Error Boundary</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold font-heading tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent mb-3">
                Rhythm Interrupted
              </h1>

              <p className="text-zinc-400 text-sm sm:text-base max-w-md leading-relaxed mb-6">
                An unexpected exception halted processing in the application layout. Your current workspace state remains safe.
              </p>

              {/* Error Digest Tag if present */}
              {error?.digest && (
                <div className="mb-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs font-mono text-zinc-400">
                  <ShieldAlert className="size-3.5 text-amber-400 shrink-0" />
                  <span>Error Digest:</span>
                  <code className="text-amber-300 font-semibold">{error.digest}</code>
                </div>
              )}
            </div>

            {/* Action Buttons Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 w-full">
              <button
                onClick={handleReset}
                disabled={isResetting}
                className="w-full sm:w-auto min-w-[140px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#ff4907] to-[#9747ff] hover:brightness-110 active:scale-[0.98] text-white font-medium text-sm transition-all shadow-lg shadow-[#ff4907]/20 disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`size-4 ${isResetting ? "animate-spin" : ""}`} />
                <span>{isResetting ? "Reloading..." : "Try Again"}</span>
              </button>

              <a
                href="/"
                className="w-full sm:w-auto min-w-[140px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 active:scale-[0.98] border border-white/10 text-white font-medium text-sm transition-all cursor-pointer"
              >
                <Home className="size-4 text-zinc-300" />
                <span>Dashboard</span>
              </a>

              <button
                onClick={handleGoBack}
                className="w-full sm:w-auto min-w-[120px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-transparent hover:bg-white/5 active:scale-[0.98] border border-white/10 text-zinc-300 hover:text-white font-medium text-sm transition-all cursor-pointer"
              >
                <ArrowLeft className="size-4" />
                <span>Go Back</span>
              </button>
            </div>

            {/* Collapsible Technical Details Section */}
            <div className="border-t border-white/10 pt-4">
              <button
                onClick={() => setShowDetails((prev) => !prev)}
                className="w-full flex items-center justify-between py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Terminal className="size-4 text-[#9747ff]" />
                  <span>Technical Diagnostic Logs</span>
                </span>
                {showDetails ? (
                  <ChevronUp className="size-4" />
                ) : (
                  <ChevronDown className="size-4" />
                )}
              </button>

              {showDetails && (
                <div className="mt-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between bg-zinc-950/60 p-3 rounded-xl border border-white/5">
                    <span className="text-xs text-zinc-400 truncate max-w-[70%] font-mono">
                      {error?.name || "Error"}: {error?.message || "Unknown rendering exception"}
                    </span>
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-all shrink-0 cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="size-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" />
                          <span>Copy Info</span>
                        </>
                      )}
                    </button>
                  </div>

                  {error?.stack && (
                    <div className="relative rounded-xl bg-zinc-950/90 border border-zinc-800/80 p-4 font-mono text-[11px] leading-relaxed text-zinc-400 overflow-x-auto max-h-48 scrollbar-none">
                      <pre className="whitespace-pre-wrap break-all">{error.stack}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
