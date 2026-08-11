"use client";

import { Button } from "@/components/ui/button";
import Input from "../../../../components/Input";
import TermsPolicyText from "../TermsPolicyText";
import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { verifySchema } from "@/models/verify-schema";

function VerifyForm() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; otp?: string; form?: string }>({});
  const router = useRouter();

  const handleVerify = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setErrors({});

    const result = verifySchema.safeParse({ email, otp });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        otp: fieldErrors.otp?.[0],
      });
      return;
    }

    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        otp,
        userAgent: navigator.userAgent,
        redirect: false,
        callbackUrl: "/auth/create-account",
      });

      if (res?.ok) {
        window.location.href = "/auth/create-account";
      } else if (res?.error) {
        setErrors({ form: res.error });
      } else {
        setErrors({ form: "Verification failed. Please try again." });
      }
    } catch (err: unknown) {
      console.error("Verification error:", err);
      setErrors({
        form: (err as Error).message || "Failed to verify code. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-107.5 m-auto gap-8">
      <button
        onClick={router.back}
        className="absolute top-16 left-5 p-2 rounded-full outline outline-border-default-secondary"
      >
        <ChevronLeft size={20} />
      </button>
      <div className="space-y-1 text-2xl font-semibold text-center">
        <h1>Verification</h1>
        <p className="text-black/50">
          Enter the code we sent to <span className="text-black">{email || "your email"}</span>
        </p>
      </div>
      {errors.form && (
        <div className="text-red-500 text-sm font-medium text-center bg-red-50 p-3 rounded-md border border-red-200">
          {errors.form}
        </div>
      )}
      <form onSubmit={handleVerify} className="space-y-6">
        <Input
          prefilled
          name="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
            if (errors.email || errors.form) {
              setErrors((prev) => ({ ...prev, email: undefined, form: undefined }));
            }
          }}
          placeholder="Enter your email address"
          error={errors.email}
        />
        <Input
          name="otp"
          label="OTP"
          type="text"
          value={otp}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setOtp(e.target.value);
            if (errors.otp || errors.form) {
              setErrors((prev) => ({ ...prev, otp: undefined, form: undefined }));
            }
          }}
          placeholder="Enter OTP here"
          error={errors.otp}
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
