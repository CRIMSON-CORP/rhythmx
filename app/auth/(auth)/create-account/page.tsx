"use client";

import TermsPolicyText from "../TermsPolicyText";
import Input from "../../../../components/Input";
import { Button } from "@/components/ui/button";
import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { createAccountSchema } from "@/models/create-account-schema";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";

interface FormFields {
  first_name?: string;
  last_name?: string;
  password?: string;
  form?: string;
}

function CreateAccountForm() {
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormFields>({});
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    if (!file.type.startsWith("image")) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const rawData = {
      first_name: (formData.get("first_name") as string) || "",
      last_name: (formData.get("last_name") as string) || "",
      password: (formData.get("password") as string) || "",
      marketing_opt_in:
        formData.get("marketing_opt_in") === "on" || formData.get("marketing_opt_in") === "true",
    };

    const validation = createAccountSchema.safeParse(rawData);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        first_name: fieldErrors.first_name?.[0],
        last_name: fieldErrors.last_name?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setLoading(true);

    try {
      const promises: Promise<unknown>[] = [
        api.patch(API_ROUTES.ONBOARDING.PROFILE, validation.data),
      ];

      // Avatar upload request (if selected)
      if (avatarFile) {
        const avatarFormData = new FormData();
        avatarFormData.append("avatar", avatarFile);

        promises.push(
          api.postFormData({
            url: API_ROUTES.ONBOARDING.UPLOAD_AVATAR,
            formData: avatarFormData,
          }),
        );
      }

      await Promise.all(promises);
      window.location.href = "/onboarding";
    } catch (err: unknown) {
      console.error("Profile creation error:", err);
      if (typeof err === "string") {
        setErrors({ form: err });
      } else {
        setErrors(err as FormFields);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col max-w-107.5 m-auto gap-8 pb-12">
      <button
        type="button"
        onClick={router.back}
        className="absolute top-16 left-5 p-2 rounded-full outline outline-border-default-secondary"
      >
        <ChevronLeft size={20} />
      </button>
      <div className="space-y-1 text-2xl font-semibold text-center">
        <h1 className="text-[32px]">Create a profile</h1>
        <p className="text-black/50">This is how you&apos;ll appear in RhythmX</p>
      </div>

      {errors.form && (
        <div className="text-red-500 text-sm font-medium text-center bg-red-50 p-3 rounded-md border border-red-200">
          {errors.form}
        </div>
      )}

      <div className="flex items-center flex-col gap-2">
        <div className="w-26 relative aspect-square flex items-center justify-center rounded-full bg-default-secondary">
          <svg width={48} height={48} fill="none" viewBox="0 0 49 49">
            <path
              d="M5.104 24.5C5.104 15.3574 5.104 10.7841 7.94396 7.94415C10.7839 5.10419 15.3552 5.10419 24.4998 5.10419C33.6424 5.10419 38.2158 5.10419 41.0557 7.94415C43.8957 10.7841 43.8957 15.3554 43.8957 24.5C43.8957 33.6426 43.8957 38.2159 41.0557 41.0559C38.2158 43.8959 33.6445 43.8959 24.4998 43.8959C15.3573 43.8959 10.7839 43.8959 7.94396 41.0559C5.104 38.2159 5.104 33.6446 5.104 24.5Z"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.3125 34.7084C20.0737 29.7226 28.8753 29.4878 33.6875 34.7084M29.594 19.3959C29.594 22.2134 27.3073 24.5 24.4837 24.5C23.8127 24.5011 23.1481 24.3699 22.5279 24.1138C21.9077 23.8578 21.344 23.482 20.8692 23.0079C20.3944 22.5339 20.0177 21.9708 19.7606 21.351C19.5036 20.7312 19.3713 20.0668 19.3713 19.3959C19.3713 16.5784 21.658 14.2917 24.4837 14.2917C25.1545 14.2909 25.8189 14.4223 26.4388 14.6785C27.0588 14.9346 27.6222 15.3105 28.0968 15.7845C28.5714 16.2585 28.948 16.8215 29.2048 17.4412C29.4617 18.0608 29.594 18.7251 29.594 19.3959Z"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {avatarPreview && (
            <Image
              className="rounded-full object-cover object-center"
              src={avatarPreview}
              fill
              alt="User avatar"
            />
          )}
        </div>
        <label
          htmlFor="avatar"
          className="outline outline-neutral-default rounded-10 p-1.5 flex items-center gap-2.5 font-medium text-xs cursor-pointer"
        >
          <input
            onChange={handleImageChange}
            type="file"
            name="avatar"
            id="avatar"
            accept="image/*"
            className="hidden"
          />
          <svg width={20} height={20} id="image" fill="none" viewBox="0 0 20 20">
            <path
              d="M2.0835 9.99998C2.0835 6.26831 2.0835 4.40165 3.24266 3.24248C4.40183 2.08331 6.26766 2.08331 10.0002 2.08331C13.7318 2.08331 15.5985 2.08331 16.7577 3.24248C17.9168 4.40165 17.9168 6.26748 17.9168 9.99998C17.9168 13.7316 17.9168 15.5983 16.7577 16.7575C15.5985 17.9166 13.7327 17.9166 10.0002 17.9166C6.2685 17.9166 4.40183 17.9166 3.24266 16.7575C2.0835 15.5983 2.0835 13.7325 2.0835 9.99998Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.75 7.5C14.4404 7.5 15 6.94036 15 6.25C15 5.55964 14.4404 5 13.75 5C13.0596 5 12.5 5.55964 12.5 6.25C12.5 6.94036 13.0596 7.5 13.75 7.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.3333 18.3333C12.8167 16.4792 11.6125 14.8183 9.8975 13.6117C8.0475 12.3108 5.72667 11.6225 3.34667 11.6692C3.06333 11.6686 2.78111 11.6775 2.5 11.6958"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.8335 15C12.251 13.8941 13.7793 13.3275 15.3218 13.3333C16.2156 13.3368 17.099 13.5246 17.9168 13.885"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-default">{avatarPreview ? "Change" : "Add"} Photo</span>
        </label>
      </div>

      <div className="space-y-6">
        <Input
          name="first_name"
          label="Enter your First Name"
          placeholder="First Name"
          error={errors.first_name}
        />
        <Input
          name="last_name"
          label="Enter your Last Name"
          placeholder="Last Name"
          error={errors.last_name}
        />
        <Input
          name="password"
          label="Set a Password"
          placeholder="Password"
          type="password"
          error={errors.password}
        />

        <label
          htmlFor="marketing_opt_in"
          className="flex items-center gap-2.5 font-medium text-xs group cursor-pointer"
        >
          <div className="relative">
            <input
              type="checkbox"
              name="marketing_opt_in"
              id="marketing_opt_in"
              className="peer absolute w-2 h-2 opacity-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
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
          {loading ? "Creating Profile..." : "Continue"}
        </Button>
      </div>
      <TermsPolicyText />
    </form>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <CreateAccountForm />
    </Suspense>
  );
}
