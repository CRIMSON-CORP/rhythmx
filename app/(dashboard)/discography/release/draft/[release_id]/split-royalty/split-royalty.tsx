"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { goeyToast } from "goey-toast";
import { ArrowRight, Music, Plus, Send, User, X } from "lucide-react";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import SelectCollaboratorModal, {
  type SelectedCollaboratorData,
} from "./modals/SelectCollaboratorModal";
import InviteCollaboratorModal from "./modals/InviteCollaboratorModal";

interface StagedCollaborator {
  reference: string;
  name: string;
  subtitle?: string;
  avatar_url?: string;
}

interface SplitRoyaltyProps {
  releaseId?: string;
  releaseOwnsFullRoyalty?: boolean;
  releaseArtworkUrl?: string;
  releaseTitle?: string;
  releaseGenre?: string;
  tracks: ReleaseTrack[];
}

function SplitRoyalty({
  releaseId,
  tracks,
  releaseOwnsFullRoyalty,
  releaseArtworkUrl,
  releaseGenre,
  releaseTitle,
}: SplitRoyaltyProps) {
  const router = useRouter();

  const [ownFullRoyalty, setOwnFullRoyalty] = useState<boolean>(releaseOwnsFullRoyalty || false);
  const [isTogglingRoyalty, setIsTogglingRoyalty] = useState<boolean>(false);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

  // Staged collaborator (selected from roster modal, awaiting percentage submission via '+')
  const [stagedCollaborator, setStagedCollaborator] = useState<StagedCollaborator | null>(null);
  const [stagedPercent, setStagedPercent] = useState<number | "">(50);

  useEffect(() => {
    if (releaseOwnsFullRoyalty !== undefined) {
      setOwnFullRoyalty(releaseOwnsFullRoyalty);
      if (releaseOwnsFullRoyalty) {
        setSelectedTrackId(null);
        setStagedCollaborator(null);
      }
    }
  }, [releaseOwnsFullRoyalty]);

  // Modal states
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Currently selected track
  const selectedTrack = useMemo(() => {
    if (!selectedTrackId) return null;
    return tracks.find((t) => t.reference === selectedTrackId) || null;
  }, [tracks, selectedTrackId]);

  // Remaining percentage that can be allocated (from server owner_percent)
  const remainingPercent = selectedTrack?.royalty?.owner_percent ?? 100;

  // Main artist & Writers display from release track
  const writerNames = useMemo(() => {
    if (!selectedTrack) return "";
    const trackWriters = selectedTrack.people?.writer?.map((w) => w.name).join(", ");
    return trackWriters || "—";
  }, [selectedTrack]);

  // Toggle own full royalty via PATCH request
  const handleToggleOwnFullRoyalty = async (checked: boolean) => {
    if (!releaseId || isTogglingRoyalty) return;

    setIsTogglingRoyalty(true);
    try {
      await api.patch(API_ROUTES.RELEASES.ROYALTY(releaseId), {
        owns_full_royalty: checked,
      });

      setOwnFullRoyalty(checked);
      if (checked) {
        setSelectedTrackId(null);
        setStagedCollaborator(null);
      }
      router.refresh();
      goeyToast.success(checked ? "Full royalty ownership enabled" : "Split royalty enabled");
    } catch (err: unknown) {
      console.error("Toggle royalty failed:", err);
      const errorMsg = (err as { message?: string })?.message || "Please try again later.";
      goeyToast.error("Failed to update royalty ownership", {
        description: errorMsg,
      });
    } finally {
      setIsTogglingRoyalty(false);
    }
  };

  // Track select / Split Pay button click
  const handleSelectTrack = (trackRef: string) => {
    if (ownFullRoyalty) return;
    setSelectedTrackId(trackRef);
    setStagedCollaborator(null);
  };

  // Add staged collaborator into list
  const handleAddStagedCollaborator = () => {
    if (!selectedTrackId || !stagedCollaborator) return;

    const percent = Number(stagedPercent) || 0;
    if (percent <= 0) {
      goeyToast.error("Percentage Required", {
        description: "Please enter a percentage greater than 0%.",
      });
      return;
    }

    if (percent > remainingPercent) {
      goeyToast.error("Limit Exceeded", {
        description: `You cannot allocate more than the remaining ${remainingPercent}%.`,
      });
      return;
    }

    // Temporary clear staged form until user provides add split endpoint
    setStagedCollaborator(null);
    setStagedPercent(50);
    router.refresh();
    goeyToast.success("Collaborator split added");
  };

  // Remove collaborator
  const handleRemoveCollaborator = (_collabReference: string) => {
    if (!selectedTrackId) return;

    router.refresh();
    goeyToast.success("Collaborator removed");
  };

  // Handle artist chosen from SelectCollaboratorModal
  const handleCollaboratorSelectedFromRoster = (artist: SelectedCollaboratorData) => {
    setStagedCollaborator({
      reference: artist.reference,
      name: artist.name,
      subtitle: artist.subtitle || "Collaborator",
      avatar_url: artist.avatar_url,
    });
    setStagedPercent(Math.min(50, remainingPercent > 0 ? remainingPercent : 50));
  };

  // Handle invitation sent from InviteCollaboratorModal
  const handleInviteSent = (_data: { name: string; email: string; percentage: number }) => {
    if (!selectedTrackId) return;

    router.refresh();
    goeyToast.success("Invite sent successfully");
  };

  const handleContinue = () => {
    if (releaseId) {
      router.push(`/discography/release/draft/${releaseId}/release-date`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[0.55fr_0.45fr] gap-8 items-start pb-16">
      {/* Left Column: Settings, Metadata & Tracks */}
      <div className="flex flex-col gap-6">
        {/* Own Full Royalty Card */}
        <div className="p-4 bg-white rounded-2xl flex flex-col">
          <div className="flex items-center justify-between">
            <p className="text-default font-medium text-base">
              Own full royalty payment to this release tracks?
            </p>
            <Switch
              checked={ownFullRoyalty}
              disabled={isTogglingRoyalty}
              onCheckedChange={handleToggleOwnFullRoyalty}
            />
          </div>
          <p className="text-border-default-secondary text-xs font-medium">
            All release royalty payment will be 100% yours.
          </p>
        </div>

        {/* Release Metadata Card */}
        <div className="bg-white rounded-30 p-6 flex items-center flex-wrap gap-8">
          <div className="relative size-31 shrink-0 rounded-3xl overflow-hidden bg-gray-50">
            {releaseArtworkUrl && (
              <Image
                src={releaseArtworkUrl}
                fill
                sizes="124px"
                alt="Release Artwork"
                className="object-cover"
              />
            )}
          </div>
          <div className="flex flex-col gap-3 min-w-45">
            <div className="flex items-baseline gap-6 text-sm">
              <span className="w-24 text-xs text-border-default-secondary">Release Title</span>
              <span className="font-medium text-black">{releaseTitle}</span>
            </div>
            <div className="flex items-baseline gap-6 text-sm">
              <span className="w-24 text-xs text-border-default-secondary">Genre</span>
              <span className="font-medium text-black">{releaseGenre}</span>
            </div>
          </div>
        </div>

        {/* Tracks List */}
        <div className="flex flex-col gap-4">
          <p className="font-medium text-border-default-secondary">Tracks</p>
          <div className="flex flex-col bg-white rounded-30 overflow-hidden divide-y divide-default-default/15 shadow-xs">
            {tracks.length === 0 ? (
              <div className="p-8 text-center text-border-default-secondary font-medium text-sm">
                No tracks uploaded yet.
              </div>
            ) : (
              <ul className="flex flex-col divide-y divide-default-default/15">
                {tracks.map((track) => {
                  const isSelected = selectedTrackId === track.reference;

                  return (
                    <li
                      key={track.reference}
                      className={cn(
                        "relative flex items-center gap-4 px-6 py-4.5 transition-colors",
                        isSelected && !ownFullRoyalty
                          ? "bg-light-blue"
                          : "bg-white hover:bg-light-blue",
                      )}
                    >
                      <div className="relative z-10 flex items-center gap-4 w-full">
                        {/* Track Number Badge */}
                        <div className="size-10 rounded-full bg-page-background flex items-center justify-center font-medium text-default text-sm flex-none">
                          {track.order}
                        </div>

                        {/* Music Icon Badge */}
                        <div className="size-10.5 rounded-full bg-[#9747FF]/12 flex items-center justify-center flex-none">
                          <Music size={22} className="text-[#9747FF]" />
                        </div>

                        {/* Title & Status */}
                        <div className="flex flex-col grow break-all min-w-0 pr-2 gap-2">
                          <span className="font-medium text-black truncate">{track.title}</span>
                          <span className="text-[11px] text-border-default-secondary leading-none">
                            Uploaded
                          </span>
                        </div>

                        {/* Split Pay Action */}
                        <div className="flex items-center gap-3 flex-none">
                          <Button
                            variant="white-outline"
                            onClick={() => handleSelectTrack(track.reference)}
                            disabled={ownFullRoyalty}
                            className={cn(
                              isSelected && !ownFullRoyalty
                                ? "bg-white text-default hover:bg-white"
                                : "",
                            )}
                            size="sm"
                          >
                            Split Pay
                          </Button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between sm:justify-end gap-4 p-6 sm:p-8 bg-white rounded-30">
          <p className="font-medium text-default text-center text-xs sm:text-sm">
            Do review your release details before clicking “continue”
          </p>
          <Button variant="orange" onClick={handleContinue}>
            <span>Continue</span>
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>

      {/* Right Column: Split Track Royalty Panel or Full Royalty Empty State */}
      <div className="relative isolate bg-white rounded-30 min-h-135 overflow-hidden flex flex-col p-6 sm:p-8">
        {/* Glow Background */}
        <div className="absolute w-full top-0 left-0 right-0 h-44 bg-linear-to-r from-[#9747FF]/40 to-[#0066FF]/30 -z-10 opacity-20 blur-3xl pointer-events-none" />

        {/* When Own Full Royalty is ON OR no track is selected yet (Image 4) */}
        {ownFullRoyalty || !selectedTrack ? (
          <div className="w-full h-full flex flex-col justify-between grow">
            <span className="text-xl font-heading font-medium text-default">
              Split Track Royalty
            </span>

            <div className="w-full max-w-xs mx-auto flex flex-col items-center justify-center text-center my-auto py-12">
              <div className="relative size-26 mb-4">
                <Image
                  src="/images/money-bag.png"
                  alt="You own full royalty"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h3 className="text-lg font-heading font-medium text-black">
                You own full royalty to this release
              </h3>
              <p className="font-medium text-black/50 leading-relaxed">
                Turn off “Own full royalty” to allow enable split royalty
              </p>
            </div>
          </div>
        ) : (
          /* When a track IS selected (Image 3) */
          <div className="flex flex-col gap-8 w-full">
            <span className="text-xl font-heading font-medium text-default">
              Split Track Royalty
            </span>

            {/* Track Info Header */}
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-semibold font-heading">
                {selectedTrack.title.replace(/\.[^/.]+$/, "")}
              </h2>
              <p className="text-border-default-secondary font-medium truncate">
                {selectedTrack.title}
              </p>
              <p className="text-border-default-secondary font-medium">
                Writer: <span className="text-default">{writerNames}</span>
              </p>
            </div>

            {/* Total Split Card */}
            <div className="p-6 bg-page-background rounded-20 flex items-center justify-between leading-none">
              <span className="font-medium text-border-default-secondary">Total Split</span>
              <span className="font-medium text-default">
                {selectedTrack.royalty?.owner_percent ?? 100}%
              </span>
            </div>

            {/* Collaborators Section */}
            <div className="flex flex-col gap-4 px-6 py-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-border-default-secondary">Collaborators</h4>
                <div className="flex items-center gap-2.5 font-medium">
                  {/* Select Collaborator Button */}
                  <Button
                    size="md"
                    type="button"
                    variant="purple"
                    onClick={() => setIsSelectModalOpen(true)}
                  >
                    <span>Select collaborator</span>
                    <Plus size={24} />
                  </Button>

                  {/* Send Invite Button */}
                  <Button
                    size="md"
                    type="button"
                    onClick={() => setIsInviteModalOpen(true)}
                    variant="white-outline"
                  >
                    <span>Send invite</span>
                    <Send size={24} />
                  </Button>
                </div>
              </div>

              {/* Inline Staged Collaborator Row (Image 3) */}
              {stagedCollaborator && (
                <div className="flex items-center justify-between gap-4 py-2 animate-in fade-in">
                  <div className="flex items-center gap-4 min-w-0">
                    {stagedCollaborator.avatar_url ? (
                      <div className="relative size-19 rounded-full overflow-hidden shrink-0 border border-default-default/20">
                        <Image
                          src={stagedCollaborator.avatar_url}
                          alt={stagedCollaborator.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="size-19 rounded-full bg-[#9747FF]/10 flex items-center justify-center shrink-0">
                        <User size={24} className="text-[#9747FF]" />
                      </div>
                    )}
                    <div className="flex flex-col truncate">
                      <span className="font-medium text-black truncate">
                        {stagedCollaborator.name}
                      </span>
                      <span className="text-xs text-border-default-secondary font-medium truncate">
                        {stagedCollaborator.subtitle || "Collaborator"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="relative w-36 sm:w-44">
                      <input
                        type="number"
                        min={1}
                        max={remainingPercent || 100}
                        value={stagedPercent}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "") {
                            setStagedPercent("");
                            return;
                          }
                          const num = parseInt(val, 10);
                          if (isNaN(num)) return;
                          setStagedPercent(Math.min(100, Math.max(0, num)));
                        }}
                        placeholder="50%"
                        className="w-full h-11 rounded-20 border border-default-default/40 bg-white px-4 text-sm font-medium text-center text-default outline-none focus:border-brand-orange transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-border-default-secondary/60"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAddStagedCollaborator}
                      className="size-11 rounded-full border border-black/80 flex items-center justify-center text-black hover:bg-black/5 active:scale-95 transition-all cursor-pointer shrink-0"
                      title="Add to split"
                    >
                      <Plus size={20} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setStagedCollaborator(null)}
                      className="size-8 rounded-full text-border-default-secondary hover:text-black hover:bg-black/5 flex items-center justify-center transition-colors shrink-0"
                      title="Cancel"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Collaborators List */}
              {(selectedTrack.royalty?.splits?.length ?? 0) > 0 ? (
                <div className="bg-white rounded-20 p-5 sm:p-6 border border-default-default/20 flex flex-col divide-y divide-default-default/15 shadow-xs">
                  {selectedTrack.royalty?.splits?.map((collab) => (
                    <div
                      key={collab.reference}
                      className="flex items-center justify-between py-4 first:pt-0 last:pb-0 gap-4"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="size-10 rounded-full bg-[#9747FF]/10 flex items-center justify-center shrink-0">
                          <User size={20} className="text-[#9747FF]" />
                        </div>
                        <div className="flex flex-col truncate">
                          <span className="font-semibold text-sm text-black truncate">
                            {collab.name}
                            {collab.status === "pending" ? " (Invite sent)" : ""}
                          </span>
                          <span className="text-xs text-border-default-secondary font-medium mt-0.5">
                            Split Percentage:{" "}
                            <span className="text-[#009951] font-semibold">{collab.percent}%</span>
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => handleRemoveCollaborator(collab.reference)}
                        className="rounded-full px-5 py-2 h-auto text-xs font-medium border-black/80 text-black hover:bg-black/5 shrink-0 transition-colors"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                !stagedCollaborator && (
                  <div className="py-8 text-center text-xs text-border-default-secondary font-medium bg-page-background/40 rounded-20 border border-dashed border-default-default/30">
                    No collaborators added for this track yet. Click &ldquo;Select
                    collaborator&rdquo; or &ldquo;Send invite&rdquo; above.
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Select Collaborator Modal (Roster Picker) */}
      <SelectCollaboratorModal
        open={isSelectModalOpen}
        onOpenChange={setIsSelectModalOpen}
        excludeIds={selectedTrack?.royalty?.splits?.map((c) => c.reference) || []}
        onSelectCollaborator={handleCollaboratorSelectedFromRoster}
      />

      {/* Invite Collaborator Modal */}
      <InviteCollaboratorModal
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        maxPercentage={remainingPercent || 100}
        onSendInvite={handleInviteSent}
      />
    </div>
  );
}

export default SplitRoyalty;
