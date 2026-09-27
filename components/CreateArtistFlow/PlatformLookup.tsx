"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import Spotify from "../icons/spotify";
import AppleMusicRoundedRectangle from "../icons/apple-music-rounded-rectangle";
import { Button } from "../ui/button";

export interface MatchedPlatformArtist {
  id: string;
  name: string;
  avatar: string;
  platform: "spotify" | "apple";
}

interface PlatformLookupProps {
  platform: "spotify" | "apple";
  label: string;
  helperText: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

async function fetchPlatformMatches(
  query: string,
  platform: "spotify" | "apple",
): Promise<MatchedPlatformArtist[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  try {
    const endpoint =
      platform === "spotify"
        ? API_ROUTES.ARTIST_LOOKUP.SPOTIFY(trimmed)
        : API_ROUTES.ARTIST_LOOKUP.APPLE_MUSIC(trimmed);

    const res = await api
      .get<{
        results?: Array<{
          id: string;
          name: string;
          image_url?: string;
          url?: string;
        }>;
        data?: {
          results?: Array<{
            id: string;
            name: string;
            image_url?: string;
            url?: string;
          }>;
        };
      }>(endpoint)
      .catch(() => null);

    const list = res?.results || res?.data?.results || [];

    return list.map((item) => ({
      id: item.id,
      name: item.name,
      avatar: item.image_url || "/images/avatar.png",
      platform,
    }));
  } catch (err) {
    console.error("Platform lookup fetch error:", err);
    return [];
  }
}

export function PlatformLookup({
  platform,
  label,
  helperText,
  value,
  onChange,
  error,
}: PlatformLookupProps) {
  const [inputValue, setInputValue] = useState(value);
  const [matches, setMatches] = useState<MatchedPlatformArtist[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchedPlatformArtist | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search
  useEffect(() => {
    if (!inputValue.trim()) {
      setMatches([]);
      setIsLoading(false);
      return;
    }

    // If already selected this exact ID, keep selection and don't re-query
    if (selectedMatch && selectedMatch.id === inputValue.trim()) {
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const results = await fetchPlatformMatches(inputValue, platform);
        setMatches(results);
      } catch (err) {
        console.error("Platform lookup error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue, platform, selectedMatch]);

  const handleAdd = (artist: MatchedPlatformArtist) => {
    setSelectedMatch(artist);
    onChange(artist.id);
  };

  const handleRemove = () => {
    setSelectedMatch(null);
    setMatches([]);
    setInputValue("");
    onChange("");
  };

  return (
    <Field className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {platform === "spotify" ? <Spotify /> : <AppleMusicRoundedRectangle />}
        <FieldLabel className="font-medium text-sm text-default">{label}</FieldLabel>
      </div>

      <input
        type="text"
        value={inputValue}
        placeholder="Paste here"
        onChange={(e) => {
          setInputValue(e.target.value);
          if (!e.target.value.trim()) {
            onChange("");
            setSelectedMatch(null);
          }
        }}
        className="w-full bg-white outline outline-default-default p-3 px-5 rounded-full text-xs text-default font-normal placeholder:text-default-tertiary focus:outline-brand-orange transition-colors"
      />
      <p className="text-[10px] font-medium text-default-tertiary">{helperText}</p>

      {/* Selected match or active lookup results */}
      {matches.length > 0 ? (
        <div className="flex flex-col gap-2 mt-1">
          {matches.map((artist) => (
            <div key={artist.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10.5 h-10.5 relative rounded-full overflow-hidden shrink-0 bg-neutral-100">
                  <Image src={artist.avatar} alt={artist.name} fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-black truncate">{artist.name}</p>
                  <p className="text-xs text-border-default-secondary truncate">{artist.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {platform === "spotify" ? (
                  <Spotify color="black" size={26.25} />
                ) : (
                  <AppleMusicRoundedRectangle size={26.25} />
                )}
                {value === artist.id ? (
                  <Button
                    size="sm"
                    type="button"
                    variant="white-outline"
                    onClick={handleRemove}
                    className="text-xs"
                  >
                    Remove
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    type="button"
                    variant="white-outline"
                    onClick={() => handleAdd(artist)}
                    className="text-xs"
                  >
                    Add
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : isLoading ? (
        <p className="text-xs text-black/40 italic px-1">Searching platform...</p>
      ) : null}

      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
export default PlatformLookup;
