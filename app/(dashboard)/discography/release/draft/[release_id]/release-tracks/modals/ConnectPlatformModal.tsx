"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "radix-ui";
import { X } from "lucide-react";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import Spotify from "@/components/icons/spotify";
import AppleMusicRoundedRectangle from "@/components/icons/apple-music-rounded-rectangle";
import ArtistLookupResult from "@/components/artist-lookup-result";

export interface ConnectedProfile {
  platform: "spotify" | "apple";
  id: string;
  name: string;
  avatar_url?: string;
  url?: string;
  subtitle?: string;
}

interface ConnectPlatformModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform: "spotify" | "apple";
  onSelectProfile: (profile: ConnectedProfile) => void;
  initialValue?: string;
}

export function ConnectPlatformModal({
  open,
  onOpenChange,
  platform,
  onSelectProfile,
  initialValue = "",
}: ConnectPlatformModalProps) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ConnectedProfile[]>([]);

  useEffect(() => {
    if (open) {
      setInputValue(initialValue);
      setResults([]);
    }
  }, [open, initialValue]);

  // Debounced search / lookup
  useEffect(() => {
    if (!open) return;
    const query = inputValue.trim();
    if (!query) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const endpoint =
          platform === "spotify"
            ? API_ROUTES.ARTIST_LOOKUP.SPOTIFY(query)
            : API_ROUTES.ARTIST_LOOKUP.APPLE_MUSIC(query);

        const res = await api
          .get<{
            results?: Array<{
              id: string;
              name: string;
              image_url?: string;
              url?: string;
              latest_release?: string | { title?: string } | null;
            }>;
            data?: {
              results?: Array<{
                id: string;
                name: string;
                image_url?: string;
                url?: string;
                latest_release?: string | { title?: string } | null;
              }>;
            };
          }>(endpoint)
          .catch(() => null);

        const list = res?.results || res?.data?.results || [];

        if (Array.isArray(list) && list.length > 0) {
          setResults(
            list.map((a) => {
              let subtitle = platform === "spotify" ? "Spotify Profile" : "Apple Music Profile";
              if (typeof a.latest_release === "string" && a.latest_release.trim()) {
                subtitle = a.latest_release;
              } else if (
                a.latest_release &&
                typeof a.latest_release === "object" &&
                a.latest_release.title
              ) {
                subtitle = a.latest_release.title;
              }

              return {
                platform,
                id: a.id,
                name: a.name,
                avatar_url: a.image_url || "/images/avatar.png",
                url: a.url,
                subtitle,
              };
            }),
          );
        } else {
          // If no lookup results returned, allow connecting the entered query/ID as direct fallback
          setResults([
            {
              platform,
              id: query,
              name: query,
              avatar_url: "/images/avatar.png",
              subtitle: `Direct ${platform === "spotify" ? "Spotify" : "Apple"} ID`,
            },
          ]);
        }
      } catch (err) {
        // Direct ID fallback on network error
        setResults([
          {
            platform,
            id: query,
            name: query,
            avatar_url: "/images/avatar.png",
            subtitle: `Direct ${platform === "spotify" ? "Spotify" : "Apple"} ID`,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [inputValue, platform, open]);

  const handleSelect = (profile: ConnectedProfile) => {
    onSelectProfile(profile);
    onOpenChange(false);
  };

  const isSpotify = platform === "spotify";
  const label = isSpotify ? "Enter Spotify profile link" : "Enter Apple Music profile link";
  const placeholder = isSpotify
    ? "Paste here - e.g. 2Z0Ed0DsNawSHPVcDsLCm"
    : "Paste here - e.g. 1248590";
  const helperText = isSpotify
    ? "Go to your artist page on Spotify and copy-paste the numeric part of the URL, e.g. 2Z0Ed0DsNawSHPVcDsLCm"
    : "Go to your artist page on Apple Music and copy-paste the numeric part of the URL, e.g. 1248590";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-150 rounded-30 p-0 overflow-hidden isolate gap-0 border border-default-default/20 shadow-2xl"
        showCloseButton={false}
      >
        <VisuallyHidden.Root>
          <DialogHeader>
            <DialogTitle>Connect profile</DialogTitle>
            <DialogDescription>Search or paste your platform profile link</DialogDescription>
          </DialogHeader>
        </VisuallyHidden.Root>

        {/* Top subtle glow */}
        <div className="absolute w-full top-0 left-0 right-0 h-28 bg-linear-to-r from-[#9747FF] to-[#0066FF] -z-10 opacity-20 blur-3xl pointer-events-none" />

        {/* Header */}
        <header className="px-6 py-5 flex items-center justify-between border-b border-default-default/10">
          <span className="text-sm font-medium">Connect profile</span>
          <DialogClose className="p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer">
            <X size={20} className="text-default" />
          </DialogClose>
        </header>

        {/* Content */}
        <div className="px-6 py-4 flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              {isSpotify ? <Spotify size={24} /> : <AppleMusicRoundedRectangle size={24} />}
              <span className="text-xs font-medium">{label}</span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={placeholder}
                  className="w-full bg-white rounded-full border border-default-default px-4 py-3 text-sm font-medium outline-none focus:border-brand-orange focus:bg-white transition-colors"
                  autoFocus
                />
              </div>
              <p className="text-[10px] text-default-tertiary font-medium leading-relaxed">
                {helperText}
              </p>
            </div>
          </div>

          {/* Results list */}
          {isLoading ? (
            <div className="py-4 text-center text-xs text-border-default-secondary font-medium animate-pulse">
              Searching platform...
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-2 mt-2">
              {results.map((artist) => (
                <ArtistLookupResult
                  key={artist.id}
                  platform={isSpotify ? "spotify" : "apple"}
                  artist={{
                    id: artist.id,
                    image_url: artist.avatar_url,
                    latest_release: artist.subtitle,
                    url: artist.url,
                    name: artist.name,
                  }}
                  value={inputValue}
                  handleAdd={(artist) => {
                    handleSelect({
                      id: artist.id,
                      name: artist.name,
                      platform: platform,
                      avatar_url: artist.image_url || "",
                      subtitle: artist.latest_release || "",
                      url: artist.url || "",
                    });
                  }}
                  handleRemove={() => {}}
                />
              ))}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default ConnectPlatformModal;
