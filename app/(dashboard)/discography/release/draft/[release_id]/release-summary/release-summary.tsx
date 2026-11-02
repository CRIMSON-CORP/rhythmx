"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUpRight, Calendar, Music, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { goeyToast } from "goey-toast";
import { calculateReadingDuration } from "@/lib/utils";

function formatDateOnly(dateStr?: string | null): string {
  if (!dateStr) return "—";
  const parts = dateStr.split("-").map(Number);
  if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
    return dateStr;
  }
  const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = dateObj.toLocaleDateString("en-US", { month: "long" });
  const year = dateObj.getFullYear();
  return `${day} ${month}, ${year}`;
}

function formatDateTime(dateStr?: string | null, timeStr?: string | null): string {
  if (!dateStr) return "—";
  const parts = dateStr.split("-").map(Number);
  if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
    return dateStr;
  }
  const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = dateObj.toLocaleDateString("en-US", { month: "long" });
  const year = dateObj.getFullYear();
  const datePart = `${day} ${month}, ${year}`;

  if (!timeStr) return datePart;

  const [hStr, mStr] = timeStr.split(":");
  let hour = parseInt(hStr, 10);
  const minute = mStr || "00";
  if (isNaN(hour)) return `${datePart} ${timeStr}`;
  const period = hour >= 12 ? "PM" : "AM";
  if (hour > 12) hour -= 12;
  else if (hour === 0) hour = 12;
  const timePart = `${hour}:${minute}${period}`;

  return `${datePart} ${timePart}`;
}

interface SubmitDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isFastTrack: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
}

