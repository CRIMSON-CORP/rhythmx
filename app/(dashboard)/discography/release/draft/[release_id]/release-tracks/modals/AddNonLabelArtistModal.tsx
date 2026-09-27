"use client";

import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "radix-ui";
import { X, Check, LinkIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { goeyToast } from "goey-toast";
import ConnectPlatformModal, { type ConnectedProfile } from "./ConnectPlatformModal";
import { type ContributorRoleOption } from "../track-meta-fallbacks";
import SpotifyDark from "@/components/icons/spotify-dark";
import AppleMusicCircle from "@/components/icons/apple-music-circle";
import { Button } from "@/components/ui/button";

export interface NonLabelArtistData {
  stage_name: string;
  genre?: string;
  language?: string;
  role: string;
  spotify_id?: string;
  apple_music_id?: string;
}

interface AddNonLabelArtistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  genres?: Array<{ slug: string; name: string }>;
  languages?: Array<{ slug: string; name: string }>;
  roles?: ContributorRoleOption[];
  onAdd: (artistData: NonLabelArtistData) => void;
}

export function AddNonLabelArtistModal({
  open,
  onOpenChange,
  genres = [],
  languages = [],
  roles = [],
  onAdd,
}: AddNonLabelArtistModalProps) {
  const [stageName, setStageName] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const [spotifyConnection, setSpotifyConnection] = useState<ConnectedProfile | null>(null);
  const [appleConnection, setAppleConnection] = useState<ConnectedProfile | null>(null);

  const [activePlatformModal, setActivePlatformModal] = useState<"spotify" | "apple" | null>(null);

  const resetForm = () => {
    setStageName("");
    setSelectedGenre("");
    setSelectedLanguage("");
    setSelectedRole("");
    setSpotifyConnection(null);
    setAppleConnection(null);
  };

  const handleDone = () => {
    if (!stageName.trim()) {
      goeyToast.error("Artist Name Required", {
        description: "Please enter the artist stage name.",
      });
      return;
    }

    if (!selectedRole) {
      goeyToast.error("Role Required", {
        description: "Please select an artist role.",
      });
      return;
    }

    if (!spotifyConnection || !appleConnection) {
      goeyToast.error("At least one platform connection is required", {
        description: "Please connect at either Apotify or Apple music",
      });
      return;
    }

    onAdd({
      stage_name: stageName.trim(),
      genre: selectedGenre || undefined,
      language: selectedLanguage || undefined,
      role: selectedRole,
      spotify_id: spotifyConnection?.id,
      apple_music_id: appleConnection?.id,
    });

    resetForm();
    onOpenChange(false);
    goeyToast.success("Non-label artist added successfully");
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) resetForm();
          onOpenChange(isOpen);
        }}
      >
        <DialogContent
          className="max-w-150 rounded-30 p-0 overflow-hidden isolate gap-0 border border-default-default/20 shadow-2xl"
          showCloseButton={false}
        >
          <VisuallyHidden.Root>
            <DialogHeader>
              <DialogTitle>Add non-label artist</DialogTitle>
              <DialogDescription>
                Enter information for an artist outside your label
              </DialogDescription>
            </DialogHeader>
          </VisuallyHidden.Root>

          {/* Top subtle glow */}
          <div className="absolute w-full top-0 left-0 right-0 h-28 bg-linear-to-r from-[#9747FF] to-[#FFC107] -z-10 opacity-20 blur-3xl pointer-events-none" />

          {/* Header (Note: Add manual is intentionally excluded per design specs) */}
          <header className="px-6 py-5 flex items-center justify-between border-b border-default-default/10">
            <span className="text-sm font-medium text-default">Add non-label artist</span>
            <DialogClose className="p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer">
              <X size={20} className="text-default" />
            </DialogClose>
          </header>

          <div className="p-6 flex flex-col gap-4">
            {/* Stage Name */}
            <div className="flex flex-col gap-2">
              <label className="text-default">Stage Name</label>
              <input
                type="text"
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                placeholder="Enter artist stage name"
                className="w-full bg-white rounded-lg border border-default-default px-4 py-5 outline-none focus:border-brand-orange transition-colors placeholder:text-border-default-secondary/70"
              />
            </div>

            {/* Genre */}
            <div className="flex flex-col gap-2">
              <label className="text-default">Genre</label>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-full bg-white rounded-lg border border-default-default px-4 py-5 outline-none focus:border-brand-orange transition-colors">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {genres.map((g) => (
                    <SelectItem key={g.slug} value={g.slug}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Language */}
            <div className="flex flex-col gap-2">
              <label className="text-default">Language</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-full bg-white rounded-lg border border-default-default px-4 py-5 outline-none focus:border-brand-orange transition-colors">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {languages.map((l) => (
                    <SelectItem key={l.slug} value={l.slug}>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Artist Role */}
            <div className="flex flex-col gap-2">
              <label className="text-default">Artist Role</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full bg-white rounded-lg border border-default-default px-4 py-5 outline-none focus:border-brand-orange transition-colors">
                  <SelectValue placeholder="Select key artist role" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {roles.map((r) => (
                    <SelectItem key={r.slug} value={r.slug}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col p-4 gap-6">
              {/* Spotify connection row */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <SpotifyDark />
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium text-default">
                      Existing artist on Spotify?
                    </span>
                    <span className="text-xs text-border-default-secondary font-medium">
                      Does this artist have existing music on Spotify? *
                    </span>
                  </div>
                </div>

                {spotifyConnection ? (
                  <div className="flex items-center gap-2 p-2 rounded-full bg-[#EBFFEE] text-[#009951] border border-[#009951] text-xs font-medium shrink-0">
                    <span>Connected</span>
                    <Check size={16} />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActivePlatformModal("spotify")}
                    className="rounded-full p-2 px-3 bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-medium flex items-center gap-2 shrink-0 transition-colors cursor-pointer"
                  >
                    <span>Connect</span>
                    <LinkIcon size={16} />
                  </button>
                )}
              </div>

              {/* Apple Music connection row */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <AppleMusicCircle />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-default">
                      Existing artist on Apple Music?
                    </span>
                    <span className="text-xs text-border-default-secondary font-medium">
                      Does this artist have existing music on Apple Music? *
                    </span>
                  </div>
                </div>

                {appleConnection ? (
                  <div className="flex items-center gap-2 p-2 rounded-full bg-[#EBFFEE] text-[#009951] border border-[#009951] text-xs font-medium shrink-0">
                    <span>Connected</span>
                    <Check size={16} />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActivePlatformModal("apple")}
                    className="rounded-full p-2 px-3 bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-medium flex items-center gap-2 shrink-0 transition-colors cursor-pointer"
                  >
                    <span>Connect</span>
                    <LinkIcon size={16} />
                  </button>
                )}
              </div>
            </div>
            {/* Done Button */}
            <div className="pt-2 flex justify-center">
              <Button
                type="button"
                onClick={handleDone}
                rounded={10}
                className="w-full max-w-63.75 mx-auto"
              >
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sub-modal for connecting Spotify or Apple Music */}
      {activePlatformModal && (
        <ConnectPlatformModal
          open={!!activePlatformModal}
          onOpenChange={(isOpen) => !isOpen && setActivePlatformModal(null)}
          platform={activePlatformModal}
          onSelectProfile={(profile) => {
            if (activePlatformModal === "spotify") {
              setSpotifyConnection(profile);
            } else {
              setAppleConnection(profile);
            }
          }}
        />
      )}
    </>
  );
}

export default AddNonLabelArtistModal;
