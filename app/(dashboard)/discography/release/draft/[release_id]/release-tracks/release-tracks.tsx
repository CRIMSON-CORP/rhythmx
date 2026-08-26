"use client";

import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import useNewReleaseStore from "@/store/new-release-store";
import React, { useRef, useState, Suspense, use } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { goeyToast } from "goey-toast";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VisuallyHidden } from "radix-ui";
import { artists } from "@/data/artists";
import { releaseGenre } from "@/data/release-genre";
import { releaseLanguage } from "@/data/release-language-dropdown";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Folder,
  List,
  Music,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

const promiseCache = new Map<string, Promise<Artist[]>>();

function getArtistsPromise(query: string) {
  const cacheKey = query.trim().toLowerCase();
  if (!promiseCache.has(cacheKey)) {
    const promise = new Promise<Artist[]>((resolve) => {
      setTimeout(() => {
        const filtered = artists.filter(
          (a) =>
            a.name.toLowerCase().includes(cacheKey) || a.location.toLowerCase().includes(cacheKey),
        );
        resolve(filtered);
      }, 1500);
    });
    promiseCache.set(cacheKey, promise);
  }
  return promiseCache.get(cacheKey)!;
}

const getAudioDuration = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const audio = new Audio(objectUrl);

    const timeout = setTimeout(() => {
      resolve("3:30");
    }, 2000);

    audio.addEventListener("loadedmetadata", () => {
      clearTimeout(timeout);
      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.floor(audio.duration % 60);
      const formatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;
      URL.revokeObjectURL(objectUrl);
      resolve(formatted);
    });

    audio.addEventListener("error", () => {
      clearTimeout(timeout);
      URL.revokeObjectURL(objectUrl);
      resolve("3:30");
    });
  });
};

