"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { goeyToast } from "goey-toast";
import ConnectPlatformModal, { type ConnectedProfile } from "./ConnectPlatformModal";
import Spotify from "@/components/icons/spotify";
import AppleMusicRoundedRectangle from "@/components/icons/apple-music-rounded-rectangle";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type ContributorRoleOption } from "../track-meta-fallbacks";

export interface SelectedArtistData {
  reference?: string;
  name: string;
  stage_name?: string;
  avatar_url?: string;
  subtitle?: string;
  spotify_linked?: boolean;
  spotify_url?: string | null;
  apple_music_linked?: boolean;
  apple_music_url?: string | null;
  spotify_id?: string;
  apple_music_id?: string;
  role?: string;
}

interface ConfirmArtistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  artist: SelectedArtistData | null;
  roles?: ContributorRoleOption[];
  onConfirm: (artist: SelectedArtistData) => void;
  onArtistProfileUpdated?: (updatedArtist: SelectedArtistData) => void;
}

export function ConfirmArtistModal({
  open,
  onOpenChange,
  title = "Add Main Artist",
  artist,
  roles = [],
  onConfirm,
  onArtistProfileUpdated,
}: ConfirmArtistModalProps) {
  const [selectedRole, setSelectedRole] = useState("");
  const [spotifyConnection, setSpotifyConnection] = useState<ConnectedProfile | null>(null);
  const [appleConnection, setAppleConnection] = useState<ConnectedProfile | null>(null);

  const [activePlatformModal, setActivePlatformModal] = useState<"spotify" | "apple" | null>(null);

  useEffect(() => {
    if (artist) {
      setSelectedRole(artist.role || "");
      const isSpotifyLinked = artist.spotify_linked || !!artist.spotify_url || !!artist.spotify_id;
      const isAppleLinked =
        artist.apple_music_linked || !!artist.apple_music_url || !!artist.apple_music_id;

      setSpotifyConnection(
        isSpotifyLinked
          ? {
              platform: "spotify",
              id: artist.spotify_id || artist.spotify_url || "",
              name: artist.stage_name || artist.name,
              url: artist.spotify_url || undefined,
            }
          : null,
      );
      setAppleConnection(
        isAppleLinked
          ? {
              platform: "apple",
              id: artist.apple_music_id || artist.apple_music_url || "",
              name: artist.stage_name || artist.name,
              url: artist.apple_music_url || undefined,
            }
          : null,
      );
    }
  }, [artist]);

  if (!artist) return null;

  const displayName = artist.stage_name || artist.name;
  const avatar = artist.avatar_url || "/images/avatar.png";

  const handleProfileSelected = async (profile: ConnectedProfile) => {
    const platformType = activePlatformModal;
    if (!platformType || !artist) return;

    if (platformType === "spotify") {
      setSpotifyConnection(profile);
    } else {
      setAppleConnection(profile);
    }

    // If artist belongs to label roster (has reference), update backend profile immediately
    if (artist.reference) {
      try {
        const payload =
          platformType === "spotify"
            ? { spotify_url: profile.id }
            : { apple_music_url: profile.id };

        await api.patch(API_ROUTES.LABEL.UPDATE_ARTIST_PROFILE(artist.reference), payload);

        goeyToast.success(
          `${platformType === "spotify" ? "Spotify" : "Apple Music"} profile connected`,
        );

        const updatedArtist: SelectedArtistData = {
          ...artist,
          ...(platformType === "spotify"
            ? {
                spotify_linked: true,
                spotify_url: profile.url || profile.id,
                spotify_id: profile.id,
              }
            : {
                apple_music_linked: true,
                apple_music_url: profile.url || profile.id,
                apple_music_id: profile.id,
              }),
        };

        onArtistProfileUpdated?.(updatedArtist);
      } catch (err: any) {
        console.error("Failed to update artist profile connection:", err);
        goeyToast.error("Failed to update profile", {
          description: err?.message || "Could not save connection to backend",
        });
      }
    }
  };

  const handleAddArtist = () => {
    if (!selectedRole) {
      goeyToast.error("Please select a role for this artist");
      return;
    }

    onConfirm({
      ...artist,
      role: selectedRole,
      spotify_linked: !!spotifyConnection,
      spotify_url: spotifyConnection?.url || spotifyConnection?.id || null,
      spotify_id: spotifyConnection?.id,
      apple_music_linked: !!appleConnection,
      apple_music_url: appleConnection?.url || appleConnection?.id || null,
      apple_music_id: appleConnection?.id,
    });
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-w-130 rounded-30 p-0 overflow-hidden isolate gap-0 border border-default-default/20 shadow-2xl"
          showCloseButton={false}
        >
          <VisuallyHidden.Root>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>Confirm artist platform connections</DialogDescription>
            </DialogHeader>
          </VisuallyHidden.Root>

          {/* Top glow */}
          <div className="absolute w-full top-0 left-0 right-0 h-28 bg-linear-to-r from-[#9747FF] to-[#FFC107] -z-10 opacity-20 blur-3xl pointer-events-none" />

          {/* Header */}
          <header className="px-6 py-5 flex items-center justify-between border-b border-default-default/10">
            <span className="text-sm font-medium text-black">{title}</span>
            <DialogClose className="p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer">
              <X size={20} className="text-default" />
            </DialogClose>
          </header>

          <div className="p-6 flex flex-col gap-4">
            {/* Artist Card */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-10.5 relative rounded-full overflow-hidden shrink-0 bg-neutral-100 border border-default-default/10">
                  <Image src={avatar} alt={displayName} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex flex-col gap-0.5">
                  <p className="font-medium truncate">{displayName}</p>
                  <p className="text-xs text-border-default-secondary truncate">
                    {artist.subtitle}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                {/* Platform Icons */}
                {spotifyConnection && <Spotify size={26.25} />}
                {appleConnection && <AppleMusicRoundedRectangle size={26.25} />}
              </div>
            </div>

            {/* Role Selection */}
            {roles && roles.length > 0 && (
              <div className="flex flex-col gap-2 pt-1">
                <label className="text-xs font-medium text-default">Role *</label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-full bg-white h-auto rounded-xl border border-default-default px-4 py-3 text-sm leading-none text-default font-medium outline-none focus:border-brand-orange transition-colors">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r.slug} value={r.slug}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="py-4 flex flex-col gap-6">
              {/* Spotify connection row */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <Spotify size={32} />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-default">
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
                  <AppleMusicRoundedRectangle size={32} />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-default">
                      Existing artist on Apple Music?
                    </span>
                    <span className="text-[11px] text-border-default-secondary font-medium">
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
            {/* Bottom Button */}
            <div>
              <Button type="button" size="sm" onClick={handleAddArtist}>
                Add artist
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
          onSelectProfile={handleProfileSelected}
        />
      )}
    </>
  );
}

export default ConfirmArtistModal;
