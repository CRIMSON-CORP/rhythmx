"use client";

import Icon from "@/components/icon";
import Artist from "@/components/artist";
import { ArrowUp, Disc, List, Loader2, Music, Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useState } from "react";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

interface AllArtistsSectionProps {
  initialArtists?: LabelArtist[];
  initialHasMore?: boolean;
}

export function AllArtistsSkeleton() {
  return (
    <section className="flex flex-col gap-8 pt-8 pb-4">
      <header className="container flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-medium whitespace-nowrap">All Artists</h2>
        <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
          <div className="h-10 w-48 rounded-full bg-default-secondary/30 animate-pulse" />
          <div className="h-10 w-20 rounded-full bg-default-secondary/30 animate-pulse" />
          <div className="h-10 w-24 rounded-full bg-default-secondary/30 animate-pulse" />
        </div>
      </header>
      <div className="container">
        <div className="bg-white rounded-30 p-3 md:p-8 grid grid-cols-[repeat(auto-fill,minmax(min(168px,100%),1fr))] gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 animate-pulse">
              <div className="aspect-square w-42 rounded-full bg-default-secondary/40" />
              <div className="h-5 w-24 bg-default-secondary/40 rounded mt-2" />
              <div className="h-3 w-16 bg-default-secondary/30 rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AllArtistsSection({
  initialArtists = [],
  initialHasMore = true,
}: AllArtistsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const fetchArtistsPage = useCallback(async (page: number, search: string) => {
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: "20",
        ...(search.trim() ? { search: search.trim() } : {}),
      });

      const res = await api
        .get<LabelArtistsResponse>(`${API_ROUTES.LABEL.ARTISTS}?${query.toString()}`)
        .catch(() => null);

      const items = res?.artists || [];
      const meta = res?.meta?.pagination;

      const hasMore = meta?.has_next !== undefined ? meta.has_next : items.length >= 20;

      return {
        items,
        hasMore,
      };
    } catch {
      return { items: [], hasMore: false };
    }
  }, []);

  const {
    items: allArtists,
    isLoading,
    isLoadingMore,
    hasMore,
    sentinelRef,
  } = useInfiniteScroll<LabelArtist>({
    fetchPage: fetchArtistsPage,
    search: searchQuery,
    initialItems: initialArtists,
    initialHasMore,
    debounceMs: 350,
  });

  return (
    <section className="flex flex-col gap-8 pt-8 pb-4">
      <header className="container flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-medium whitespace-nowrap">All Artists</h2>
        <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
          <div className="flex items-center px-4 py-2 gap-x-2 text-default-tertiary bg-white/20 rounded-full">
            <Search size={16} />
            <input
              type="search"
              placeholder="Search artists"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-default placeholder:text-default-tertiary text-sm"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-default-tertiary hover:text-default p-0.5"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            ) : null}
          </div>
          <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-brand-blue text-white leading-tight">
            <ArrowUp size={16} />
            <span>All</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-white leading-tight">
            <Disc size={16} />
            <span>Album</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-white leading-tight">
            <Music size={16} />
            <span>Single</span>
          </button>
          <Select defaultValue="recent">
            <SelectTrigger className="bg-white rounded-full flex px-4 py-3 items-center">
              <span>Artist Type:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start" className="outline-0! p-2">
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="unpopular">Unpopular</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="recent">
            <SelectTrigger className="bg-white rounded-full flex px-4 py-3 items-center">
              <span>Sort:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start" className="outline-0! p-2">
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="unpopular">Unpopular</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="any">
            <SelectTrigger className="bg-white rounded-full flex px-4 py-3 items-center">
              <span>Location:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start" className="outline-0! p-2">
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center px-4 py-3 gap-2 bg-white rounded-full">
            <button type="button" aria-label="Grid view">
              <Icon name="circles-four" size={18} />
            </button>
            <span className="w-px h-4 bg-default-default/20" />
            <button type="button" aria-label="List view">
              <List size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        {!isLoading && allArtists.length === 0 ? (
          <div className="bg-white rounded-30 p-12 flex flex-col items-center justify-center text-center gap-2">
            <p className="text-default font-medium text-lg">No artists found</p>
            <p className="text-sm text-border-default-secondary">
              {searchQuery
                ? `No artists match your search "${searchQuery}".`
                : "No artists have been added to your label yet."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-30 p-3 md:p-8 grid grid-cols-[repeat(auto-fill,minmax(min(168px,100%),1fr))] gap-8">
            {isLoading && allArtists.length === 0
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 animate-pulse">
                    <div className="aspect-square w-42 rounded-full bg-default-secondary/40" />
                    <div className="h-5 w-24 bg-default-secondary/40 rounded mt-2" />
                    <div className="h-3 w-16 bg-default-secondary/30 rounded" />
                  </div>
                ))
              : allArtists.map((artist) => (
                  <Artist
                    id={artist.reference}
                    key={`all-${artist.reference}`}
                    image={artist.portrait_url || artist.avatar_url || "/images/avatar.png"}
                    name={
                      artist.stage_name ||
                      artist.legal_name ||
                      `${artist.first_name || ""} ${artist.last_name || ""}`.trim() ||
                      "Artist"
                    }
                    location={artist.country_name || artist.country || ""}
                  />
                ))}
          </div>
        )}

        {/* Sentinel for infinite scroll */}
        {hasMore && !isLoading && (
          <div ref={sentinelRef} className="flex items-center justify-center p-8 min-h-16">
            {isLoadingMore && <Loader2 size={24} className="animate-spin text-default-tertiary" />}
          </div>
        )}
      </div>
    </section>
  );
}
