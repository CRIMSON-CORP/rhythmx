import Form from "./form";
import Link from "next/link";
import { Lock } from "lucide-react";
import ImageUpload from "./image-upload";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";

export default async function AccountForm() {
  const { user } = await api.get<{ user: User }>(API_ROUTES.USER.ME);
  return (
    <div className="flex flex-col">
      {/* Profile Details Header */}
      <ImageUpload image={user.avatar_url} />

      {/* Input Fields */}
      <Form
        dob={user.dob}
        email={user.email}
        first_name={user.first_name}
        gender={user.gender}
        last_name={user.last_name}
        phone={user.phone}
      />
      {/* Update Password Action Card */}
      <footer className="px-4 py-4 md:px-6 mt-2 bg-page-background">
        <Link
          href="/settings/security-privacy"
          className="w-full bg-white text-default hover:bg-default hover:text-white transition-colors duration-300 flex gap-3 p-3 rounded-20 text-left"
        >
          <Lock size={20} />
          <div className="flex flex-col">
            <span className="font-medium leading-tight">Update Password</span>
            <span className="text-xs font-medium text-default-tertiary leading-tight">
              Secure your account if you feel your password has been compromised
            </span>
          </div>
        </Link>
      </footer>
    </div>
  );
}
