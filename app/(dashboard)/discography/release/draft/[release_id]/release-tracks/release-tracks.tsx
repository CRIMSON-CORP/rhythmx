"use client";

import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { useRouter } from "next/navigation";
import React, { useRef, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { goeyToast } from "goey-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { nanoid } from "nanoid";
import {
  ArrowRight,
  Award,
  Check,
  Folder,
  Headphones,
  Loader2,
  Music,
  PenLine,
  Plus,
  Star,
  Trash2,
} from "lucide-react";

import {
  SelectArtistModal,
  AddNonLabelArtistModal,
  AddProducerEngineerModal,
  AddWritersPublishersModal,
  EnterIsrcModal,
  UploadLicenseModal,
  type SelectedArtistData,
  type NonLabelArtistData,
  type ProducerEngineerData,
  type WriterPublisherData,
} from "./modals";
import UserSharing from "@/components/icons/user-sharing";

interface UploadingTrack {
  id: string;
  file: File;
  name: string;
  progress: number;
  status: "uploading" | "error";
  errorMessage?: string;
}

interface ReleaseTracksProps {
  releaseReference: string;
  tracks: ReleaseTrack[];
  meta?: {
    genres: (Genre & { sub_genres: Genre[] })[];
    languages: Language[];
    contributors?: ContributorGroup[];
    publishingTypes: PublishingType[];
  };
}

const EMPTY_PEOPLE: TrackPeopleCredits = {
  main: [],
  key_artist: [],
  engineer: [],
  writer: [],
};

function formatDuration(durationInSeconds: number | null | undefined): string {
  if (!durationInSeconds || isNaN(durationInSeconds)) return "0:00";
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function ReleaseTracks({ releaseReference, tracks: initialTracks, meta }: ReleaseTracksProps) {
  const router = useRouter();
  const [tracks, setTracks] = useState<ReleaseTrack[]>(() => initialTracks || []);
  const [uploadingQueue, setUploadingQueue] = useState<UploadingTrack[]>([]);
  const [deletingTrackRefs, setDeletingTrackRefs] = useState<Set<string>>(new Set());
  const [editingTrackRef, setEditingTrackRef] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTracks(initialTracks || []);
  }, [initialTracks]);

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleAudioFiles(files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadSingleFile = async (file: File) => {
    const uploadId = nanoid();

    const newUploadItem: UploadingTrack = {
      id: uploadId,
      file,
      name: file.name,
      progress: 0,
      status: "uploading",
    };

    setUploadingQueue((prev) => [...prev, newUploadItem]);

    const formData = new FormData();
    formData.append("audio", file);

    try {
      const response = await api.postFormData({
        url: API_ROUTES.RELEASES.DRAFT.TRACKS.INDEX(releaseReference),
        formData,
        onUploadProgress: (percent) => {
          setUploadingQueue((prev) =>
            prev.map((item) =>
              item.id === uploadId
                ? { ...item, progress: Math.min(Math.round(percent), 99) }
                : item,
            ),
          );
        },
      });

      const uploadedTrack = (response.data?.track || response.data) as ReleaseTrack;
      if (uploadedTrack && uploadedTrack.reference) {
        setTracks((prev) => [...prev, uploadedTrack]);
        setUploadingQueue((prev) => prev.filter((item) => item.id !== uploadId));
        goeyToast.success("Upload Completed", {
          description: `"${uploadedTrack.title || file.name}" was uploaded successfully.`,
        });
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
            ? String((err as { message: unknown }).message)
            : "Network error or upload failed";

      setUploadingQueue((prev) =>
        prev.map((item) =>
          item.id === uploadId ? { ...item, status: "error", errorMessage: errorMsg } : item,
        ),
      );
      goeyToast.error("Upload Failed", {
        description: `Failed to upload "${file.name}": ${errorMsg}`,
      });
    }
  };

  const handleAudioFiles = (files: FileList) => {
    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isAudio =
        file.type.startsWith("audio/") ||
        file.name.endsWith(".mp3") ||
        file.name.endsWith(".wav") ||
        file.name.endsWith(".aac") ||
        file.name.endsWith(".flac") ||
        file.name.endsWith(".m4a");

      if (!isAudio) {
        goeyToast.error("Invalid File Type", {
          description: `"${file.name}" is not a supported audio format (MP3, WAV, FLAC, AAC).`,
        });
        continue;
      }

      if (file.size > 200 * 1024 * 1024) {
        goeyToast.error("File Too Large", {
          description: `"${file.name}" exceeds the maximum allowed size of 200MB.`,
        });
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    validFiles.forEach((file) => {
      uploadSingleFile(file);
    });
  };

  const handleCancelUpload = (uploadId: string) => {
    setUploadingQueue((prev) => prev.filter((item) => item.id !== uploadId));
  };

  const handleRetryUpload = (item: UploadingTrack) => {
    setUploadingQueue((prev) => prev.filter((q) => q.id !== item.id));
    uploadSingleFile(item.file);
  };

  const handleStartEdit = (track: ReleaseTrack) => {
    setEditingTrackRef(track.reference);
  };

  const handleSaveTrackDetails = async (updatedTrack: ReleaseTrack) => {
    try {
      const creditsPayload = updatedTrack.people || EMPTY_PEOPLE;

      await Promise.all([
        api.patch(API_ROUTES.RELEASES.DRAFT.TRACKS.TRACK(releaseReference, updatedTrack.reference), {
          title: updatedTrack.title,
          primary_genre: updatedTrack.primary_genre,
          secondary_genre: updatedTrack.secondary_genre,
          language: updatedTrack.language,
          preview_clip: updatedTrack.preview_clip,
          lyrics: updatedTrack.lyrics,
          master_owner: updatedTrack.master_owner,
          label: updatedTrack.label,
          has_advisory: updatedTrack.has_advisory,
          is_online: updatedTrack.is_online,
          isrc: updatedTrack.isrc,
          has_license: updatedTrack.has_license,
        }),
        api.put(
          API_ROUTES.RELEASES.DRAFT.TRACKS.CREDITS(releaseReference, updatedTrack.reference),
          creditsPayload,
        ),
      ]);

      setTracks((prev) =>
        prev.map((t) => (t.reference === updatedTrack.reference ? updatedTrack : t)),
      );
      router.refresh();
      goeyToast.success("Track details saved!");
    } catch (err: any) {
      console.error("Save track details failed:", err);
      const errorsObj = (err?.errors && typeof err.errors === "object" ? err.errors : {}) as Record<
        string,
        string
      >;
      const errorKeys = Object.keys(errorsObj);
      const firstFieldError = errorKeys.length > 0 ? errorsObj[errorKeys[0]] : null;

      // lib/api.ts already showed generic toast ("Validation failed.")
      // Show the specific first field error toast alongside it if available
      if (firstFieldError) {
        goeyToast.error(firstFieldError);
      }

      // Re-throw so caller (TrackEditPanel) can handle loading state without closing panel
      throw err;
    }
  };

  const handleDeleteTrack = (track: ReleaseTrack, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (deletingTrackRefs.has(track.reference)) return;

    goeyToast(`Delete "${track.title || "Untitled"}"?`, {
      action: {
        label: "Yes, Delete",
        successLabel: "Track deleted",
        onClick: async () => {
          setDeletingTrackRefs((prev) => new Set(prev).add(track.reference));

          try {
            await api.delete(API_ROUTES.RELEASES.DRAFT.TRACKS.TRACK(releaseReference, track.reference));
            setTracks((prev) => prev.filter((t) => t.reference !== track.reference));
            if (editingTrackRef === track.reference) {
              setEditingTrackRef(null);
            }
          } catch (err: unknown) {
            const errorMsg =
              err instanceof Error
                ? err.message
                : typeof err === "object" && err !== null && "message" in err
                  ? String((err as { message: unknown }).message)
                  : "Failed to delete track";
            goeyToast.error("Delete Failed", { description: errorMsg });
            throw err;
          } finally {
            setDeletingTrackRefs((prev) => {
              const next = new Set(prev);
              next.delete(track.reference);
              return next;
            });
          }
        },
      },
    });
  };

  const isStepValid = tracks.length > 0 && uploadingQueue.length === 0;

  const handleContinue = () => {
    if (uploadingQueue.length > 0) {
      goeyToast.error("Upload in Progress", {
        description: "Please wait for all audio files to finish uploading before continuing.",
      });
      return;
    }
    if (tracks.length === 0) {
      goeyToast.error("Tracks Required", {
        description: "Please upload at least one audio track to continue.",
      });
      return;
    }
    router.push(`/discography/release/draft/${releaseReference}/choose-platforms`);
  };

  const editingTrack = tracks.find((t) => t.reference === editingTrackRef) || null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch pb-10">
      {/* Left Column: Form Fields Card */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-8 px-5 py-17 bg-white rounded-30 justify-center items-center">
          <div className="flex items-center gap-8">
            <Image src="/images/headphone.png" alt="headphones" width={50} height={50} />
            <div className="flex flex-col gap-3 font-medium text-lg leading-none">
              <p>Upload Audio File</p>
              <p className="text-sm text-border-default-secondary">MP3, AAC or WAV</p>
            </div>
          </div>
          <label
            htmlFor="audio-input"
            className="w-fit p-4 rounded-full outline outline-black bg-white hover:bg-default/5 text-default font-medium flex items-center gap-2 cursor-pointer transition-colors"
          >
            <span>Browse Files</span>
            <Folder size={16} />
          </label>
          <input
            type="file"
            id="audio-input"
            accept="audio/*,.mp3,.wav,.aac,.flac,.m4a"
            className="hidden"
            ref={fileInputRef}
            onChange={handleAudioFileChange}
            multiple
          />
        </div>

        <p className="font-medium text-border-default-secondary">Tracks Added</p>
        <div className="flex flex-col bg-white rounded-30 overflow-hidden divide-y divide-default-default">
          {tracks.length === 0 && uploadingQueue.length === 0 ? (
            <div className="p-8 text-center text-border-default-secondary font-medium text-sm">
              No tracks uploaded yet.
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-default-default">
              {tracks.map((track, index) => (
                <TrackItem
                  key={track.reference}
                  track={track}
                  index={index}
                  isSelected={editingTrackRef === track.reference}
                  isDeleting={deletingTrackRefs.has(track.reference)}
                  onEdit={() => handleStartEdit(track)}
                  onDelete={(e) => handleDeleteTrack(track, e)}
                />
              ))}
              {uploadingQueue.map((item, queueIdx) => (
                <UploadingTrackItem
                  key={item.id}
                  item={item}
                  index={tracks.length + queueIdx}
                  onCancel={() => handleCancelUpload(item.id)}
                  onRetry={() => handleRetryUpload(item)}
                />
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-4 p-8 bg-white rounded-30">
          {/* Form Footer / Action bar */}
          <div className="bg-white rounded-30 flex flex-col sm:flex-row items-center justify-end gap-4">
            <p className="font-medium text-default text-sm">
              Do review track meta data before clicking “continue”
            </p>
            <Button
              variant="orange"
              onClick={handleContinue}
              disabled={!isStepValid}
              className="w-fit"
            >
              <span>Continue</span>
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Column: Track Edit Panel or Placeholder */}
      <div className="relative isolate bg-white rounded-30 min-h-125 max-h-[85vh] overflow-y-auto no-scrollbar">
        <div className="absolute w-full top-0 left right-0 h-1/3 max-h-68.5 bg-linear-to-r from-[#9747FF]/50 to-[#0066FF]/50 -z-10 opacity-25 blur-3xl"></div>
        {editingTrack ? (
          <TrackEditPanel
            track={editingTrack}
            trackIndex={tracks.findIndex((t) => t.reference === editingTrackRef)}
            releaseReference={releaseReference}
            meta={meta}
            onSave={handleSaveTrackDetails}
            onDelete={() => {
              if (editingTrack) {
                handleDeleteTrack(editingTrack);
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 min-h-100 relative isolate">
            <div className="size-16 rounded-full bg-brand-purple/10 flex items-center justify-center mb-4">
              <Music size={32} className="text-brand-purple" />
            </div>
            <h3 className="text-lg font-medium text-default mb-2">Select a Track to Edit</h3>
            <p className="text-xs text-border-default-secondary max-w-xs leading-normal">
              Upload your audio files on the left, then click &quot;Edit Track&quot; to customize
              title, genre, language, contributors, lyrics, and parental advisory settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReleaseTracks;

function TrackItem({
  track,
  index,
  isSelected,
  isDeleting,
  onEdit,
  onDelete,
}: {
  track: ReleaseTrack;
  index: number;
  isSelected: boolean;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  const displayTitle = track.title || "Untitled";

  return (
    <li
      className={cn(
        "relative flex items-center gap-4 px-6 py-4.5 transition-colors",
        isSelected ? "bg-page-background" : "bg-white hover:bg-page-background/30",
      )}
    >
      <div className="relative z-10 flex items-center gap-4 w-full">
        {/* Index circle */}
        <div className="size-10 rounded-full bg-page-background flex items-center justify-center font-medium text-default flex-none">
          {index + 1}
        </div>

        {/* Music icon */}
        <div className="size-10.5 rounded-full bg-brand-purple/12 flex items-center justify-center flex-none">
          <Music size={24} className="text-brand-purple" />
        </div>

        {/* Title and status */}
        <div className="flex flex-col grow break-all min-w-0">
          <span className="font-medium text-sm text-default truncate">{displayTitle}</span>
          <span className="text-[11px] text-border-default-secondary font-medium leading-none mt-1">
            Uploaded {track.duration ? `• ${formatDuration(track.duration)}` : ""}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 flex-none">
          <Button
            variant="outline"
            onClick={onEdit}
            className={cn(
              "rounded-full px-4 py-2 h-auto text-xs transition-colors",
              isSelected
                ? "bg-default text-white border-transparent hover:bg-default/80"
                : "bg-transparent text-default border-default-default/20 hover:bg-default-default/5",
            )}
            size="sm"
          >
            Edit Track
          </Button>

          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="p-1 rounded-full group/btn cursor-pointer hover:bg-page-background transition-colors disabled:opacity-50"
            title="Delete track"
          >
            {isDeleting ? (
              <Loader2 size={16} className="text-[#EC221F] animate-spin" />
            ) : (
              <Trash2
                size={16}
                className="text-[#EC221F] group-hover/btn:scale-110 transition-transform"
              />
            )}
          </button>
        </div>
      </div>
    </li>
  );
}

function UploadingTrackItem({
  item,
  index,
  onCancel,
  onRetry,
}: {
  item: UploadingTrack;
  index: number;
  onCancel: () => void;
  onRetry?: () => void;
}) {
  const isError = item.status === "error";

  return (
    <li className="relative flex items-center gap-4 px-6 py-4.5 bg-white overflow-hidden transition-colors">
      {/* Background progress indicator matching design */}
      {!isError && (
        <div
          style={{
            width: `${item.progress}%`,
            transition: "width 0.25s ease-out",
          }}
          className="absolute top-0 left-0 h-full bg-[#D4F7D9] pointer-events-none"
        />
      )}

      {/* Content wrapper */}
      <div className="relative z-10 flex items-center gap-4 w-full">
        {/* Index circle */}
        <div
          className={cn(
            "size-10 rounded-full flex items-center justify-center font-medium flex-none",
            isError ? "bg-red-50 text-danger-default" : "bg-[#EBFFEE] text-positive-default",
          )}
        >
          {index + 1}
        </div>

        {/* Music icon */}
        <div
          className={cn(
            "size-10.5 rounded-full flex items-center justify-center flex-none",
            isError ? "bg-red-50" : "bg-white",
          )}
        >
          <Music size={24} className={isError ? "text-danger-default" : "text-brand-orange"} />
        </div>

        {/* Title and progress status */}
        <div className="flex flex-col grow break-all min-w-0">
          <span className="font-medium text-sm text-default truncate">{item.name}</span>
          <span
            className={cn(
              "text-[11px] font-medium leading-none mt-1",
              isError ? "text-danger-default" : "text-positive-default",
            )}
          >
            {isError
              ? item.errorMessage || "Upload failed"
              : `uploading... ${Math.round(item.progress)}%`}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-none">
          {isError && onRetry && (
            <button
              onClick={onRetry}
              className="text-xs text-brand-orange hover:underline font-medium"
            >
              Retry
            </button>
          )}
          <button
            onClick={onCancel}
            className="p-1 rounded-full group/btn cursor-pointer hover:bg-page-background transition-colors"
            title={isError ? "Remove from list" : "Cancel upload"}
          >
            <Trash2
              size={16}
              className="text-[#EC221F] group-hover/btn:scale-110 transition-transform"
            />
          </button>
        </div>
      </div>
    </li>
  );
}

function formatRole(role: string): string {
  const normalized = role.toLowerCase().trim();
  if (normalized === "featured" || normalized === "featured-artist" || normalized === "feature")
    return "Feature";
  if (normalized === "primary-artist" || normalized === "primary") return "Primary Artist";
  if (normalized === "main-artist" || normalized === "main_artist") return "Main Primary Artist";
  if (normalized === "art-director" || normalized === "art_director") return "Art Director";
  if (normalized === "composer-lyricist") return "Composer & Lyricist";
  return role
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function ContributorRow({
  person,
  roleLabel,
  avatarShape = "circle",
  onRemove,
}: {
  person: TrackCreditItem | ReleaseTrackPerson;
  roleLabel?: string;
  avatarShape?: "square" | "circle";
  onRemove: () => void;
}) {
  const displayRole =
    roleLabel ||
    ("role" in person && person.role ? formatRole(person.role) : null) ||
    ("roles" in person && Array.isArray(person.roles) && person.roles.length > 0
      ? person.roles.map((r) => formatRole(r)).join(", ")
      : "Contributor");

  const displayName =
    person.display_name ||
    person.stage_name ||
    person.official_name ||
    ("name" in person ? person.name : "") ||
    "";
  const avatarUrl = person.image_url || person.avatar_url;

  return (
    <div className="flex items-center justify-between gap-3 p-5">
      <div className="flex items-center gap-3 min-w-0">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={displayName}
            width={42}
            height={42}
            unoptimized={typeof avatarUrl === "string" && avatarUrl.startsWith("http")}
            className={cn(
              "size-10.5 object-cover shrink-0",
              avatarShape === "square" ? "rounded-xl" : "rounded-full",
            )}
          />
        ) : (
          <div
            className={cn(
              "size-10.5 bg-neutral-200/70 flex items-center justify-center shrink-0 text-neutral-400",
              avatarShape === "square" ? "rounded-xl" : "rounded-full",
            )}
          >
            <UserSharing size={19.8} />
          </div>
        )}
        <div className="flex flex-col min-w-0">
          <span className="font-medium truncate">{displayName}</span>
          <span className="text-xs text-border-default-secondary truncate">{displayRole}</span>
        </div>
      </div>
      <Button type="button" onClick={onRemove} variant="white-outline" size="sm">
        Remove
      </Button>
    </div>
  );
}

function TrackEditPanel({
  track,
  trackIndex,
  releaseReference,
  meta,
  onSave,
  onDelete,
}: {
  track: ReleaseTrack;
  trackIndex: number;
  releaseReference: string;
  meta?: {
    genres: (Genre & { sub_genres: Genre[] })[];
    languages: Language[];
    contributors?: ContributorGroup[];
    publishingTypes: PublishingType[];
  };
  onSave: (updatedTrack: ReleaseTrack) => Promise<void> | void;
  onDelete: () => void;
}) {
  const [localForm, setLocalForm] = useState<ReleaseTrack>(() => ({
    ...track,
    people: track.people || EMPTY_PEOPLE,
  }));
  const [isSaving, setIsSaving] = useState(false);

  // Modal open states
  const [selectArtistModalOpen, setSelectArtistModalOpen] = useState(false);
  const [selectArtistContext, setSelectArtistContext] = useState<"main" | "key">("main");
  const [addNonLabelModalOpen, setAddNonLabelModalOpen] = useState(false);
  const [addProducerModalOpen, setAddProducerModalOpen] = useState(false);
  const [addWriterModalOpen, setAddWriterModalOpen] = useState(false);
  const [enterIsrcModalOpen, setEnterIsrcModalOpen] = useState(false);
  const [uploadLicenseModalOpen, setUploadLicenseModalOpen] = useState(false);

  useEffect(() => {
    setLocalForm({
      ...track,
      people: track.people || EMPTY_PEOPLE,
    });
  }, [track]);

  const keyArtistRoles = useMemo(
    () => meta?.contributors?.find((g) => g.group === "artist_credit")?.roles || [],
    [meta?.contributors],
  );
  const producerRoles = useMemo(
    () => meta?.contributors?.find((g) => g.group === "production")?.roles || [],
    [meta?.contributors],
  );
  const writerRoles = useMemo(
    () => meta?.contributors?.find((g) => g.group === "writing")?.roles || [],
    [meta?.contributors],
  );

  const activeMainGenre = useMemo(
    () => meta?.genres?.find((g) => g.slug === localForm.primary_genre),
    [meta?.genres, localForm.primary_genre],
  );

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(localForm);
    } catch {
      // Error is handled in onSave (toasts displayed, panel remains open)
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (key: keyof ReleaseTrack, value: unknown) => {
    setLocalForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePrimaryGenreChange = (newSlug: string) => {
    setLocalForm((prev) => ({
      ...prev,
      primary_genre: newSlug,
      secondary_genre: null,
    }));
  };

  const handleRemovePerson = (
    category: "main" | "key_artist" | "engineer" | "writer",
    personRef: string,
  ) => {
    setLocalForm((prev) => {
      const cur = prev.people || EMPTY_PEOPLE;
      const targetList = (cur[category] || []) as TrackCreditItem[];
      return {
        ...prev,
        people: {
          ...cur,
          [category]: targetList.filter((p) => (p.reference || p.artist_reference) !== personRef),
        },
      };
    });
  };

  const handleConfirmRosterArtist = (artistData: SelectedArtistData) => {
    const isMain = selectArtistContext === "main";
    const currentPeople = localForm.people || EMPTY_PEOPLE;

    if (isMain && (currentPeople.main || []).length >= 1) {
      goeyToast.error("Only one main primary artist allowed");
      return;
    }

    const assignedRole = artistData.role || (isMain ? "primary-artist" : "featuring-artist");

    const newPerson: TrackCreditItem = {
      artist_reference: artistData.reference || null,
      stage_name: artistData.stage_name || artistData.name,
      official_name: artistData.name,
      avatar_url: artistData.avatar_url || null,
      image_url: artistData.avatar_url || null,
      spotify_url: artistData.spotify_id || artistData.spotify_url || null,
      apple_music_url: artistData.apple_music_id || artistData.apple_music_url || null,
      spotify_id: artistData.spotify_id,
      apple_music_id: artistData.apple_music_id,
      role: assignedRole,
      is_main_artist: isMain,
    };

    setLocalForm((prev) => {
      const cur = prev.people || EMPTY_PEOPLE;
      const targetCategory = isMain ? "main" : "key_artist";
      const existingList = (cur[targetCategory] || []) as TrackCreditItem[];
      return {
        ...prev,
        people: {
          ...cur,
          [targetCategory]: [...existingList, newPerson],
        },
      };
    });

    goeyToast.success(`${newPerson.stage_name} added as ${formatRole(assignedRole)}`);
  };

  const handleAddNonLabelArtist = (data: NonLabelArtistData) => {
    const newPerson: TrackCreditItem = {
      reference: `person_${nanoid(8)}`,
      stage_name: data.stage_name,
      official_name: data.stage_name,
      genre: data.genre,
      language: data.language,
      role: data.role,
      spotify_url: data.spotify_id || null,
      apple_music_url: data.apple_music_id || null,
      is_main_artist: false,
    };

    setLocalForm((prev) => {
      const cur = prev.people || EMPTY_PEOPLE;
      return {
        ...prev,
        people: {
          ...cur,
          key_artist: [...(cur.key_artist || []), newPerson],
        },
      };
    });
  };

  const handleAddProducerEngineer = (data: ProducerEngineerData) => {
    const newPerson: TrackCreditItem = {
      reference: `person_${nanoid(8)}`,
      display_name: data.name,
      official_name: data.name,
      stage_name: data.name,
      role: data.role,
      spotify_url: data.spotify_id || null,
      apple_music_url: data.apple_music_id || null,
      spotify_id: data.spotify_id,
      apple_music_id: data.apple_music_id,
    };

    setLocalForm((prev) => {
      const cur = prev.people || EMPTY_PEOPLE;
      return {
        ...prev,
        people: {
          ...cur,
          engineer: [...(cur.engineer || []), newPerson],
        },
      };
    });
  };

  const handleAddWriterPublisher = (data: WriterPublisherData) => {
    const newPerson: TrackCreditItem = {
      reference: `person_${nanoid(8)}`,
      display_name: data.name,
      official_name: data.name,
      stage_name: data.name,
      role: data.role,
      publishing: data.publishing_type,
      publishing_type: data.publishing_type,
    };

    setLocalForm((prev) => {
      const cur = prev.people || EMPTY_PEOPLE;
      return {
        ...prev,
        people: {
          ...cur,
          writer: [...(cur.writer || []), newPerson],
        },
      };
    });
  };

  const handleIsrcConfirm = (isrcCode: string) => {
    setLocalForm((prev) => ({
      ...prev,
      isrc: isrcCode,
      is_online: true,
    }));
  };

  const handleLicenseUploadSuccess = (url: string) => {
    setLocalForm((prev) => ({
      ...prev,
      has_license: true,
      license_url: url,
    }));
  };

  const currentCredits = localForm.people || EMPTY_PEOPLE;
  const mainArtists = currentCredits.main || [];
  const keyArtists = currentCredits.key_artist || [];
  const producerEngineers = currentCredits.engineer || [];
  const writersPublishers = currentCredits.writer || [];

  return (
    <div className="rounded-30 p-6 md:p-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-medium text-default">Edit Track Meta Data</h3>
        <button onClick={onDelete} title="Delete track" className="cursor-pointer">
          <Trash2 size={16} className="text-danger-default hover:scale-110 transition-transform" />
        </button>
      </div>

      <div className="py-6 flex flex-col gap-2">
        <h2 className="text-2xl font-semibold font-heading text-default truncate">
          {localForm.title || "Untitled"}
        </h2>
        <p className="text-border-default-secondary font-medium truncate">
          {localForm.audio_url
            ? localForm.audio_url.split("/").pop()?.split("?")[0] || "Audio file"
            : "Audio file"}
        </p>
      </div>

      <div className="bg-white rounded-30 @container">
        {/* Track File Card */}
        <div className="flex items-center gap-4 p-4 border-b border-b-default-default/15 bg-page-background/20">
          <div className="size-10.5 rounded-full bg-brand-purple/12 flex items-center justify-center flex-none">
            <Music size={26} className="text-brand-purple" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-default truncate">
              {localForm.title || "Tomorrow's People"}
            </span>
            <span className="text-xs text-border-default-secondary">Track {trackIndex + 1}</span>
          </div>
        </div>

        <div className="px-6 py-5 flex flex-col gap-6">
          {/* Track Info */}
          <div className="flex flex-col gap-4">
            <h4 className="font-medium text-border-default-secondary">Track Info</h4>

            <div className="p-4 bg-page-background/70 rounded-30 flex flex-col gap-4">
              {/* Track Title */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-default">Track Title</label>
                <input
                  type="text"
                  value={localForm.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter track title"
                  className="w-full bg-white rounded-xl border border-default-default px-4 py-3 text-sm leading-none font-medium outline-none focus:border-brand-orange transition-colors"
                />
              </div>

              {/* Primary & Secondary Genre */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-default">Primary Genre</label>
                  <Select
                    value={localForm.primary_genre || ""}
                    onValueChange={handlePrimaryGenreChange}
                  >
                    <SelectTrigger className="w-full bg-white h-auto rounded-xl border border-default-default px-4 py-3 text-sm leading-none text-default font-medium outline-none focus:border-brand-orange transition-colors">
                      <SelectValue placeholder="Select a genre (Pop, Rock, Country etc.)" />
                    </SelectTrigger>
                    <SelectContent>
                      {meta?.genres?.map((g) => (
                        <SelectItem key={g.slug} value={g.slug}>
                          {g.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-default">Secondary Genre</label>
                  <Select
                    value={localForm.secondary_genre || ""}
                    onValueChange={(val) => handleInputChange("secondary_genre", val)}
                    disabled={!activeMainGenre || !activeMainGenre.sub_genres?.length}
                  >
                    <SelectTrigger className="w-full bg-white h-auto rounded-xl border border-default-default px-4 py-3 text-sm leading-none text-default font-medium outline-none focus:border-brand-orange transition-colors disabled:bg-page-background/50 disabled:text-border-default-secondary">
                      <SelectValue
                        placeholder={
                          activeMainGenre
                            ? activeMainGenre.sub_genres?.length
                              ? "Select a genre (Pop, Rock, Country etc.)"
                              : "No sub-genres available"
                            : "Select primary genre first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {activeMainGenre?.sub_genres?.map((sub) => (
                        <SelectItem key={sub.slug} value={sub.slug}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Track Language */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-default">Track Language</label>
                <Select
                  value={localForm.language || ""}
                  onValueChange={(val) => handleInputChange("language", val)}
                >
                  <SelectTrigger className="w-full bg-white h-auto rounded-xl border border-default-default px-4 py-3 text-sm leading-none text-default font-medium outline-none focus:border-brand-orange transition-colors">
                    <SelectValue placeholder="Select language (English, French, Spanish etc.)" />
                  </SelectTrigger>
                  <SelectContent>
                    {meta?.languages?.map((lang) => (
                      <SelectItem key={lang.slug} value={lang.slug}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preview Clip Start Time */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-default">
                  Preview/Clip Start Time (mm:ss)
                </label>
                <input
                  type="text"
                  value={localForm.preview_clip || ""}
                  onChange={(e) => handleInputChange("preview_clip", e.target.value)}
                  placeholder="00:00"
                  className="w-full bg-white rounded-xl border border-default-default px-4 py-3 text-sm leading-none font-medium outline-none focus:border-brand-orange transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Track Artist Section */}
          <div className="flex flex-col gap-4">
            <h4 className="font-medium text-border-default-secondary">Track Artist</h4>

            {/* 1. Main Primary Artist */}
            <div className="p-4 bg-page-background/70 rounded-30 flex flex-col gap-4">
              <h5 className="font-medium text-border-default-secondary">Main Primary Artist</h5>
              <div className="flex flex-col @2xl:flex-row @2xl:items-center justify-between gap-4 p-4 rounded-2xl bg-page-background/70 border border-default-default">
                <div className="flex items-center gap-3">
                  <div className="size-10.5 rounded-10 bg-brand-purple/12 flex items-center justify-center flex-none">
                    <Star size={26.25} className="text-[#6500E9]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h6 className="font-medium text-sm text-default">Add main primary artist</h6>
                    <p className="text-xs font-medium text-border-default-secondary">
                      This is the name your music appears under on Spotify, Apple Music and other
                      stores.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-none">
                  <Button
                    type="button"
                    size="sm"
                    disabled={mainArtists.length >= 1}
                    onClick={() => {
                      setSelectArtistContext("main");
                      setSelectArtistModalOpen(true);
                    }}
                    className="rounded-xl px-4 py-3 text-xs font-medium bg-[#6500E9] hover:bg-brand-purple/90 text-white flex items-center gap-2.5 cursor-pointer"
                  >
                    <span>Select your artist</span>
                    <Plus size={24} />
                  </Button>
                </div>
              </div>

              {mainArtists.map((person, index) => (
                <ContributorRow
                  key={`main_${person.reference || person.artist_reference || index}`}
                  person={person}
                  avatarShape="square"
                  onRemove={() =>
                    handleRemovePerson("main", person.reference || person.artist_reference || "")
                  }
                />
              ))}
            </div>

            {/* 2. Key Artists */}
            <div className="p-4 bg-page-background/70 rounded-30 flex flex-col gap-4">
              <h5 className="font-medium text-border-default-secondary">Key Artists</h5>
              <div className="flex flex-col @2xl:flex-row @2xl:items-center justify-between gap-4 p-4 rounded-2xl bg-page-background/70 border border-default-default">
                <div className="flex items-center gap-3">
                  <div className="size-10.5 rounded-10 bg-[#FFE8D9] flex items-center justify-center flex-none">
                    <Award size={26.25} className="text-[#FF5B00]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h6 className="font-medium text-sm text-default">Add key artists</h6>
                    <p className="text-xs font-medium text-border-default-secondary">
                      Select key artists from your record label or add key artists outside your
                      record label.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-none">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      setSelectArtistContext("key");
                      setSelectArtistModalOpen(true);
                    }}
                    className="rounded-xl px-4 py-3 text-xs font-medium bg-[#6500E9] hover:bg-brand-purple/90 text-white flex items-center gap-2.5 cursor-pointer"
                  >
                    <span>Select your artist</span>
                    <Plus size={24} />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAddNonLabelModalOpen(true)}
                    className="rounded-xl px-4 py-3 text-xs font-medium outline outline-neutral-default text-default hover:bg-page-background flex items-center gap-2.5 cursor-pointer"
                  >
                    <span>Add non-label artist</span>
                    <Plus size={24} />
                  </Button>
                </div>
              </div>

              {keyArtists.map((person, index) => (
                <ContributorRow
                  key={`key_${person.reference || person.artist_reference || index}`}
                  person={person}
                  avatarShape="circle"
                  onRemove={() =>
                    handleRemovePerson(
                      "key_artist",
                      person.reference || person.artist_reference || "",
                    )
                  }
                />
              ))}
            </div>

            {/* 3. Producer & Engineer Credits */}
            <div className="p-4 bg-page-background/70 rounded-30 flex flex-col gap-4">
              <h5 className="font-medium text-border-default-secondary">
                Producer & Engineer Credits
              </h5>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-page-background/70 border border-default-default">
                <div className="flex items-center gap-3">
                  <div className="size-10.5 rounded-10 bg-[#DBECFE] flex items-center justify-center flex-none">
                    <Headphones size={26.25} className="text-[#1E75FF]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h6 className="font-medium text-sm text-default">
                      Add producer and engineer credit
                    </h6>
                    <p className="text-xs font-medium text-border-default-secondary">
                      Include producer and engineer credit for this release
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAddProducerModalOpen(true)}
                  className="rounded-xl px-4 py-3 text-xs font-medium outline outline-neutral-default text-default hover:bg-page-background flex items-center gap-2.5 cursor-pointer flex-none"
                >
                  <span>Add</span>
                  <Plus size={24} />
                </Button>
              </div>

              {producerEngineers.map((person, index) => (
                <ContributorRow
                  key={`engineer_${person.reference || person.artist_reference || index}`}
                  person={person}
                  avatarShape="circle"
                  onRemove={() =>
                    handleRemovePerson(
                      "engineer",
                      person.reference || person.artist_reference || "",
                    )
                  }
                />
              ))}
            </div>

            {/* 4. Writers & Publishers */}
            <div className="p-4 bg-page-background/70 rounded-30 flex flex-col gap-4">
              <h5 className="font-medium text-border-default-secondary">Writers & Publishers</h5>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-page-background/70 border border-default-default">
                <div className="flex items-center gap-3">
                  <div className="size-10.5 rounded-10 bg-brand-purple/12 flex items-center justify-center flex-none">
                    <PenLine size={26.25} className="text-black" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h6 className="font-medium text-sm text-default">Add writers and publishers</h6>
                    <p className="text-xs font-medium text-border-default-secondary">
                      Include the writer or the publisher for this track
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAddWriterModalOpen(true)}
                  className="rounded-xl px-4 py-3 text-xs font-medium outline outline-neutral-default text-default hover:bg-page-background flex items-center gap-2.5 cursor-pointer flex-none"
                >
                  <span>Add</span>
                  <Plus size={24} />
                </Button>
              </div>

              {writersPublishers.map((person, index) => (
                <ContributorRow
                  key={`writer_${person.reference || person.artist_reference || index}`}
                  person={person}
                  avatarShape="circle"
                  onRemove={() =>
                    handleRemovePerson("writer", person.reference || person.artist_reference || "")
                  }
                />
              ))}
            </div>
          </div>

          {/* Track Lyrics */}
          <div className="flex flex-col gap-2">
            <h4 className="font-medium text-default text-xs">Track Lyrics (Optional)</h4>
            <div className="flex flex-col gap-2 rounded-md border border-default-default bg-white p-4">
              <textarea
                value={localForm.lyrics || ""}
                rows={3}
                placeholder="Write or paste track lyrics here"
                onChange={(e) => handleInputChange("lyrics", e.target.value)}
                className="w-full resize-none text-sm text-default border-b border-default-default/15 focus:border-brand-orange transition-colors font-medium outline-none pb-3 placeholder:text-[#8E8E93]"
              />
              <div className="flex items-center gap-2 text-xs text-[#8E8E93] pt-1">
                <Icon name="info-square" size={16} />
                <span>lyrics are not publicly visible</span>
              </div>
            </div>
          </div>

          {/* Rights & Label */}
          <div className="flex flex-col gap-4">
            {/* © - Master Rights Owner */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-default">© - Master Rights Owner</label>
              <input
                type="text"
                value={localForm.master_owner || ""}
                onChange={(e) => handleInputChange("master_owner", e.target.value)}
                placeholder="Enter track right owner"
                className="w-full bg-white rounded-xl border border-default-default px-4 py-3 text-sm leading-none font-medium outline-none focus:border-brand-orange transition-colors"
              />
            </div>

            {/* Music Label */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-default">Music Label</label>
              <input
                type="text"
                value={localForm.label || ""}
                onChange={(e) => handleInputChange("label", e.target.value)}
                placeholder="Enter record label"
                className="w-full bg-white rounded-xl border border-default-default px-4 py-3 text-sm leading-none font-medium outline-none focus:border-brand-orange transition-colors"
              />
            </div>
          </div>

          {/* Checkboxes / Switches */}
          <div className="flex flex-col gap-3.5 pt-1">
            {/* Parental Advisory */}
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <span className="font-medium text-sm text-default">
                Does this track require a Parental Advisory ?
              </span>
              <button
                type="button"
                onClick={() => handleInputChange("has_advisory", !localForm.has_advisory)}
                className={cn(
                  "size-5 rounded-full flex items-center justify-center transition-colors cursor-pointer",
                  localForm.has_advisory
                    ? "bg-[#0066FF] text-white"
                    : "border-2 border-black/60 text-transparent hover:border-black",
                )}
              >
                <Check size={12} />
              </button>
            </div>

            {/* Already Online */}
            <div className="flex items-center justify-between sm:justify-start gap-3 flex-wrap">
              <span className="font-medium text-sm text-default">
                Is this track already online ?
              </span>
              <button
                type="button"
                onClick={() => {
                  if (localForm.is_online) {
                    setLocalForm((prev) => ({
                      ...prev,
                      is_online: false,
                      isrc: null,
                    }));
                  } else {
                    setEnterIsrcModalOpen(true);
                  }
                }}
                className={cn(
                  "size-5 rounded-full flex items-center justify-center transition-colors cursor-pointer",
                  localForm.is_online
                    ? "bg-[#0066FF] text-white"
                    : "border-2 border-black/60 text-transparent hover:border-black",
                )}
              >
                <Check size={12} />
              </button>
              {localForm.is_online && localForm.isrc && (
                <span className="text-xs font-mono font-medium text-brand-blue bg-[#DBECFE]/70 px-2.5 py-0.5 rounded-full border border-brand-blue/20">
                  ISRC: {localForm.isrc}
                </span>
              )}
            </div>

            {/* Licensing Document */}
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <span className="font-medium text-sm text-default">Add Licensing Document</span>
              <button
                type="button"
                onClick={() => {
                  if (localForm.has_license) {
                    // Delete on server in background
                    api
                      .delete(
                        API_ROUTES.RELEASES.DRAFT.TRACKS.LICENSE(
                          releaseReference,
                          localForm.reference,
                        ),
                      )
                      .catch(() => null);

                    setLocalForm((prev) => ({
                      ...prev,
                      has_license: false,
                      license_url: null,
                    }));

                    // Show the modal again per specifications
                    setUploadLicenseModalOpen(true);
                  } else {
                    setUploadLicenseModalOpen(true);
                  }
                }}
                className={cn(
                  "size-5 rounded-full flex items-center justify-center transition-colors cursor-pointer",
                  localForm.has_license
                    ? "bg-[#0066FF] text-white"
                    : "border-2 border-black/60 text-transparent hover:border-black",
                )}
              >
                <Check size={12} />
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="w-fit rounded-full px-5 py-2.5 text-xs font-medium bg-brand-blue hover:bg-brand-blue/80 text-white flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSaving ? (
                <>
                  <span>Saving...</span>
                  <Loader2 size={24} className="animate-spin" />
                </>
              ) : (
                <>
                  <span>Save</span>
                  <Check size={24} />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Modals for Track Contributors & Metadata */}
      <SelectArtistModal
        open={selectArtistModalOpen}
        onOpenChange={setSelectArtistModalOpen}
        title={selectArtistContext === "main" ? "Select Main Artist" : "Select Key Artist"}
        roles={keyArtistRoles}
        addedArtistIds={[...mainArtists, ...keyArtists]
          .map((p) => p.artist_reference || p.reference || "")
          .filter(Boolean)}
        onConfirmArtist={handleConfirmRosterArtist}
      />

      <AddNonLabelArtistModal
        open={addNonLabelModalOpen}
        onOpenChange={setAddNonLabelModalOpen}
        genres={meta?.genres?.map((g) => ({ slug: g.slug, name: g.name })) || []}
        languages={meta?.languages?.map((l) => ({ slug: l.slug, name: l.name })) || []}
        roles={keyArtistRoles}
        onAdd={handleAddNonLabelArtist}
      />

      <AddProducerEngineerModal
        open={addProducerModalOpen}
        onOpenChange={setAddProducerModalOpen}
        roles={producerRoles}
        onAdd={handleAddProducerEngineer}
      />

      <AddWritersPublishersModal
        open={addWriterModalOpen}
        onOpenChange={setAddWriterModalOpen}
        roles={writerRoles}
        publishingTypes={meta?.publishingTypes || []}
        onAdd={handleAddWriterPublisher}
      />

      <EnterIsrcModal
        open={enterIsrcModalOpen}
        onOpenChange={setEnterIsrcModalOpen}
        initialValue={localForm.isrc || ""}
        onConfirm={handleIsrcConfirm}
      />

      <UploadLicenseModal
        open={uploadLicenseModalOpen}
        onOpenChange={setUploadLicenseModalOpen}
        releaseReference={releaseReference}
        trackReference={localForm.reference}
        onUploadSuccess={handleLicenseUploadSuccess}
      />
    </div>
  );
}
