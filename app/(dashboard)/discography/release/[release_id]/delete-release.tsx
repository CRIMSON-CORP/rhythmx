"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { CONSTANTS } from "@/lib/constants";
import { goeyToast } from "goey-toast";
import { Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function DeleteDialog({
  release_id,
  release_status,
  isOpen,
  onOpenChange,
}: {
  release_id: string;
  release_status: ReleaseStatus;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const isDraft = release_status === "draft";
  const [isLoding, setIsLoding] = useState(false);
  const [reason, setReason] = useState("");
  const router = useRouter();
  const removeReleaseAction = async () => {
    try {
      setIsLoding(true);
      if (!reason) {
        goeyToast.error(
          `Please enter a reason for ${isDraft ? "deleting the release" : "taking down the release"}`,
        );
        return;
      }
      if (isDraft) {
        await api.delete(API_ROUTES.RELEASES.DRAFT.DRAFT(release_id), {
          reason,
        });
      } else {
        await api.post(API_ROUTES.RELEASES.TAKEDOWN(release_id), {
          reason,
        });
      }
      router.back();
    } catch (error) {
      throw error;
    } finally {
      setIsLoding(false);
      goeyToast.dismiss(CONSTANTS.GLOBAL_ERROR_TOAST_ID);
    }
  };
  const removeRelease = async () => {
    goeyToast.promise(removeReleaseAction(), {
      loading: `Removing release...`,
      success: "Release removed successfully",
      error: (error: unknown) =>
        (error as Error).message || (error as Record<string, string>).reason,
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-115 w-full p-8 rounded-30 bg-white">
        <div className="flex flex-col gap-6 relative">
          {/* Header */}
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-default font-heading">
              Delete Release?
            </DialogTitle>
            <DialogClose className="cursor-pointer text-default hover:opacity-80">
              <X size={20} />
            </DialogClose>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-4 text-default font-medium leading-relaxed">
            <DialogDescription className="text-default">
              Are you sure, you want this to be deleted?
            </DialogDescription>
            <label htmlFor="reason" className="text-default">
              Reason for taking down the release
            </label>
            <textarea
              id="reason"
              className="border border-default-default/50 rounded-xl px-5 py-2.5 text-sm font-semibold text-default hover:bg-page-background cursor-pointer"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-4">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="w-fit rounded-xl px-5 py-2.5 text-sm font-semibold border-default-default/10 text-default hover:bg-page-background cursor-pointer"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={isLoding}
              onClick={removeRelease}
              className="w-fit rounded-xl px-5 py-2.5 text-sm font-semibold bg-[#E52E2E] hover:bg-[#E52E2E]/90 text-white border-0 cursor-pointer"
            >
              Yes, Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DeleteRelease({
  release_id,
  release_status,
}: {
  release_id: string;
  release_status: ReleaseStatus;
}) {
  const [deleteDialogOpen, setdeleteDialogOpen] = useState(false);

  const handleClick = () => {
    setdeleteDialogOpen(true);
  };
  return (
    <>
      <Button variant="white" onClick={handleClick}>
        <Trash2 size={16} />
        <span>{release_status === "draft" ? "Delete Draft" : "Take Down Release"}</span>
      </Button>
      <DeleteDialog
        release_id={release_id}
        release_status={release_status}
        isOpen={deleteDialogOpen}
        onOpenChange={setdeleteDialogOpen}
      />
    </>
  );
}

export default DeleteRelease;
