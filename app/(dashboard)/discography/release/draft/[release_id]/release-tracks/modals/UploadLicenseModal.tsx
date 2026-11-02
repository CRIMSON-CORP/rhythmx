"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "radix-ui";
import { X, Loader2, Folder } from "lucide-react";
import { goeyToast } from "goey-toast";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { Button } from "@/components/ui/button";

interface UploadLicenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  releaseReference: string;
  trackReference: string;
  onUploadSuccess: (licenseUrl: string, fileName: string) => void;
}

export function UploadLicenseModal({
  open,
  onOpenChange,
  releaseReference,
  trackReference,
  onUploadSuccess,
}: UploadLicenseModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setIsUploading(false);
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileProcess = async (file: File) => {
    // Validate file type: REQUIRED - PDF, DOC, DOCX or TXT (max 10 MB)
    const validExtensions = [".pdf", ".doc", ".docx", ".txt"];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
      goeyToast.error("Invalid File Type", {
        description: "Please upload a PDF, DOC, DOCX, or TXT licensing document.",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      goeyToast.error("File Too Large", {
        description: "Licensing document cannot exceed 10MB.",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      // Form data with 'license' field that contains the file
      formData.append("license", file);

      const endpoint = API_ROUTES.RELEASES.DRAFT.TRACKS.LICENSE(releaseReference, trackReference);
      const res = await api.post<{
        status?: boolean;
        message?: string;
        data?: {
          license_url?: string;
          url?: string;
          track?: { license_url?: string };
        };
        license_url?: string;
        url?: string;
        track?: { license_url?: string };
      }>(endpoint, formData);

      const url =
        res?.data?.license_url ||
        res?.data?.url ||
        res?.data?.track?.license_url ||
        res?.license_url ||
        res?.url ||
        res?.track?.license_url ||
        `https://storage.rhythmx.com/licenses/${file.name}`;

      // Once file is uploaded, close immediately & check checkbox
      onUploadSuccess(url, file.name);
      resetState();
      onOpenChange(false);
      goeyToast.success("Licensing document uploaded");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Failed to upload licensing document. Please try again.";
      goeyToast.error("Upload Failed", { description: message });
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isUploading && e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetState();
        onOpenChange(isOpen);
      }}
    >
      <DialogContent
        className="max-w-140 rounded-30 p-0 overflow-hidden isolate gap-0 border border-default-default/20 shadow-2xl"
        showCloseButton={false}
      >
        <VisuallyHidden.Root>
          <DialogHeader>
            <DialogTitle>Upload Licensing Document</DialogTitle>
            <DialogDescription>Attach your licensing document to this track</DialogDescription>
          </DialogHeader>
        </VisuallyHidden.Root>

        {/* Top glow */}
        <div className="absolute w-full top-0 left-0 right-0 h-28 bg-linear-to-r from-[#9747FF] to-[#FFC107] -z-10 opacity-20 blur-3xl pointer-events-none" />

        {/* Header */}
        <header className="px-6 py-5 flex items-center justify-between border-b border-default-default/10">
          <span className="text-sm font-medium">Upload Licensing Document</span>
          <DialogClose className="p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer">
            <X size={20} className="text-default" />
          </DialogClose>
        </header>

        <div className="p-6 flex flex-col gap-4">
          <div className="relative rounded-30 p-16 flex flex-col items-center justify-center gap-4 bg-white">
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-20 rounded-2xl">
                <Loader2 size={24} className="animate-spin text-brand-orange" />
                <span className="text-xs font-semibold text-default">Uploading document...</span>
              </div>
            )}

            {/* 3D Folder Icon from public/images/document.png */}
            <div className="flex items-center gap-8">
              <Image
                src="/images/document.png"
                alt="Upload Document"
                width={50}
                height={40}
                className="object-contain"
                priority
              />

              <div className="flex flex-col items-center gap-1 text-center">
                <p className="font-semibold text-lg text-default">Drag file here</p>
                <p className="text-border-default-secondary font-medium">.pdf, .doc, .text</p>
              </div>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleInputChange}
              className="hidden"
            />

            {/* Browse Files Button */}
            <Button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              <span>Browse Files</span>
              <Folder size={16} />
            </Button>
          </div>

          {/* Done Button (from design) */}
          <div className="flex justify-center">
            <Button
              type="button"
              rounded={10}
              disabled={isUploading}
              onClick={() => onOpenChange(false)}
              className="w-full max-w-60 "
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UploadLicenseModal;
