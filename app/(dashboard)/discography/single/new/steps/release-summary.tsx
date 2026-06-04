"use client";

import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import useNewReleaseStore from "@/store/new-release-store";
import Image from "next/image";
import { useMemo, useState } from "react";
import { goeyToast } from "goey-toast";
import { XpressDialog } from "./release-date";
import { useRouter } from "next/navigation";

const SpotifyLogo = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 42 42"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="42" height="42" rx="20" fill="black" />
    <g clipPath="url(#clip0_2513_10151)">
      <path
        d="M21 7.875C13.7513 7.875 7.875 13.7514 7.875 21C7.875 28.2491 13.7514 34.125 21 34.125C28.2492 34.125 34.125 28.2491 34.125 21C34.125 13.7519 28.2492 7.87572 20.9998 7.87572L21 7.875ZM27.0189 26.8051C26.7838 27.1907 26.2791 27.3129 25.8936 27.0763C22.812 25.194 18.9327 24.7676 14.3641 25.8114C14.1525 25.8596 13.9305 25.8218 13.7468 25.7063C13.5631 25.5908 13.4329 25.407 13.3846 25.1955C13.3606 25.0908 13.3575 24.9823 13.3754 24.8764C13.3933 24.7705 13.432 24.6691 13.4891 24.5781C13.5463 24.4872 13.6208 24.4083 13.7084 24.3462C13.7961 24.284 13.8951 24.2398 13.9999 24.2159C18.9997 23.0736 23.2882 23.5654 26.7478 25.6798C27.1334 25.9164 27.2556 26.4196 27.0189 26.8051ZM28.6254 23.2314C28.3291 23.7128 27.6991 23.8648 27.218 23.5686C23.69 21.4001 18.3121 20.7721 14.1393 22.0387C13.5981 22.2022 13.0266 21.8972 12.8623 21.3569C12.6993 20.8157 13.0044 20.2452 13.5447 20.0807C18.3112 18.6343 24.237 19.335 28.2885 21.8246C28.7696 22.121 28.9217 22.7509 28.6254 23.2314ZM28.7633 19.5099C24.5332 16.9973 17.5541 16.7662 13.5154 17.9921C12.8668 18.1888 12.1809 17.8226 11.9845 17.1741C11.7879 16.5252 12.1536 15.8398 12.8027 15.6426C17.4388 14.2352 25.1461 14.5072 30.0162 17.3984C30.6008 17.7446 30.792 18.498 30.4456 19.0806C30.1009 19.664 29.3453 19.8563 28.764 19.5099H28.7633Z"
        fill="#1ED760"
      />
    </g>
    <defs>
      <clipPath id="clip0_2513_10151">
        <rect width="26.25" height="26.25" fill="white" transform="translate(7.875 7.875)" />
      </clipPath>
    </defs>
  </svg>
);

interface SubmitDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  xpressRelease: boolean;
  onSubmit: () => void;
}

