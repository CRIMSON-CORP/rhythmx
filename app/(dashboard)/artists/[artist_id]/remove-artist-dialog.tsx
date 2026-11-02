"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { goeyToast } from "goey-toast";
import { Loader2, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RemoveArtistDialog({ reference }: { reference: string }) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleRemove = async () => {
    try {
      setIsDeleting(true);
      await api.delete(API_ROUTES.LABEL.ARTISTS.ARTIST(reference));
      goeyToast.success("Artist removed successfully");
      setOpen(false);
      router.push("/artists");
    } catch (error) {
      console.error("Failed to remove artist:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="white">
          <Trash2 size={16} />
          <span>Remove Artist</span>
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="max-w-115 w-full p-8 rounded-30 bg-white">
        <div className="flex flex-col gap-6 relative">
          {/* Header */}
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-default font-heading">
              Remove Artist
            </DialogTitle>
            <DialogClose
              disabled={isDeleting}
              className="cursor-pointer text-default hover:opacity-80 disabled:opacity-50"
            >
              <X size={20} />
            </DialogClose>
          </div>

          {/* Body */}
          <DialogDescription className="text-default">
            Are you sure, you want this artist to removed from your record label?
          </DialogDescription>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-4">
            <DialogClose asChild disabled={isDeleting}>
              <Button size="sm" variant="outline" disabled={isDeleting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleRemove}
              disabled={isDeleting}
              className="gap-2"
            >
              {isDeleting && <Loader2 size={16} className="animate-spin" />}
              <span>{isDeleting ? "Removing..." : "Yes, Remove"}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
