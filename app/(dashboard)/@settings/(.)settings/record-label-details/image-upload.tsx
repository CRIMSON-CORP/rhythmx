"use client";

import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { goeyToast } from "goey-toast";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Icon from "@/components/icon";

interface LogoUploadProps {
  logoUrl?: string | null;
  name: string;
  isVerified?: boolean;
}

function LogoUpload({ logoUrl: initialLogo, name, isVerified }: LogoUploadProps) {
  const router = useRouter();
  const [logoUrl, setLogoUrl] = useState(initialLogo || "");
  const [isUploading, setIsUploading] = useState(false);

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 2 * 1024 * 1024) {
        goeyToast.error("Image size must be less than 2MB");
        return;
      }

      const formData = new FormData();
      formData.append("logo", file);
      setLogoUrl(URL.createObjectURL(file));
      setIsUploading(true);

      try {
        const response = await api.post<{
          status: boolean;
          message: string;
          data: { logo: string; logo_url: string };
        }>(API_ROUTES.LABEL.LOGO, formData);

        if (response.data?.logo_url) {
          setLogoUrl(response.data.logo_url);
        }
        goeyToast.success("Label logo updated successfully");
        router.refresh();
      } catch (error: unknown) {
        console.error("Logo upload failed:", error);
        const errObj = error as { message?: string };
        goeyToast.error("Failed to update label logo", {
          description: errObj?.message || "Please try again.",
        });
      } finally {
        setIsUploading(false);
      }
    }
  }

  return (
    <div className="flex items-center gap-5 border-b border-b-default-default px-4 py-5 md:px-6 md:py-7.5">
      <label className="relative size-19.25 overflow-hidden rounded-full cursor-pointer group">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={name || "Label Logo"}
            width={77}
            height={77}
            className="rounded-full w-full h-full bg-[#C7FFB3] object-cover object-center"
          />
        ) : (
          <div className="rounded-full w-full h-full bg-[#C7FFB3] flex items-center justify-center text-default font-bold text-xl">
            {name?.[0]?.toUpperCase() || "L"}
          </div>
        )}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          name="logo"
          id="label-logo"
          disabled={isUploading}
          onChange={handleImageUpload}
        />
        <span className="absolute text-white inset-0 flex justify-center items-center bg-black/20 group-hover:bg-black/40 transition-colors">
          <Plus size={24} />
        </span>
      </label>
      <div className="flex flex-col gap-1.5">
        <span className="text-xl text-default">{name}</span>
        {isVerified ? (
          <div className="flex items-center gap-2 bg-[#CFF7D3] text-positive-secondary rounded-full p-2 w-fit">
            <span className="leading-none">Verified</span>
            <Icon name="seal-check" size={16} />
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-red-200 text-red-600 rounded-full p-2 w-fit">
            <span className="leading-none">Not Verified</span>
            <Icon name="seal-check" size={16} />
          </div>
        )}
      </div>
    </div>
  );
}

export default LogoUpload;
