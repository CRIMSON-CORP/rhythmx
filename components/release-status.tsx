"use client";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
import Releases from "@/app/(dashboard)/discography/releases";
import { CheckCircle } from "lucide-react";
import { VisuallyHidden } from "radix-ui";
import { Button } from "./ui/button";

const DUMMY_RELEASES: ReleaseResult[] = [
  {
    id: "1",
    title: "Standing B4 Him",
    type: "Single",
    platforms: "Apple Music. Spotify. Deezer",
    image: "/images/release-1.png",
  },
  {
    id: "2",
    title: "Dancing in the Rain",
    type: "Duet",
    platforms: "Amazon Music. YouTube Music. Tidal",
    image: "/images/release-2.png",
  },
  {
    id: "3",
    title: "Lost in the Echo",
    type: "Cover",
    platforms: "SoundCloud. Pandora. iHeartRadio",
    image: "/images/release-3.png",
  },
];
function ReleaseStatus() {
  return (
    <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="white">
            <CheckCircle size={16} />
            <span>Approved Release (3)</span>
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
          <Releases title="Approved Release" releases={DUMMY_RELEASES} />
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="white">
            <CheckCircle size={16} />
            <span>Pending Release (3)</span>
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
          <Releases title="Pending Release" releases={DUMMY_RELEASES} type="pending" />
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="white">
            <CheckCircle size={16} />
            <span>Rejected Release (3)</span>
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
          <Releases title="Rejected Release" releases={DUMMY_RELEASES} type="rejected" />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ReleaseStatus;
