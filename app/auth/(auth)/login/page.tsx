"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Input from "../../../../components/Input";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { loginSchema } from "@/models/login-schema";
import { signIn } from "next-auth/react";

function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setLoading(true);

    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (!res) {
        setErrors({ form: "Login failed. Please try again." });
        return;
      }

      if (res.ok) {
        const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl") || "/";
        window.location.href = callbackUrl || "/";
      } else if (res.error) {
        if (res.status === 401) {
          setErrors({ form: "Invalid email or Password" });
          return;
        }
        throw res;
      }
    } catch (err: unknown) {
      setErrors({
        form: (err as Error).message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-107.5 m-auto gap-8">
      <div className="space-y-1 text-2xl font-semibold max-w-85.25">
        <h1>Hi big dawg, welcome back.</h1>
        <p className="text-black/50">Login</p>
      </div>
      {errors.form && (
        <div className="text-red-500 text-sm font-medium text-center bg-red-50 p-3 rounded-md border border-red-200">
          {errors.form}
        </div>
      )}
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
            if (errors.email || errors.form) {
              setErrors((prev) => ({ ...prev, email: undefined, form: undefined }));
            }
          }}
          error={errors.email}
        />
        <Input
          name="password"
          label="Password"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value);
            if (errors.password || errors.form) {
              setErrors((prev) => ({ ...prev, password: undefined, form: undefined }));
            }
          }}
          error={errors.password}
        />
        <Button rounded={10} width="full" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
      <div className="flex flex-col gap-3 font-medium *:bg-white *:outline *:outline-[#D9D9D9] *:flex *:items-center *:justify-center *:gap-2.5 *:p-4 *:rounded-10">
        <GoogleSignInButton />
      </div>
    </div>
  );
}

export default Page;
