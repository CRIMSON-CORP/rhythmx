"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Input from "../../../../components/Input";
import TermsPolicyText from "../TermsPolicyText";
import { handleGetStartedAction } from "../../actions";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { getStartedSchema } from "@/models/get-started-schema";

function Page() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError("");

    const result = getStartedSchema.safeParse({ email });
    if (!result.success) {
      const firstError = result.error.issues[0]?.message;
      setError(firstError || "Invalid email address");
      return;
    }

    setLoading(true);

    try {
      const res = await handleGetStartedAction(email);
      if (res && !res.success && res.error) {
        setError(res.error);
      }
    } catch (err: unknown) {
      setError((err as Error).message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-107.5 m-auto gap-8">
      <div className="space-y-1 text-2xl font-semibold max-w-85.25">
        <h1>Hey, you could be the next BIG thing</h1>
        <p className="text-black/50">Get started</p>
      </div>
      <div className="flex flex-col gap-3 font-medium *:bg-white *:outline *:outline-[#D9D9D9] *:flex *:items-center *:justify-center *:gap-2.5 *:p-4 *:rounded-10">
        <GoogleSignInButton />
        <label htmlFor="get-started-input" className="cursor-pointer">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6M22 6L12 13L2 6"
              stroke="#1E1E1E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Continue with Email</span>
        </label>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="get-started-input"
          type="email"
          name="email"
          label="Email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          error={error}
        />
        <Button rounded={10} width="full" type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
      <TermsPolicyText />
    </div>
  );
}

export default Page;