function ReleaseTracks(props: { tracks: ReleaseTrack[] }) {
  const [tracks, setTracks] = useState<ReleaseTrack[]>(props.tracks);
  const { form, setForm, next } = useNewReleaseStore();
  const [isDraggingAudio, setIsDraggingAudio] = useState(false);
  const [editingTrackId, setEditingTrackId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterAudio = useRef(0);

  const handleAudioDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounterAudio.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDraggingAudio(true);
    }
  };

  const handleAudioDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleAudioDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounterAudio.current--;
    if (dragCounterAudio.current === 0) {
      setIsDraggingAudio(false);
    }
  };

  const handleAudioDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounterAudio.current = 0;
    setIsDraggingAudio(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleAudioFiles(files);
    }
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleAudioFiles(files);
    }
  };

  const simulateAudioUpload = (trackId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 8;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        // Update track status to uploaded
        setForm({
          tracks: (useNewReleaseStore.getState().form.tracks || []).map((t) =>
            t.id === trackId
              ? { ...t, upload_progress: 100, is_uploaded: true, is_uploading: false }
              : t,
          ),
        });
        goeyToast.success("Upload Completed", {
          description: "Track has been uploaded successfully",
          duration: 1000,
        });
      } else {
        // Update track progress
        setForm({
          tracks: (useNewReleaseStore.getState().form.tracks || []).map((t) =>
            t.id === trackId ? { ...t, upload_progress: progress } : t,
          ),
        });
      }
    }, 400);
  };

  const handleAudioFiles = async (files: FileList) => {
    const newTracksList: Track[] = [...(form.tracks || [])];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isAudio =
        file.type.startsWith("audio/") ||
        file.name.endsWith(".mp3") ||
        file.name.endsWith(".wav") ||
        file.name.endsWith(".aac") ||
        file.name.endsWith(".m4a");

      if (!isAudio) {
        goeyToast.error("Invalid File Type", {
          description: `"${file.name}" is not a supported audio file format.`,
        });
        continue;
      }

      const id = "track_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now();
      const track_title = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;

      let track_duration = "3:30";
      try {
        track_duration = await getAudioDuration(file);
      } catch (e) {
        console.error("Duration extraction failed:", e);
      }

      const newTrack: Track = {
        id,
        track_title,
        track_duration,
        track_file: file,
        track_audio_preview: URL.createObjectURL(file),
        track_remote_url: null,
        is_uploaded: false,
        upload_progress: 0,
        is_uploading: true,
        primary_genre: form.genre || "",
        language: form.language || "",
        preview_start_time: "00:00",
        main_artists: [],
        featured_artists: [],
        producer_credits: [],
        lyrics: "",
        master_rights_owner: "",
        record_label: form.record_label || "",
        parental_advisory: false,
        already_online: false,
        licensing_document: false,
      };

      newTracksList.push(newTrack);
      simulateAudioUpload(id);
    }

    setForm({ tracks: newTracksList });
  };

  const handleStartEdit = (track: Track) => {
    setEditingTrackId(track.id);
  };

  const handleSaveTrackDetails = (updatedTrack: Track) => {
    setForm({
      tracks: tracks.map((t) => (t.id === updatedTrack.id ? updatedTrack : t)),
    });
    goeyToast.success("Track details saved!");
    setEditingTrackId(null);
  };

  const handleDeleteTrack = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const trackToDelete = tracks.find((t) => t.id === trackId);
    if (trackToDelete?.track_audio_preview) {
      URL.revokeObjectURL(trackToDelete.track_audio_preview);
    }
    setForm({
      tracks: tracks.filter((t) => t.id !== trackId),
    });
    if (editingTrackId === trackId) {
      setEditingTrackId(null);
    }
    goeyToast.success("Track removed");
  };

  const isTracksValid = tracks.length > 0 && tracks.every((track) => track.is_uploaded);
  const isStepValid = isTracksValid;

  const handleContinue = () => {
    if (isStepValid) {
      next();
    } else {
      if (tracks.length === 0) {
        goeyToast.error("Tracks Required", {
          description: "Please upload at least one audio track to continue",
        });
      } else if (!tracks.every((track) => track.is_uploaded)) {
        goeyToast.error("Upload in Progress", {
          description: "Please wait for all tracks to finish uploading",
        });
      } else {
        goeyToast.error("All Fields are required", {
          description: "Please fill in all release details to continue",
        });
      }
    }
  };

  const editingTrack = tracks.find((t) => t.id === editingTrackId) || null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[0.55fr_0.45fr] gap-8 items-stretch pb-10">
      {/* Left Column: Form Fields Card */}
      <div className="flex flex-col gap-4">
        <div
          onDragEnter={handleAudioDragEnter}
          onDragOver={handleAudioDragOver}
          onDragLeave={handleAudioDragLeave}
          onDrop={handleAudioDrop}
          className={cn(
            "flex flex-col gap-8 px-5 py-17 bg-white rounded-30 justify-center items-center transition-all border-2 border-dashed border-transparent",
            isDraggingAudio && "border-brand-orange bg-brand-orange/5",
          )}
        >
          <div className="flex items-center gap-8">
            <Image src="/images/headphone.png" alt="headphones" width={50} height={50} />
            <div className="flex flex-col gap-3 font-medium text-lg leading-none">
              <p>Drag Audio file here</p>
              <p>Mp3, ACC or Wav</p>
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
            accept="audio/*,.mp3,.wav,.aac,.m4a"
            className="hidden"
            ref={fileInputRef}
            onChange={handleAudioFileChange}
            multiple
          />
        </div>

        <p className="font-medium text-border-default-secondary">Tracks Added</p>
        <div className="flex flex-col bg-white rounded-30 overflow-hidden divide-y divide-default-default">
          {tracks.length === 0 ? (
            <div className="p-8 text-center text-border-default-secondary font-medium text-sm">
              No tracks uploaded yet.
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-default-default">
              {tracks.map((track, index) => (
                <TrackItem
                  key={track.id}
                  track={track}
                  index={index}
                  isSelected={editingTrackId === track.id}
                  onEdit={() => handleStartEdit(track)}
                  onDelete={(e) => handleDeleteTrack(track.id, e)}
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
      <div className="relative isolate bg-white rounded-30 min-h-125 overflow-hidden">
        <div className="absolute w-full top-0 left right-0 h-1/3 bg-linear-to-r from-[#9747FF]/50 to-[#0066FF]/50 -z-10 opacity-25 blur-3xl"></div>
        {editingTrack ? (
          <TrackEditPanel
            track={editingTrack}
            trackIndex={tracks.findIndex((t) => t.id === editingTrackId)}
            onSave={handleSaveTrackDetails}
            onDelete={() => {
              if (editingTrackId) {
                const dummyEvent = { stopPropagation: () => {} } as React.MouseEvent;
                handleDeleteTrack(editingTrackId, dummyEvent);
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
  onEdit,
  onDelete,
}: {
  track: Track;
  index: number;
  isSelected: boolean;
  onEdit: () => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  const { track_title, is_uploaded, upload_progress, is_uploading } = track;

  return (
    <li
      className={cn(
        "relative flex items-center gap-4 px-6 py-4.5 transition-colors",
        isSelected ? "bg-page-background" : "bg-white hover:bg-page-background/30",
      )}
    >
      {/* Simulated progress indicator */}
      {is_uploading && (
        <div
          style={{
            width: `${upload_progress}%`,
            transition: "width 0.3s ease-out",
          }}
          className="absolute top-0 left-0 h-full bg-[#CFF7D3] opacity-60 z-0 pointer-events-none"
        ></div>
      )}

      {/* Content wrapper to raise it above absolute progress indicator */}
      <div className="relative z-10 flex items-center gap-4 w-full">
        <div className="size-10 rounded-full bg-page-background flex items-center justify-center font-medium text-default flex-none">
          {index + 1}
        </div>
        <div
          className={cn(
            "size-10.5 rounded-full bg-brand-purple/12 flex items-center justify-center flex-none",
            is_uploading ? "bg-white" : "bg-brand-purple/12",
          )}
        >
          <Music size={24} className={is_uploading ? "text-brand-orange" : "text-brand-purple"} />
        </div>
        <div className="flex flex-col grow break-all min-w-0">
          <span className="font-medium text-sm text-default truncate">{track_title}</span>
          <span className="text-[11px] text-border-default-secondary font-medium leading-none mt-1">
            {is_uploaded
              ? "Uploaded"
              : is_uploading
                ? `Uploading... ${upload_progress}%`
                : "Processing..."}
          </span>
        </div>
        <div className="flex items-center gap-3 flex-none">
          {is_uploaded ? (
            <Button
              variant="outline"
              onClick={onEdit}
              className={cn(
                "rounded-full px-4 py-3 h-auto transition-colors",
                isSelected
                  ? "bg-default text-white border-transparent hover:bg-default/80"
                  : "bg-transparent text-default border-default-default/20 hover:bg-default-default/5",
              )}
              size="sm"
            >
              Edit Track
            </Button>
          ) : null}
          <button
            onClick={onDelete}
            className="rounded-full group/btn cursor-pointer hover:bg-page-background transition-colors"
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

function TrackEditPanel({
  track,
  trackIndex,
  onSave,
  onDelete,
}: {
  track: Track;
  trackIndex: number;
  onSave: (updatedTrack: Track) => void;
  onDelete: () => void;
}) {
  const [localForm, setLocalForm] = useState<Track>({ ...track });

  const handleInputChange = (key: keyof Track, value: string | boolean | Artist[]) => {
    setLocalForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddArtist = (
    section: "main" | "featured" | "producer" | "writer",
    artist: Artist,
  ) => {
    const currentList =
      section === "main"
        ? localForm.main_artists || []
        : section === "featured"
          ? localForm.featured_artists || []
          : section === "writer"
            ? localForm.writers || []
            : localForm.producer_credits || [];

    if (currentList.some((a) => a.id === artist.id)) return;

    const updatedList = [...currentList, artist];
    handleInputChange(
      section === "main"
        ? "main_artists"
        : section === "featured"
          ? "featured_artists"
          : section === "writer"
            ? "writers"
            : "producer_credits",
      updatedList,
    );
  };

  const handleRemoveArtist = (
    section: "main" | "featured" | "producer" | "writer",
    artistId: string,
  ) => {
    const currentList =
      section === "main"
        ? localForm.main_artists || []
        : section === "featured"
          ? localForm.featured_artists || []
          : section === "writer"
            ? localForm.writers || []
            : localForm.producer_credits || [];

    const updatedList = currentList.filter((a) => a.id !== artistId);
    handleInputChange(
      section === "main"
        ? "main_artists"
        : section === "featured"
          ? "featured_artists"
          : section === "writer"
            ? "writers"
            : "producer_credits",
      updatedList,
    );
  };

  return (
    <div className="rounded-30 p-6 md:p-8 flex flex-col gap-8 max-h-[85vh] overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-default">Edit Track Meta Data</h3>
        <button onClick={onDelete}>
          <Trash2 size={16} className="text-danger-default hover:scale-110 transition-transform" />
        </button>
      </div>

      <div className="py-6 flex flex-col gap-3">
        <h2 className="text-2xl font-bold font-heading text-default truncate">
          {localForm.track_title || "Untitled"}
        </h2>
        <p className="text-border-default-secondary font-medium truncate">
          {localForm.track_file?.name || "Audio file"}
        </p>
      </div>

      <div className="bg-white rounded-20">
        {/* Track File Card */}
        <div className="flex items-center gap-4 p-4 border-b border-b-default-default">
          <div className="size-10.5 rounded-full bg-brand-purple/12 flex items-center justify-center flex-none">
            <Music size={24} className="text-brand-purple" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-medium truncate">
              {localForm.track_title || "Tomorrows People"}
            </span>
            <span className="text-xs text-border-default-secondary">Track {trackIndex + 1}</span>
          </div>
        </div>

        <div className="px-6 py-4 flex flex-col gap-4 ">
          {/* Track Info */}
          <h4 className="font-medium text-border-default-secondary">Track Info</h4>

          <div className="p-5 bg-page-background/70 rounded-20 flex flex-col gap-4">
            {/* Track Title */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-default">Track Title</label>
              <input
                type="text"
                value={localForm.track_title}
                onChange={(e) => handleInputChange("track_title", e.target.value)}
                placeholder="Enter track title"
                className="w-full bg-white rounded-xl border border-default-default px-4 py-3 text-sm font-medium outline-none focus:border-brand-orange transition-colors"
              />
            </div>

            {/* Primary Genre */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-default">Primary Genre</label>
              <Select
                value={localForm.primary_genre || ""}
                onValueChange={(value) => handleInputChange("primary_genre", value)}
              >
                <SelectTrigger className="w-full bg-white h-auto rounded-xl border border-default-default px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-colors">
                  <SelectValue placeholder="Select a genre (Pop, Rock, Country etc.)" />
                </SelectTrigger>
                <SelectContent>
                  {releaseGenre.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Track Language */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-default">Track Language</label>
              <Select
                value={localForm.language || ""}
                onValueChange={(value) => handleInputChange("language", value)}
              >
                <SelectTrigger className="w-full bg-white h-auto rounded-xl border border-default-default px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-colors">
                  <SelectValue placeholder="Select language (English, French, Spanish etc.)" />
                </SelectTrigger>
                <SelectContent>
                  {releaseLanguage.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
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
                value={localForm.preview_start_time || "00:00"}
                onChange={(e) => handleInputChange("preview_start_time", e.target.value)}
                placeholder="00:00"
                className="w-full bg-white rounded-xl border border-default-default px-4 py-3 text-sm font-medium outline-none focus:border-brand-orange transition-colors"
              />
            </div>
          </div>

          {/* Track Artists */}
          <h4 className="font-medium text-border-default-secondary">Track Artist</h4>
          <div className="p-5 bg-page-background/70 rounded-20 flex flex-col gap-4">
            {/* Track Main Artist */}
            <TrackArtistAdder
              sectionType="main"
              addedArtists={localForm.main_artists || []}
              onAddArtist={(artist) => handleAddArtist("main", artist)}
              onRemoveArtist={(id) => handleRemoveArtist("main", id)}
            />

            {/* Feature Artist */}
            <TrackArtistAdder
              sectionType="featured"
              addedArtists={localForm.featured_artists || []}
              onAddArtist={(artist) => handleAddArtist("featured", artist)}
              onRemoveArtist={(id) => handleRemoveArtist("featured", id)}
            />

            {/* Producer & Engineer Credit */}
            <TrackArtistAdder
              sectionType="producer"
              addedArtists={localForm.producer_credits || []}
              onAddArtist={(artist) => handleAddArtist("producer", artist)}
              onRemoveArtist={(id) => handleRemoveArtist("producer", id)}
            />
            {/* Producer & Engineer Credit */}
            <TrackArtistAdder
              sectionType="writer"
              addedArtists={localForm.producer_credits || []}
              onAddArtist={(artist) => handleAddArtist("writer", artist)}
              onRemoveArtist={(id) => handleRemoveArtist("writer", id)}
            />
          </div>

          {/* Track Lyrics */}
          <div className="flex flex-col gap-4 border-b border-default-default/10">
            <h4 className="font-medium text-xs text-default">Track Lyrics (Optional)</h4>
            <div className="flex flex-col gap-2 rounded-xl border border-default-default p-4 text-sm font-medium">
              <textarea
                value={localForm.lyrics || ""}
                rows={4}
                placeholder="Write or paste track lyrics here"
                onChange={(e) => handleInputChange("lyrics", e.target.value)}
                className="w-full resize-none text-sm text-default border-b border-default-default/20 focus:border-brand-orange transition-colors font-medium outline-none pb-2 placeholder:text-[#8E8E93]"
              />
              <div className="flex items-center gap-2 text-xs text-[#8E8E93] mt-2">
                <Icon name="info-square" size={18} />
                <span>lyrics are not publicly visible</span>
              </div>
            </div>
          </div>

          {/* Rights & Label */}
          <div className="flex flex-col gap-4 border-b border-default-default/10">
            {/* © - Master Rights Owner */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-default">© - Master Rights Owner</label>
              <input
                type="text"
                value={localForm.master_rights_owner || ""}
                onChange={(e) => handleInputChange("master_rights_owner", e.target.value)}
                placeholder="Enter track right owner"
                className="w-full bg-white rounded-xl border border-default-default px-4 py-3 text-sm font-medium outline-none focus:border-brand-orange transition-colors"
              />
            </div>

            {/* Music Label */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-default">Music Label</label>
              <input
                type="text"
                value={localForm.record_label || ""}
                onChange={(e) => handleInputChange("record_label", e.target.value)}
                placeholder="Enter record label"
                className="w-full bg-white rounded-xl border border-default-default px-4 py-3 text-sm font-medium outline-none focus:border-brand-orange transition-colors"
              />
            </div>
          </div>

          {/* Checkboxes / Switches */}
          <div className="flex flex-col gap-4">
            {/* Parental Advisory */}
            <div className="flex items-center gap-2.5">
              <span className="font-medium text-sm text-default">
                Does this track require a Parental Advisory?
              </span>
              <button
                onClick={() => handleInputChange("parental_advisory", !localForm.parental_advisory)}
                className={cn(
                  "size-4.5 rounded-full outline outline-default-default flex items-center justify-center transition-colors",
                  localForm.parental_advisory
                    ? "bg-brand-blue outline-brand-blue text-white"
                    : "bg-transparent text-transparent hover:bg-page-background/50",
                )}
              >
                <Check size={14} className="stroke-[2.5]" />
              </button>
            </div>

            {/* Already Online */}
            <div className="flex items-center gap-2.5">
              <span className="font-medium text-sm text-default">
                Is this track already online?
              </span>
              <button
                onClick={() => handleInputChange("already_online", !localForm.already_online)}
                className={cn(
                  "size-4.5 rounded-full outline outline-default-default flex items-center justify-center transition-colors",
                  localForm.already_online
                    ? "bg-brand-blue outline-brand-blue text-white"
                    : "bg-transparent text-transparent hover:bg-page-background/50",
                )}
              >
                <Check size={14} className="stroke-[2.5]" />
              </button>
            </div>

            {/* Licensing Document */}
            <div className="flex items-center gap-2.5">
              <span className="font-medium text-sm text-default">Add Licensing Document</span>
              <button
                onClick={() =>
                  handleInputChange("licensing_document", !localForm.licensing_document)
                }
                className={cn(
                  "size-4.5 rounded-full outline outline-default-default flex items-center justify-center transition-colors",
                  localForm.licensing_document
                    ? "bg-brand-blue outline-brand-blue text-white"
                    : "bg-transparent text-transparent hover:bg-page-background/50",
                )}
              >
                <Check size={14} className="stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="blue"
              onClick={() => onSave(localForm)}
              className="w-fit rounded-full px-6 py-2.5 text-sm font-medium"
            >
              <span>Save</span>
              <Check size={16} className="stroke-[2.5]" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrackArtistAdder({
  sectionType,
  addedArtists,
  onAddArtist,
  onRemoveArtist,
}: {
  sectionType: "main" | "featured" | "producer" | "writer";
  addedArtists: Artist[];
  onAddArtist: (artist: Artist) => void;
  onRemoveArtist: (artistId: string) => void;
}) {
  const [artistName, setArtistName] = useState("");
  const [customInputEnabled, setCustomInputEnabled] = useState(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [spotifyLinked, setSpotifyLinked] = useState(false);
  const [appleLinked, setAppleLinked] = useState(false);

  const handleSaveCustom = () => {
    if (!artistName.trim()) {
      goeyToast.error("Artist Name Required", {
        description: "Please enter a valid legal name",
      });
      return;
    }

    const newArtist: Artist = {
      id: "custom_" + Date.now(),
      name: artistName.trim(),
      location: "Custom Artist",
      image: "",
    };

    onAddArtist(newArtist);

    // Reset fields
    setArtistName("");
    setCustomInputEnabled(false);
    setSpotifyLinked(false);
    setAppleLinked(false);
    goeyToast.success("Custom artist saved successfully");
  };

  const handleSelectArtist = (artist: Artist) => {
    onAddArtist(artist);
    setIsSelectModalOpen(false);
    goeyToast.success(`${artist.name} selected successfully`);
  };

  const labelText =
    sectionType === "main"
      ? "Add Custom Main Artist (if not your label artist)"
      : sectionType === "featured"
        ? "Add Custom Featured Artist"
        : sectionType === "writer"
          ? "Add Writer (if not your label artist)"
          : "Add Custom Producer & Engineer";

  const titleText =
    sectionType === "main"
      ? "Track Main Artist"
      : sectionType === "featured"
        ? "Feature Artist"
        : sectionType === "writer"
          ? "Song Writer"
          : "Producer & Engineer Credit";

  return (
    <div className="flex flex-col gap-4 border-b border-b-default-default pb-6 w-full last:border-b-0">
      <h4 className="font-medium text-border-default-secondary">{titleText}</h4>

      {/* Added artists list */}
      {addedArtists.length > 0 && (
        <ul className="flex flex-col divide-y divide-default-default/5 bg-page-background/20 rounded-20 mb-2">
          {addedArtists.map((artist) => (
            <li key={artist.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {artist.image ? (
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    width={42}
                    height={42}
                    className="size-10.5 rounded-full object-cover border border-default-default/10 shrink-0"
                  />
                ) : (
                  <div className="size-10.5 rounded-full flex items-center justify-center bg-page-background shrink-0">
                    <Icon name="user-sharing" size={27} />
                  </div>
                )}
                <div className="flex flex-col items-start gap-0.5">
                  <span className="font-medium text-sm text-default">{artist.name}</span>
                  <span className="text-border-default-secondary text-xs">
                    {sectionType === "main"
                      ? "Main Artist"
                      : sectionType === "featured"
                        ? "Featured Artist"
                        : "Producer/Engineer"}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => onRemoveArtist(artist.id)}
                className="w-fit rounded-full bg-transparent px-4 py-1.5 h-auto text-xs border-default-default/20 hover:bg-default-default/5"
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}

      {/* Selector Trigger and Custom Inputs */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-default">{labelText}</label>
          <p className="text-xs text-border-default-secondary">
            This is the name your music appears under on Spotify, Apple Music and other stores.
          </p>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              disabled={!customInputEnabled}
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="Enter main artist Legal Name"
              className="grow rounded-xl disabled:bg-default-secondary border border-default-default disabled:text-default-tertiary px-4 py-3 text-sm font-medium outline-none focus:border-brand-orange transition-colors"
            />
            {customInputEnabled && (
              <button
                onClick={handleSaveCustom}
                className="p-3 bg-[#EBFFEE] hover:bg-[#d8fcdb] text-default rounded-xl transition-colors"
              >
                <ChevronRight size={20} className="text-[#009951]" />
              </button>
            )}
          </div>
        </div>

        {/* Switches if custom input enabled */}
        {customInputEnabled && (
          <div className="flex flex-col gap-4 p-4 bg-page-background/20 rounded-20">
            <div className="flex gap-2.5 items-center justify-between w-full">
              <div className="flex gap-2.5 items-center">
                <SpotifyLogo className="size-6" />
                <div className="flex flex-col">
                  <span className="font-medium text-xs text-default">
                    Existing artist on Spotify?
                  </span>
                </div>
              </div>
              <Switch checked={spotifyLinked} onCheckedChange={setSpotifyLinked} />
            </div>
            <div className="flex gap-2.5 items-center justify-between w-full">
              <div className="flex gap-2.5 items-center">
                <AppleMusicLogo className="size-6" />
                <div className="flex flex-col">
                  <span className="font-medium text-xs text-default">
                    Existing artist on Apple Music?
                  </span>
                </div>
              </div>
              <Switch checked={appleLinked} onCheckedChange={setAppleLinked} />
            </div>
          </div>
        )}

        {/* Add More/Select Artist Button */}
        <div className="flex items-center gap-2">
          <SelectArtist
            open={isSelectModalOpen}
            onOpenChange={setIsSelectModalOpen}
            onSelectArtist={handleSelectArtist}
            onAddArtistOutside={() => {
              setIsSelectModalOpen(false);
              setCustomInputEnabled(true);
            }}
            addedArtistIds={addedArtists.map((a) => a.id)}
          />
        </div>
      </div>
    </div>
  );
}

const SpotifyLogo = ({ className }: { className?: string }) => (
  <svg
    width="42"
    height="42"
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

const AppleMusicLogo = ({ className }: { className?: string }) => (
  <svg
    width="42"
    className={className}
    height="42"
    viewBox="0 0 42 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="42" height="42" rx="20" fill="#FF0044" />
    <path
      d="M29.7076 10.5092C29.6094 10.4326 29.4949 10.3794 29.3731 10.3537C29.2512 10.3279 29.125 10.3302 29.0042 10.3605L15.8792 13.6417C15.7017 13.6861 15.5442 13.7885 15.4316 13.9327C15.319 14.0769 15.2578 14.2545 15.2578 14.4375V25.7249C14.5735 25.2677 13.756 25.0523 12.9353 25.1129C12.1145 25.1735 11.3375 25.5066 10.7278 26.0594C10.118 26.6121 9.71046 27.3528 9.56988 28.1637C9.4293 28.9746 9.56374 29.8093 9.95184 30.535C10.3399 31.2608 10.9594 31.836 11.7119 32.1694C12.4644 32.5027 13.3067 32.575 14.105 32.3748C14.9033 32.1746 15.6118 31.7134 16.1179 31.0644C16.624 30.4154 16.8987 29.6159 16.8984 28.7929V15.0783L28.3828 12.2072V22.4437C27.6985 21.9865 26.881 21.771 26.0603 21.8316C25.2395 21.8922 24.4625 22.2254 23.8528 22.7781C23.243 23.3309 22.8355 24.0716 22.6949 24.8825C22.5543 25.6934 22.6887 26.528 23.0768 27.2538C23.4649 27.9795 24.0844 28.5548 24.8369 28.8881C25.5894 29.2214 26.4317 29.2938 27.23 29.0936C28.0283 28.8934 28.7368 28.4321 29.2429 27.7832C29.749 27.1342 30.0237 26.3347 30.0234 25.5117V11.1562C30.0235 11.0314 29.995 10.9083 29.9403 10.7962C29.8856 10.6841 29.806 10.5859 29.7076 10.5092Z"
      fill="white"
    />
  </svg>
);

const SelectArtist = ({
  open,
  onOpenChange,
  onSelectArtist,
  onAddArtistOutside,
  addedArtistIds = [],
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectArtist: (artist: Artist) => void;
  onAddArtistOutside: () => void;
  addedArtistIds?: string[];
}) => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="px-5 py-2.5 rounded-full w-fit bg-transparent border-default-default/20 hover:bg-default-default/5 flex items-center gap-2"
        >
          <span className="font-medium text-xs text-default">Add More</span>
          <Plus size={24} className="text-default" />
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-0 max-w-150 w-full p-0 overflow-hidden" showCloseButton={false}>
        <VisuallyHidden.Root>
          <DialogHeader>
            <DialogTitle>Select Artist</DialogTitle>
            <DialogDescription>Select an artist from the list below.</DialogDescription>
          </DialogHeader>
        </VisuallyHidden.Root>

        <div className="absolute w-full top-0 left-0 right-0 h-40 bg-linear-to-r from-[#9747FF] to-[#FFC107] -z-10 opacity-20 blur-3xl pointer-events-none"></div>

        <header className="px-6 pt-6 pb-2 flex gap-6 items-center">
          <div className="flex items-center grow gap-2.5 px-4 py-3 bg-white/20 rounded-full border border-default-default/10">
            <Search size={16} className="text-default-tertiary" />
            <input placeholder="Search Artist" />
          </div>
          <div className="flex items-center px-4 py-3 gap-2 bg-white rounded-full">
            <button
              onClick={() => setViewMode("grid")}
              className={`${viewMode === "grid" ? "text-default" : "text-border-default-secondary"}`}
            >
              <Icon name="circles-four" size={18} />
            </button>
            <span className="w-px h-4 bg-default-default/20" />
            <button
              onClick={() => setViewMode("list")}
              className={`${viewMode === "list" ? "text-default" : "text-border-default-secondary"}`}
            >
              <List size={18} />
            </button>
          </div>
          <DialogClose className="p-2 rounded-full hover:bg-default-default/10 transition-colors">
            <X size={16} className="text-default" />
          </DialogClose>
        </header>

        <header className="px-8 py-3 border-b border-default-default/5">
          <span className="text-default text-sm font-medium">Select Artist</span>
        </header>

        <div className="relative">
          <div className="max-h-120 min-h-87.5 overflow-y-auto relative pb-20 no-scrollbar">
            <Suspense fallback={viewMode === "grid" ? <GridSkeleton /> : <ListSkeleton />}>
              <ArtistList
                viewMode={viewMode}
                searchQuery={searchQuery}
                onSelectArtist={onSelectArtist}
                addedArtistIds={addedArtistIds}
              />
            </Suspense>
          </div>
          {/* Floating Add artist outside button */}
          <div className="absolute bottom-6 right-6 flex justify-end pointer-events-none">
            <Button
              variant="outline"
              onClick={onAddArtistOutside}
              className="rounded-full pointer-events-auto bg-white hover:bg-[#f5f5f5] shadow-md border-default-default/30"
            >
              Add artist outside
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

function GridSkeleton() {
  return (
    <div className="grid grid-cols-5 gap-y-8 gap-x-6 px-8 py-6">
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-3 animate-pulse">
          <div className="size-20 bg-default-default/10 rounded-full" />
          <div className="h-4 w-16 bg-default-default/10 rounded-sm" />
          <div className="h-3.5 w-12 bg-default-default/10 rounded-sm" />
        </div>
      ))}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-12 gap-y-8 px-8 py-6">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="size-16 bg-default-default/10 rounded-full" />
          <div className="flex flex-col gap-2">
            <div className="h-4 w-24 bg-default-default/10 rounded-sm" />
            <div className="h-3.5 w-16 bg-default-default/10 rounded-sm" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ArtistList({
  viewMode,
  searchQuery,
  onSelectArtist,
  addedArtistIds,
}: {
  viewMode: string;
  searchQuery: string;
  onSelectArtist: (artist: Artist) => void;
  addedArtistIds: string[];
}) {
  const allArtists = use(getArtistsPromise(searchQuery));

  const filtered = allArtists.filter(
    (a) =>
      !addedArtistIds.includes(a.id) &&
      (a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.location.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(95px,1fr))] gap-4 p-6">
        {filtered.map((artist) => (
          <div
            key={artist.id}
            onClick={() => onSelectArtist(artist)}
            className="w-fit flex flex-col items-center text-center gap-1.5 group cursor-pointer"
          >
            <div className="relative size-20 rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-105 border border-default-default/10">
              <Image
                src={artist.image}
                alt={artist.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <p className="font-medium text-sm text-default mt-1.5 leading-none">{artist.name}</p>
            <p className="text-xs text-border-default-secondary font-medium leading-none">
              {artist.location}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-12 gap-y-8 px-8 py-6">
      {filtered.map((artist) => (
        <div
          key={artist.id}
          onClick={() => onSelectArtist(artist)}
          className="flex items-center gap-4 group cursor-pointer"
        >
          <div className="relative size-16 rounded-full overflow-hidden shrink-0 transition-transform duration-300 group-hover:scale-105 border border-default-default/10">
            <Image
              src={artist.image}
              alt={artist.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-medium text-sm text-default leading-none">{artist.name}</p>
            <p className="text-xs text-border-default-secondary font-medium leading-none">
              {artist.location}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