function SubmitDialog({ isOpen, onOpenChange, xpressRelease, onSubmit }: SubmitDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-115 w-full p-8 rounded-30 bg-white">
        <div className="flex flex-col gap-6 relative">
          {/* Header */}
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-default font-heading">
              Submit Release?
            </DialogTitle>
            <DialogClose className="cursor-pointer text-default hover:opacity-80">
              <Icon name="cancel" size={20} />
            </DialogClose>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-4 text-default font-medium leading-relaxed">
            <DialogDescription className="text-default">
              Are you sure, you want this to be submit this release?
            </DialogDescription>
            <DialogDescription className="text-default">
              Please kindly review your release informations before clicking &quot;
              {xpressRelease ? "Pay & Submit" : "Submit"}&quot;
            </DialogDescription>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-[#0066FF] hover:underline w-fit font-semibold"
            >
              Learn More about our Release Policy
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-4">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="w-fit rounded-xl px-5 py-2.5 text-sm font-semibold border-default-default/10 text-default hover:bg-page-background cursor-pointer"
              >
                Cancel, and review
              </Button>
            </DialogClose>
            <Button
              onClick={onSubmit}
              className="w-fit rounded-xl px-5 py-2.5 text-sm font-semibold bg-[#E52E2E] hover:bg-[#E52E2E]/90 text-white border-0 cursor-pointer"
            >
              {xpressRelease ? "Pay & Submit" : "Submit Release"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ReleaseSummary() {
  const router = useRouter();
  const { form, setForm, setStep } = useNewReleaseStore();
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

  const mainArtistName = form.main_artists?.[0]?.name || "Main Artist";

  const formattedReleaseDate = useMemo(() => {
    if (!form.release_date) return "—";
    const date = new Date(form.release_date);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  }, [form.release_date]);

  const formattedTime = useMemo(() => {
    const time = form.release_time || "09:41 AM";
    return time.replace(/^0/, "").replace(/\s+/g, "");
  }, [form.release_time]);

  const handleSubmit = () => {
    setIsSubmitDialogOpen(true);
  };

  const handleFinalSubmit = () => {
    setIsSubmitDialogOpen(false);

    // TODO: Add Payment Integration (e.g. Stripe checkout or platform credit processing)
    // if (form.xpress_release) {
    //   await processPayment({ amount: 15.00 });
    // }

    // TODO: Submitting the form data to backend API (e.g. POST /api/releases)
    // await createRelease(form);

    goeyToast.success("Release Published", {
      description: "Your release has been successfully submitted for distribution!",
      duration: 2000,
    });

    router.push("/submit-succces");
  };

  return (
    <div className="mx-auto max-w-245 flex flex-col gap-6 pb-10">
      {/* 1. Release Details Card */}
      <div className="bg-white rounded-30 p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-default-default/10 pb-4">
          <h3 className="text-xl font-medium font-heading text-default">Release Details</h3>
          <button
            onClick={() => setStep(0)}
            className="text-brand-orange hover:underline font-medium text-xs flex items-center gap-1 cursor-pointer"
          >
            <span>Edit</span>
            <Icon name="arrow-up-right" size={14} className="text-brand-orange" />
          </button>
        </div>

        <div className="grid grid-cols-[1.5fr_3.5fr] gap-y-5">
          {/* Row 1: Release Title */}
          <div className="grid grid-cols-subgrid col-span-2 border-b border-default-default/10 pb-4 last:border-b-0 last:pb-0">
            <span className="text-xs text-border-default-secondary font-medium self-center">
              Release Title
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-default">
                {form.release_title || "—"}
              </span>
              <span className="text-[11px] text-border-default-secondary font-medium">Single</span>
            </div>
          </div>

          {/* Row 3: Genre */}
          <div className="grid grid-cols-subgrid col-span-2 border-b border-default-default/10 pb-4 last:border-b-0 last:pb-0">
            <span className="text-xs text-border-default-secondary font-medium self-center">
              Genre
            </span>
            <span className="text-sm font-semibold text-default self-center">
              {form.primary_genre
                ? `${form.primary_genre}${form.secondary_genre ? `, ${form.secondary_genre}` : ""}`
                : "—"}
            </span>
          </div>

          {/* Row 4: Version Title */}
          <div className="grid grid-cols-subgrid col-span-2 border-b border-default-default/10 pb-4 last:border-b-0 last:pb-0">
            <span className="text-xs text-border-default-secondary font-medium self-center">
              Version Title
            </span>
            <span className="text-sm font-semibold text-default self-center">
              {form.version_title || "—"}
            </span>
          </div>

          {/* Row 5: Version Date */}
          <div className="grid grid-cols-subgrid col-span-2 border-b border-default-default/10 pb-4 last:border-b-0 last:pb-0">
            <span className="text-xs text-border-default-secondary font-medium self-center">
              Release Date
            </span>
            <span className="text-sm font-semibold text-default self-center">
              {form.original_release_date || "—"}
            </span>
          </div>

          {/* Row 6: Producer(s) */}
          <div className="grid grid-cols-subgrid col-span-2 border-b border-default-default/10 pb-4 last:border-b-0 last:pb-0">
            <span className="text-xs text-border-default-secondary font-medium self-center">
              Producer(s)
            </span>
            <span className="text-sm font-semibold text-default self-center">
              {form.producers || "—"}
            </span>
          </div>

          {/* Row 7: Copyright Holder */}
          <div className="grid grid-cols-subgrid col-span-2 border-b border-default-default/10 pb-4 last:border-b-0 last:pb-0">
            <span className="text-xs text-border-default-secondary font-medium self-center">
              Copyright Holder
            </span>
            <span className="text-sm font-semibold text-default self-center">
              {form.copyright_holder || "—"}
            </span>
          </div>

          {/* Row 8: Copyright Year */}
          <div className="grid grid-cols-subgrid col-span-2 border-b border-default-default/10 pb-4 last:border-b-0 last:pb-0">
            <span className="text-xs text-border-default-secondary font-medium self-center">
              Copyright Year
            </span>
            <span className="text-sm font-semibold text-default self-center">
              {form.copyright_year || "—"}
            </span>
          </div>

          {/* Row 9: Release Language */}
          <div className="grid grid-cols-subgrid col-span-2 border-b border-default-default/10 pb-4 last:border-b-0 last:pb-0">
            <span className="text-xs text-border-default-secondary font-medium self-center">
              Release Language
            </span>
            <span className="text-sm font-semibold text-default self-center">
              {form.language || "—"}
            </span>
          </div>

          {/* Row 10: 13 digits BarCode (UPC/EAN) */}
          <div className="grid grid-cols-subgrid col-span-2 pb-0">
            <span className="text-xs text-border-default-secondary font-medium self-center">
              13 digits BarCode (UPC/EAN)
            </span>
            <span className="text-sm font-semibold text-default self-center">
              {form.barcode || "—"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Artists & Credits Card */}
      <div className="bg-white rounded-30 p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-default-default/10 pb-4">
          <h3 className="text-xl font-medium font-heading text-default">Artists & Credits</h3>
          <button
            onClick={() => setStep(1)}
            className="text-brand-orange hover:underline font-medium text-xs flex items-center gap-1 cursor-pointer"
          >
            <span>Edit</span>
            <Icon name="arrow-up-right" size={14} className="text-brand-orange" />
          </button>
        </div>

        {/* Main Artists */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-border-default-secondary uppercase tracking-wider">
              Main Artists
            </span>
            <span className="text-xs text-border-default-secondary font-medium">
              {form.main_artists?.length || 0} Added
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {(form.main_artists || []).length === 0 ? (
              <span className="text-xs text-border-default-secondary italic">
                No main artists added.
              </span>
            ) : (
              form.main_artists.map((artist) => (
                <div
                  key={artist.id}
                  className="flex items-center justify-between bg-page-background/50 rounded-20 p-4"
                >
                  <div className="flex items-center gap-3">
                    {artist.image ? (
                      <Image
                        src={artist.image}
                        alt={artist.name}
                        width={40}
                        height={40}
                        className="size-10 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="size-10 rounded-full bg-brand-purple/10 flex items-center justify-center shrink-0">
                        <Icon name="user-sharing" className="text-brand-purple" size={20} />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-default">{artist.name}</span>
                      <span className="text-xs text-border-default-secondary">
                        {artist.location || "Main Artist"}
                      </span>
                    </div>
                  </div>
                  <SpotifyLogo className="size-6 shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Feature Artists */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-border-default-secondary uppercase tracking-wider">
              Feature Artists
            </span>
            <span className="text-xs text-border-default-secondary font-medium">
              {form.featured_artists?.length || 0} Added
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {(form.featured_artists || []).length === 0 ? (
              <span className="text-xs text-border-default-secondary italic">
                No featured artists added.
              </span>
            ) : (
              form.featured_artists.map((artist) => (
                <div
                  key={artist.id}
                  className="flex items-center justify-between bg-page-background/50 rounded-20 p-4"
                >
                  <div className="flex items-center gap-3">
                    {artist.image ? (
                      <Image
                        src={artist.image}
                        alt={artist.name}
                        width={40}
                        height={40}
                        className="size-10 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="size-10 rounded-full bg-brand-purple/10 flex items-center justify-center shrink-0">
                        <Icon name="user-sharing" className="text-brand-purple" size={20} />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-default">{artist.name}</span>
                      <span className="text-xs text-border-default-secondary">
                        {artist.location || "Featured Artist"}
                      </span>
                    </div>
                  </div>
                  <SpotifyLogo className="size-6 shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Producer & Engineer Credit */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-border-default-secondary uppercase tracking-wider">
              Producers & Engineer Credit
            </span>
            <span className="text-xs text-border-default-secondary font-medium">
              {form.producer_credits?.length || 0} Added
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {(form.producer_credits || []).length === 0 ? (
              <span className="text-xs text-border-default-secondary italic">
                No producer/engineer credits added.
              </span>
            ) : (
              form.producer_credits.map((artist) => (
                <div
                  key={artist.id}
                  className="flex items-center gap-3 bg-page-background/50 rounded-20 p-4"
                >
                  {artist.image ? (
                    <Image
                      src={artist.image}
                      alt={artist.name}
                      width={40}
                      height={40}
                      className="size-10 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="size-10 rounded-full bg-brand-purple/10 flex items-center justify-center shrink-0">
                      <Icon name="user-sharing" className="text-brand-purple" size={20} />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium text-sm text-default">{artist.name}</span>
                    <span className="text-xs text-border-default-secondary">Producer/Engineer</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 3. Release Artwork Card */}
      <div className="bg-white rounded-30 p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-default-default/10 pb-4">
          <h3 className="text-xl font-medium font-heading text-default">Release Artwork</h3>
          <button
            onClick={() => setStep(0)}
            className="text-brand-orange hover:underline font-medium text-xs flex items-center gap-1 cursor-pointer"
          >
            <span>Edit</span>
            <Icon name="arrow-up-right" size={14} className="text-brand-orange" />
          </button>
        </div>

        <div className="flex items-center gap-4 bg-page-background/50 rounded-20 p-4">
          <Image
            src={form.artwork_url || "/images/release-2.png"}
            width={56}
            height={56}
            alt="Release Artwork Preview"
            className="rounded-xl object-cover size-14 shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm text-default truncate">
              {form.artwork?.name || "artwork.png"}
            </span>
            <span className="text-xs text-border-default-secondary font-medium mt-0.5">
              Uploaded
            </span>
          </div>
        </div>
      </div>

      {/* 4. Release Tracks Card */}
      <div className="bg-white rounded-30 p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-default-default/10 pb-4">
          <h3 className="text-xl font-medium font-heading text-default">Release Tracks</h3>
          <button
            onClick={() => setStep(2)}
            className="text-brand-orange hover:underline font-medium text-xs flex items-center gap-1 cursor-pointer"
          >
            <span>Edit</span>
            <Icon name="arrow-up-right" size={14} className="text-brand-orange" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {(form.tracks || []).length === 0 ? (
            <span className="text-xs text-border-default-secondary italic p-4 text-center">
              No tracks uploaded yet.
            </span>
          ) : (
            form.tracks.map((track, index) => (
              <div
                key={track.id}
                className="flex items-center justify-between bg-page-background/50 rounded-20 p-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-8 rounded-full bg-page-background flex items-center justify-center text-xs font-semibold text-default shrink-0">
                    {index + 1}
                  </div>
                  <div className="size-9 rounded-full bg-brand-purple/12 flex items-center justify-center shrink-0">
                    <Icon name="music" className="text-brand-purple" size={18} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-sm text-default truncate">
                      {track.track_title}
                    </span>
                    <span className="text-xs text-border-default-secondary mt-0.5 truncate">
                      {track.track_file?.name || `${track.track_title}.mp3`}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-[#009951] font-semibold bg-[#EBFFEE] rounded-full px-3 py-1 shrink-0">
                  Uploaded
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 5. Release Platforms Card */}
      <div className="bg-white rounded-30 p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-default-default/10 pb-4">
          <h3 className="text-xl font-medium font-heading text-default">Release Platforms</h3>
          <button
            onClick={() => setStep(3)}
            className="text-brand-orange hover:underline font-medium text-xs flex items-center gap-1 cursor-pointer"
          >
            <span>Edit</span>
            <Icon name="arrow-up-right" size={14} className="text-brand-orange" />
          </button>
        </div>

        <div className="flex flex-wrap gap-4">
          {(form.platforms || []).length === 0 ? (
            <span className="text-xs text-border-default-secondary italic p-4">
              No platforms selected.
            </span>
          ) : (
            form.platforms.map((platform) => (
              <div
                key={platform}
                className="bg-page-background/50 rounded-20 px-6 py-4 flex items-center gap-3 shrink-0"
              >
                {platform.toLowerCase() === "spotify" ? (
                  <>
                    <SpotifyLogo className="size-6" />
                    <span className="text-sm font-semibold text-default">Spotify</span>
                  </>
                ) : platform.toLowerCase() === "apple" ? (
                  <>
                    <span className="size-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                      A
                    </span>
                    <span className="text-sm font-semibold text-default">Apple Music</span>
                  </>
                ) : platform.toLowerCase() === "tidal" ? (
                  <>
                    <span className="size-6 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                      T
                    </span>
                    <span className="text-sm font-semibold text-default">Tidal</span>
                  </>
                ) : (
                  <>
                    <span className="size-6 bg-brand-purple/20 rounded-full flex items-center justify-center text-brand-purple text-xs font-bold shrink-0">
                      P
                    </span>
                    <span className="text-sm font-semibold text-default capitalize">
                      {platform}
                    </span>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 6. Split Pay Card */}
      <div className="bg-white rounded-30 p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-default-default/10 pb-4">
          <h3 className="text-xl font-medium font-heading text-default">Split Pay</h3>
          <button
            onClick={() => setStep(4)}
            className="text-brand-orange hover:underline font-medium text-xs flex items-center gap-1 cursor-pointer"
          >
            <span>Edit</span>
            <Icon name="arrow-up-right" size={14} className="text-brand-orange" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {form.own_full_royalty ? (
            <div className="bg-page-background/50 rounded-20 p-4 flex items-center gap-3">
              <div className="size-9 rounded-full bg-brand-purple/12 flex items-center justify-center shrink-0">
                <Icon name="dollar" className="text-brand-purple" size={18} />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-default">Own Full Royalty Enabled</span>
                <span className="text-xs text-border-default-secondary mt-0.5">
                  100% of royalties belong to the owner
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {(form.tracks || []).map((track) => {
                const collaborators = track.royalty_splits || [];
                const totalCollabPercent = collaborators.reduce((sum, c) => sum + c.percentage, 0);
                const remainingPercent = 100 - totalCollabPercent;

                return (
                  <div
                    key={track.id}
                    className="border border-default-default/10 rounded-20 p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between border-b border-default-default/5 pb-2">
                      <span className="text-sm font-semibold text-default truncate">
                        {track.track_title}
                      </span>
                      <span className="text-xs text-border-default-secondary font-medium">
                        Royalty Split
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {/* Main Artist Split */}
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-default">{mainArtistName} (Main Artist)</span>
                        <span className="text-[#009951]">{remainingPercent}%</span>
                      </div>
                      {/* Collaborator Splits */}
                      {collaborators.map((collab, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <span className="text-border-default-secondary font-medium">
                            {collab.name}
                          </span>
                          <span className="text-[#009951] font-semibold">{collab.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 7. Release Date Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-semibold text-[#767680]">Release Date</span>
          <button
            onClick={() => setStep(5)}
            className="text-brand-orange hover:underline font-semibold text-xs flex items-center gap-1 cursor-pointer"
          >
            <span>Edit</span>
            <Icon name="arrow-up-right" size={14} className="text-brand-orange" />
          </button>
        </div>

        <div className="bg-white rounded-[24px] p-6 flex flex-col gap-5">
          {/* Row 1: Calendar icon and Date-Time */}
          <div className="flex items-center gap-3">
            <Icon name="calendar-2" size={20} className="text-default shrink-0" />
            <span className="font-semibold text-default text-base">
              {formattedReleaseDate} {formattedTime}
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-default-default/10 w-full" />

          {/* Row 2: Use Express Release Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs font-semibold text-[#767680]">
              <span>Use Express release</span>
              <XpressDialog xpressRelease={form.xpress_release ?? false} />
            </div>
            <Switch
              checked={form.xpress_release ?? false}
              onCheckedChange={(checked) => setForm({ xpress_release: checked })}
            />
          </div>
        </div>
      </div>

      {/* Footer Submit Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-4 p-8 bg-white rounded-30">
        <p className="font-medium text-default text-sm">
          Do review your release details before clicking &quot;
          {form.xpress_release ? "Pay & Submit" : "Submit"}&quot;
        </p>
        <Button variant="orange" onClick={handleSubmit} className="w-fit cursor-pointer">
          <span>{form.xpress_release ? "Pay & Submit" : "Submit"}</span>
          <Icon name="arrow-right" size={16} />
        </Button>
      </div>

      <SubmitDialog
        isOpen={isSubmitDialogOpen}
        onOpenChange={setIsSubmitDialogOpen}
        xpressRelease={form.xpress_release ?? false}
        onSubmit={handleFinalSubmit}
      />
    </div>
  );
}

export default ReleaseSummary;
