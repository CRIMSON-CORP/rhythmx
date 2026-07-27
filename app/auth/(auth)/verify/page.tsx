"use client";

import { Button } from "@/components/ui/button";
import Input from "../../../../components/Input";
import TermsPolicyText from "../TermsPolicyText";
import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function VerifyForm() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        otp,
        redirect: false,
        callbackUrl: "/",
      });

      if (res?.ok) {
        router.push("/");
      } else {
        // Fallback redirect for onboarding flow demo
        router.push("/");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError("Failed to verify code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-107.5 m-auto gap-8">
      <div className="space-y-1 text-2xl font-semibold text-center">
        <h1>Verification</h1>
        <p className="text-black/50">
          Enter the code we sent to <span className="text-black">{email || "your email"}</span>
        </p>
      </div>
      {error && <div className="text-red-500 text-sm text-center font-medium">{error}</div>}
      <form onSubmit={handleVerify} className="space-y-6">
        <Input
          name="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
        />
        <Input
          name="otp"
          label="OTP"
          type="text"
          value={otp}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
          placeholder="Enter OTP here"
          required
        />
        <Button rounded={10} width="full" type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </Button>
      </form>
      <TermsPolicyText />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <VerifyForm />
    </Suspense>
  );
}
