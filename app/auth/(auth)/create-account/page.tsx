"use client";

import Icon from "@/components/icon";
import TermsPolicyText from "../TermsPolicyText";
import Input from "../../../../components/Input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";

function CreateAccountForm() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Direct credential sign-in using NextAuth
      const res = await signIn("credentials", {
        email,
        password,
        firstName,
        lastName,
        redirect: false,
      });

      if (res?.ok) {
        router.push("/auth/verify?email=" + encodeURIComponent(email));
      } else {
        // Fallback to verify step
        router.push("/auth/verify?email=" + encodeURIComponent(email));
      }
    } catch (err) {
      console.error("Account creation error:", err);
      router.push("/auth/verify?email=" + encodeURIComponent(email));
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
        <h1 className="text-[32px]">Create a profile</h1>
        <p className="text-black/50">This is how you&apos;ll appear in RhythmX</p>
      </div>
      <div className="flex items-center flex-col gap-2">
        <div className="w-26 aspect-square flex items-center justify-center rounded-full bg-default-secondary">
          <Icon name="user-square" size={48} />
        </div>
        <label
          htmlFor="avatar"
          className="outline outline-neutral-default rounded-10 p-1.5 flex items-center gap-2.5 font-medium text-xs cursor-pointer"
        >
          <input type="file" name="avatar" id="avatar" className="hidden" />
          <Icon name="image" size={20} />
          <span className="text-default">Add Photo</span>
        </label>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          name="first-name"
          label="Enter your First Name"
          placeholder="First Name"
          value={firstName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
          required
        />
        <Input
          name="last-name"
          label="Enter your Last Name"
          placeholder="Last Name"
          value={lastName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
          required
        />
        <Input
          name="password"
          label="Set a Password"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          required
        />
        <label
          htmlFor="marketing-opt-in"
          className="flex items-center gap-2.5 font-medium text-xs group cursor-pointer"
        >
          <div className="relative">
            <input
              type="checkbox"
              name="marketing-opt-in"
              id="marketing-opt-in"
              className="peer absolute w-2 h-2 opacity-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              required
            />
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="peer-checked:[&_path:last-child]:block"
            >
              <path
                d="M18.3332 9.99996C18.3332 5.39746 14.6023 1.66663 9.99984 1.66663C5.39734 1.66663 1.6665 5.39746 1.6665 9.99996C1.6665 14.6025 5.39734 18.3333 9.99984 18.3333C14.6023 18.3333 18.3332 14.6025 18.3332 9.99996Z"
                stroke="#0066FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                className="hidden"
                d="M6.6665 10.4167L8.74984 12.5L13.3332 7.5"
                stroke="#0066FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p>I agree to RhythmX marketing communications</p>
        </label>
        <Button rounded={10} width="full" type="submit" disabled={loading}>
          {loading ? "Processing..." : "Continue"}
        </Button>
      </form>
      <TermsPolicyText />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <CreateAccountForm />
    </Suspense>
  );
}
