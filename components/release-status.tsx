"use client";

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
import Releases from "@/app/(dashboard)/discography/releases";
import { CheckCircle } from "lucide-react";
import { VisuallyHidden } from "radix-ui";
import { Button } from "./ui/button";

interface ReleaseStatusProps {
  counts?: ReleaseStatusCounts;
}

function ReleaseStatus({ counts }: ReleaseStatusProps) {
  const approvedCount = counts?.approved ?? 0;
  const pendingCount = counts?.pending_review ?? 0;
  const rejectedCount = counts?.rejected ?? 0;

  if (approvedCount === 0 && pendingCount === 0 && rejectedCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
      {approvedCount > 0 && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="white">
              <CheckCircle size={16} />
              <span>Approved Release ({approvedCount})</span>
            </Button>
          </DialogTrigger>
          <DialogContent
            className="overflow-hidden rounded-30 isolate gap-0 max-w-204.25"
            showCloseButton={false}
          >
            <VisuallyHidden.Root>
              <DialogTitle>Approved releases Popup</DialogTitle>
              <DialogDescription>Approved Releases Popup</DialogDescription>
            </VisuallyHidden.Root>
            <div className="absolute w-full top-0 right-0 h-64 bg-linear-to-r from-[#14AE5C] to-[#FFC107] -z-10 opacity-25 blur-3xl"></div>
            <Releases title="Approved Releases" status="approved" type="approved" />
          </DialogContent>
        </Dialog>
      )}

      {pendingCount > 0 && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="white">
              <CheckCircle size={16} />
              <span>Pending Release ({pendingCount})</span>
            </Button>
          </DialogTrigger>
          <DialogContent
            className="overflow-hidden rounded-30 isolate gap-0 max-w-204.25"
            showCloseButton={false}
          >
            <VisuallyHidden.Root>
              <DialogTitle>Pending releases Popup</DialogTitle>
              <DialogDescription>Pending Releases Popup</DialogDescription>
            </VisuallyHidden.Root>
            <div className="absolute w-full top-0 right-0 h-64 bg-linear-to-r from-[#FF7247] to-[#FFC107] -z-10 opacity-25 blur-3xl"></div>
            <Releases title="Pending Releases" status="pending_review" type="pending" />
          </DialogContent>
        </Dialog>
      )}

      {rejectedCount > 0 && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="white">
              <CheckCircle size={16} />
              <span>Rejected Release ({rejectedCount})</span>
            </Button>
          </DialogTrigger>
          <DialogContent
            className="overflow-hidden rounded-30 isolate gap-0 max-w-204.25"
            showCloseButton={false}
          >
            <VisuallyHidden.Root>
              <DialogTitle>Rejected releases Popup</DialogTitle>
              <DialogDescription>Rejected Releases Popup</DialogDescription>
            </VisuallyHidden.Root>
            <div className="absolute w-full top-0 right-0 h-64 bg-linear-to-r from-[#FF7247] to-[#EC221F] -z-10 opacity-25 blur-3xl"></div>
            <Releases title="Rejected Releases" status="rejected" type="rejected" />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default ReleaseStatus;