function SubmitDialog({
  isOpen,
  onOpenChange,
  isFastTrack,
  isSubmitting,
  onSubmit,
}: SubmitDialogProps) {
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
              <X size={20} />
            </DialogClose>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-4 text-default font-medium leading-relaxed">
            <DialogDescription className="text-default">
              Are you sure you want to submit this release?
            </DialogDescription>
            <DialogDescription className="text-default">
              Please kindly review your release information before clicking &quot;
              {isFastTrack ? "Pay & Submit" : "Submit Release"}&quot;.
            </DialogDescription>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-brand-blue hover:underline w-fit font-semibold text-sm"
            >
              Learn More about our Release Policy
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-4">
            <DialogClose asChild>
              <Button
                variant="outline"
                disabled={isSubmitting}
                className="w-fit rounded-xl px-5 py-2.5 text-sm font-semibold border-default-default/10 text-default hover:bg-page-background cursor-pointer"
              >
                Cancel, and review
              </Button>
            </DialogClose>
            <Button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="w-fit rounded-xl px-5 py-2.5 text-sm font-semibold bg-brand-orange hover:bg-brand-orange/90 text-white border-0 cursor-pointer"
            >
              {isSubmitting ? "Submitting..." : isFastTrack ? "Pay & Submit" : "Submit Release"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export interface FormattedReleaseTrack extends ReleaseTrack {
  mainArtistNames: string;
  keyArtistNames: string | null;
  engineerText: string | null;
  writerText: string | null;
}

interface ReleaseSummaryProps {
  releaseId: string;
  release: ReleaseDetail;
  tracks: FormattedReleaseTrack[];
  ownsFullRoyalty: boolean;
  resolvedGenre: string;
  resolvedLanguage: string;
  resolvedProducers: string;
  platforms: { id: number; name: string; logo_url: string | null }[];
}

function ReleaseSummary({
  releaseId,
  release,
  tracks,
  ownsFullRoyalty,
  resolvedGenre,
  resolvedLanguage,
  resolvedProducers,
  platforms,
}: ReleaseSummaryProps) {
  const router = useRouter();
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formatted dates
  const formattedOriginalReleaseDate = useMemo(() => {
    return formatDateOnly(release.original_release_date || release.release_date);
  }, [release.original_release_date, release.release_date]);

  const formattedReleaseDateTime = useMemo(() => {
    return formatDateTime(release.release_date, release.release_time);
  }, [release.release_date, release.release_time]);

  const formattedPreorderDateTime = useMemo(() => {
    return formatDateTime(release.preorder_date, release.preorder_time);
  }, [release.preorder_date, release.preorder_time]);

  // Artwork filename
  const artworkFileName = useMemo(() => {
    if (!release.cover_url) return "cover_artwork.jpg";
    const segments = release.cover_url.split("/");
    return segments[segments.length - 1] || "cover_artwork.jpg";
  }, [release.cover_url]);

  // Filter tracks that have split payments
  const tracksWithSplits = useMemo(() => {
    return tracks.filter((t) => {
      const splits = t.royalty?.splits || [];
      return splits.length > 0;
    });
  }, [tracks]);

  // Split Pay section only shows if owner does NOT own full royalty and at least one track has splits
  const shouldShowSplitPay = !ownsFullRoyalty && tracksWithSplits.length > 0;

  const handleSubmit = () => {
    setIsSubmitDialogOpen(true);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.post(API_ROUTES.RELEASES.DRAFT.SUBMIT(releaseId), {});

      goeyToast.success("Release Submitted", {
        description: "Your release has been successfully submitted for review!",
      });

      setIsSubmitDialogOpen(false);
      router.push("/submit-success");
    } catch (error: unknown) {
      console.error("Submission failed:", error);
      const errorObj = error as {
        message?: string;
        errors?: Record<string, string | string[]>;
      };

      if (errorObj?.errors && typeof errorObj.errors === "object") {
        const errorEntries = Object.entries(errorObj.errors);
        if (errorEntries.length > 0) {
          const errorMsg = errorEntries
            .map(([, msg]) => (Array.isArray(msg) ? msg.join(", ") : msg))
            .join(". ");
          goeyToast.error("Cannot submit release", {
            description: errorMsg,
            timing: {
              displayDuration: calculateReadingDuration(errorMsg),
            },
          });
          setIsSubmitting(false);
          return;
        }
      }

      const fallbackMsg =
        errorObj?.message || "Failed to submit release. Please check all required steps.";
      goeyToast.error("Submission failed", {
        description: fallbackMsg,
        timing: {
          displayDuration: calculateReadingDuration(fallbackMsg),
        },
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-245 w-full flex flex-col gap-8 pb-12">
      {/* 1. Release Details Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-border-default-secondary">
            Release Details
          </span>
          <Link
            href={`/discography/release/draft/${releaseId}`}
            className="text-brand-orange hover:underline font-medium text-base flex items-center gap-1 cursor-pointer transition-opacity hover:opacity-85"
          >
            <span>Edit</span>
            <ArrowUpRight size={16} className="text-brand-orange" />
          </Link>
        </div>

        <div className="bg-white rounded-30 overflow-hidden grid grid-cols-[max-content_1fr]">
          {/* Row 1: Release Title */}
          <div className="grid grid-cols-subgrid grid-rows-subgrid col-span-2 items-center border-b border-default-default">
            <div className="p-5 text-[11px] font-normal text-border-default-secondary">
              Release Title
            </div>
            <div className="p-5 flex flex-col justify-center gap-2">
              <span className="text-base font-medium text-black leading-snug">
                {release.title || "—"}
              </span>
              <span className="text-[11px] font-normal text-border-default-secondary capitalize">
                {release.type || "Single"}
              </span>
            </div>
          </div>

          {/* Row 2: Genre */}
          <div className="grid grid-cols-subgrid grid-rows-subgrid col-span-2 items-center border-b border-default-default">
            <div className="p-5 text-[11px] font-normal text-border-default-secondary">Genre</div>
            <div className="p-5 text-base font-medium text-black">{resolvedGenre || "—"}</div>
          </div>

          {/* Row 3: Release Version */}
          <div className="grid grid-cols-subgrid grid-rows-subgrid col-span-2 items-center border-b border-default-default">
            <div className="p-5 text-[11px] font-normal text-border-default-secondary">
              Release Version
            </div>
            <div className="p-5 text-base font-medium text-black">
              {release.version || "Original"}
            </div>
          </div>

          {/* Row 4: Release Date */}
          <div className="grid grid-cols-subgrid grid-rows-subgrid col-span-2 items-center border-b border-default-default">
            <div className="p-5 text-[11px] font-normal text-border-default-secondary">
              Release Date
            </div>
            <div className="p-5 text-base font-medium text-black">
              {formattedOriginalReleaseDate}
            </div>
          </div>

          {/* Row 5: Producers */}
          <div className="grid grid-cols-subgrid grid-rows-subgrid col-span-2 items-center border-b border-default-default">
            <div className="p-5 text-[11px] font-normal text-border-default-secondary">
              Producers
            </div>
            <div className="p-5 text-base font-medium text-black">{resolvedProducers}</div>
          </div>

          {/* Row 6: Copyright Holder */}
          <div className="grid grid-cols-subgrid grid-rows-subgrid col-span-2 items-center border-b border-default-default">
            <div className="p-5 text-[11px] font-normal text-border-default-secondary">
              Copyright Holder
            </div>
            <div className="p-5 text-base font-medium text-black">
              {release.copyright_holder || "—"}
            </div>
          </div>

          {/* Row 7: Copyright Year */}
          <div className="grid grid-cols-subgrid grid-rows-subgrid col-span-2 items-center border-b border-default-default">
            <div className="p-5 text-[11px] font-normal text-border-default-secondary">
              Copyright Year
            </div>
            <div className="p-5 text-base font-medium text-black">
              {release.copyright_year || "—"}
            </div>
          </div>

          {/* Row 8: Release Language */}
          <div className="grid grid-cols-subgrid grid-rows-subgrid col-span-2 items-center border-b border-default-default">
            <div className="p-5 text-[11px] font-normal text-border-default-secondary">
              Release Language
            </div>
            <div className="p-5 text-base font-medium text-black">{resolvedLanguage}</div>
          </div>

          {/* Row 9: 13 digits BarCode (UPC/EAN) */}
          <div className="grid grid-cols-subgrid grid-rows-subgrid col-span-2 items-center">
            <div className="p-5 text-[11px] font-normal text-border-default-secondary">
              13 digits BarCode (UPC/EAN)
            </div>
            <div className="p-5 text-base font-medium text-black">{release.upc || "—"}</div>
          </div>
        </div>
      </section>

      {/* 2. Release Artwork Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-border-default-secondary">
            Release Artwork
          </span>
          <Link
            href={`/discography/release/draft/${releaseId}`}
            className="text-brand-orange hover:underline font-medium text-base flex items-center gap-1 cursor-pointer transition-opacity hover:opacity-85"
          >
            <span>Edit</span>
            <ArrowUpRight size={16} className="text-brand-orange" />
          </Link>
        </div>

        <div className="bg-white rounded-30 p-5 flex items-center gap-4">
          <Image
            src={release.cover_url || "/images/release-2.png"}
            width={60}
            height={60}
            alt="Release Artwork Preview"
            className="rounded-[15px] object-cover size-15 shrink-0 bg-[#F9FAFC]"
          />
          <div className="flex flex-col justify-center gap-1 min-w-0">
            <span className="text-base font-medium text-black truncate">{artworkFileName}</span>
            <span className="text-[11px] font-normal text-border-default-secondary">Uploaded</span>
          </div>
        </div>
      </section>

      {/* 3. Release Tracks Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-border-default-secondary">
            Release Tracks
          </span>
          <Link
            href={`/discography/release/draft/${releaseId}/release-tracks`}
            className="text-brand-orange hover:underline font-medium text-base flex items-center gap-1 cursor-pointer transition-opacity hover:opacity-85"
          >
            <span>Edit</span>
            <ArrowUpRight size={16} className="text-brand-orange" />
          </Link>
        </div>

        <div className="bg-white rounded-30 overflow-hidden flex flex-col">
          {tracks.length === 0 ? (
            <span className="text-sm text-border-default-secondary italic p-6 text-center">
              No tracks uploaded yet.
            </span>
          ) : (
            tracks.map((track, index) => {
              const { mainArtistNames, keyArtistNames, engineerText, writerText } = track;
              return (
                <div
                  key={track.reference || index}
                  className="flex items-center p-5 gap-4 border-b border-default-default/50 last:border-b-0"
                >
                  {/* Number Badge */}
                  <div className="size-10 rounded-full bg-[#F9FAFC] flex items-center justify-center text-base font-medium text-border-default-secondary shrink-0">
                    {index + 1}
                  </div>

                  {/* Track Info Container */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Purple Music Icon */}
                    <div className="size-10.5 rounded-20 bg-brand-purple/12 flex items-center justify-center shrink-0 text-brand-purple-2">
                      <Music size={26.25} />
                    </div>

                    {/* Titles and Credits */}
                    <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                      <span className="text-base font-medium text-black truncate">
                        {track.title}
                      </span>

                      <div className="flex flex-col gap-1 text-[11px] leading-tight">
                        <div className="flex items-center gap-1">
                          <span className="text-border-default-secondary">
                            Main Primary Artist:
                          </span>
                          <span className="text-brand-blue font-normal">{mainArtistNames}</span>
                        </div>

                        {keyArtistNames && (
                          <div className="flex items-center gap-1">
                            <span className="text-border-default-secondary">Key Artist:</span>
                            <span className="text-brand-blue font-normal">{keyArtistNames}</span>
                          </div>
                        )}

                        {engineerText && (
                          <div className="flex items-center gap-1">
                            <span className="text-border-default-secondary">
                              Producer &amp; Engineer Credits:
                            </span>
                            <span className="text-brand-blue font-normal">{engineerText}</span>
                          </div>
                        )}

                        {writerText && (
                          <div className="flex items-center gap-1">
                            <span className="text-border-default-secondary">
                              Writers &amp; Publishers:
                            </span>
                            <span className="text-brand-blue font-normal">{writerText}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* 4. Release Platform Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-border-default-secondary">
            Release Platform
          </span>
          <Link
            href={`/discography/release/draft/${releaseId}/choose-platforms`}
            className="text-brand-orange hover:underline font-medium text-base flex items-center gap-1 cursor-pointer transition-opacity hover:opacity-85"
          >
            <span>Edit</span>
            <ArrowUpRight size={16} className="text-brand-orange" />
          </Link>
        </div>

        {platforms.length === 0 ? (
          <div className="bg-white rounded-30 p-6 text-center text-sm text-border-default-secondary italic">
            No platforms selected yet.
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 sm:gap-8">
            {platforms.map((platform, idx) => (
              <div
                key={platform.id || idx}
                className="bg-white rounded-20 p-6 h-29.25 w-full sm:w-53.25 flex items-center justify-center shrink-0"
              >
                {platform.logo_url ? (
                  <Image
                    src={platform.logo_url}
                    alt={platform.name}
                    width={100}
                    height={30}
                    className="object-contain max-h-7.5 max-w-25"
                  />
                ) : (
                  <span className="text-sm font-medium text-black truncate">{platform.name}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Split Pay Section (rendered only if tracks have splits and owner does not own full) */}
      {shouldShowSplitPay && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-medium text-border-default-secondary">Split Pay</span>
            <Link
              href={`/discography/release/draft/${releaseId}/split-royalty`}
              className="text-brand-orange hover:underline font-medium text-base flex items-center gap-1 cursor-pointer transition-opacity hover:opacity-85"
            >
              <span>Edit</span>
              <ArrowUpRight size={16} className="text-brand-orange" />
            </Link>
          </div>

          <div className="bg-white rounded-30 p-6 flex flex-col gap-6">
            {tracksWithSplits.map((track, trackIdx) => {
              const splits = track.royalty?.splits || [];
              return (
                <div
                  key={track.reference || trackIdx}
                  className="flex flex-col last:border-b-0 pb-6 last:pb-0"
                >
                  {/* Track Header */}
                  <div className="flex items-center gap-4 p-5 border-b border-default-default">
                    <div className="size-10 rounded-full bg-[#F9FAFC] flex items-center justify-center text-base font-medium text-border-default-secondary shrink-0">
                      {trackIdx + 1}
                    </div>
                    <div className="size-10.5 rounded-20 bg-brand-purple/12 flex items-center justify-center shrink-0 text-brand-purple-2">
                      <Music size={26.25} />
                    </div>
                    <div className="flex flex-col justify-center gap-0.5 min-w-0">
                      <span className="text-base font-medium text-black truncate">
                        {track.title}
                      </span>
                      <span className="text-[11px] font-normal text-border-default-secondary">
                        Mp3
                      </span>
                    </div>
                  </div>

                  {/* Collaborators List */}
                  <div className="pl-14 sm:pl-20.25 flex flex-col">
                    {splits.map((split, splitIdx) => (
                      <div
                        key={split.reference || splitIdx}
                        className="py-4 border-b border-default-default last:border-b-0 flex items-center gap-3"
                      >
                        <div className="size-8 rounded-full bg-brand-purple/12 flex items-center justify-center shrink-0 text-brand-purple-2">
                          <User size={20} />
                        </div>
                        <div className="flex flex-col justify-center gap-1">
                          <span className="text-base font-medium text-default leading-tight">
                            {split.name}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs font-medium text-default">
                            <span>Split Percentage:</span>
                            <span className="text-[#009951]">{split.percent}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. Pre-order Date Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-border-default-secondary">
            Pre-order Date
          </span>
          <Link
            href={`/discography/release/draft/${releaseId}/pre-order`}
            className="text-brand-orange hover:underline font-medium text-base flex items-center gap-1 cursor-pointer transition-opacity hover:opacity-85"
          >
            <span>Edit</span>
            <ArrowUpRight size={16} className="text-brand-orange" />
          </Link>
        </div>

        <div className="bg-white rounded-30 p-4 sm:p-5 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Calendar size={20} className="text-black shrink-0" />
            <span className="text-base font-medium text-black">
              {release.preorder_date ? formattedPreorderDateTime : "Not configured"}
            </span>
          </div>

          <div className="h-px bg-default-default w-full" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs font-medium text-default">
              <span>Use Pre-order release</span>
              <span className="text-brand-orange font-medium cursor-pointer hover:underline">
                Learn More
              </span>
            </div>
            <Switch checked={!!release.preorder_date} disabled />
          </div>
        </div>
      </section>

      {/* 7. Release Date Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-border-default-secondary">Release Date</span>
          <Link
            href={`/discography/release/draft/${releaseId}/release-date`}
            className="text-brand-orange hover:underline font-medium text-base flex items-center gap-1 cursor-pointer transition-opacity hover:opacity-85"
          >
            <span>Edit</span>
            <ArrowUpRight size={16} className="text-brand-orange" />
          </Link>
        </div>

        <div className="bg-white rounded-30 p-4 sm:p-5 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Calendar size={20} className="text-black shrink-0" />
            <span className="text-base font-medium text-black">{formattedReleaseDateTime}</span>
          </div>

          <div className="h-px bg-default-default w-full" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs font-medium text-default">
              <span>Use Express release</span>
              <span className="text-brand-orange font-medium cursor-pointer hover:underline">
                Learn More
              </span>
            </div>
            <Switch checked={!!release.is_fast_track} disabled />
          </div>
        </div>
      </section>

      {/* Footer Submit Action Bar */}
      <div className="p-6 rounded-30 bg-white flex flex-col sm:flex-row items-center justify-end gap-6 sm:gap-8 mt-2">
        <p className="text-base font-medium text-default">
          Do review your release details before clicking “Submit”
        </p>
        <button
          onClick={handleSubmit}
          className="rounded-full px-6 py-3.5 bg-brand-orange hover:bg-brand-orange/90 text-white font-medium text-base flex items-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
        >
          <span>Submit</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Confirmation Modal */}
      <SubmitDialog
        isOpen={isSubmitDialogOpen}
        onOpenChange={setIsSubmitDialogOpen}
        isFastTrack={!!release.is_fast_track}
        isSubmitting={isSubmitting}
        onSubmit={handleFinalSubmit}
      />
    </div>
  );
}

export default ReleaseSummary;
