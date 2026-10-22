"use client";

import ReleaseCards from "@/components/realease-cards";
import ReleaseCard from "@/components/release-card";
import { ReleaseCardsSkeleton } from "@/components/release-card-skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUp, Disc, Loader2, Music, Search, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { cn } from "@/lib/utils";

interface AllReleasesSectionProps {
  initialReleases?: Release[];
  initialHasMore?: boolean;
}

export function AllReleasesSkeleton() {
  return (
    <section className="flex flex-col gap-8 pt-8 pb-4">
      <header className="container flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-medium whitespace-nowrap">All Releases</h2>
        <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
          <div className="h-10 w-48 rounded-full bg-white animate-pulse" />
          <div className="h-10 w-20 rounded-full bg-white animate-pulse" />
          <div className="h-10 w-24 rounded-full bg-white animate-pulse" />
          <div className="h-10 w-28 rounded-full bg-white animate-pulse" />
        </div>
      </header>
      <div className="container">
        <ReleaseCardsSkeleton count={8} />
      </div>
    </section>
  );
}

export default function AllReleasesSection({
  initialReleases = [],
  initialHasMore = true,
}: AllReleasesSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "album" | "single">("all");
  const [sort, setSort] = useState<"recent" | "oldest" | "popular" | "unpopular">("recent");
  const [selectedArtist, setSelectedArtist] = useState<string>("any");

  const fetchReleasesPage = useCallback(
    async (page: number, _search: string) => {
      try {
        const query = new URLSearchParams({
          page: String(page),
          limit: "20",
          ...(searchQuery.trim() ? { q: searchQuery.trim() } : {}),
          ...(typeFilter !== "all" ? { type: typeFilter } : {}),
        });

        const res = await api
          .get<ReleasesResponse>(`${API_ROUTES.RELEASES.MY}?${query.toString()}`)
          .catch(() => null);

        const items = res?.releases || [];
        const meta = res?.meta?.pagination;

        const hasMore = meta?.has_next !== undefined ? meta.has_next : items.length >= 20;

        return {
          items,
          hasMore,
        };
      } catch {
        return { items: [], hasMore: false };
      }
    },
    [searchQuery, typeFilter],
  );

  const {
    items: allReleases,
    isLoading,
    isLoadingMore,
    hasMore,
    sentinelRef,
  } = useInfiniteScroll<Release>({
    fetchPage: fetchReleasesPage,
    search: `${searchQuery}::${typeFilter}`,
    initialItems: initialReleases,
    initialHasMore,
    debounceMs: 350,
  });

  // Extract distinct artist names from the loaded catalogue for the artist filter
  const artistsList = useMemo(() => {
    const names = new Set<string>();
    allReleases.forEach((release) => {
      release.artists?.forEach((artist) => {
        if (artist.name) names.add(artist.name);
      });
    });
    return Array.from(names);
  }, [allReleases]);

  // Filter and sort client-side
  const filteredAndSortedReleases = useMemo(() => {
    let result = [...allReleases];

    // Filter by artist if selected
    if (selectedArtist !== "any") {
      result = result.filter((release) =>
        release.artists?.some((artist) => artist.name === selectedArtist),
      );
    }

    // Sort releases
    result.sort((a, b) => {
      if (sort === "popular") {
        return (b.total_streams || 0) - (a.total_streams || 0);
      }
      if (sort === "unpopular") {
        return (a.total_streams || 0) - (b.total_streams || 0);
      }
      const timeA = new Date(a.release_date || a.created_at || 0).getTime();
      const timeB = new Date(b.release_date || b.created_at || 0).getTime();
      if (sort === "oldest") {
        return timeA - timeB;
      }
      // "recent" default
      return timeB - timeA;
    });

    return result;
  }, [allReleases, selectedArtist, sort]);

  return (
    <section className="flex flex-col gap-8 pt-8 pb-4">
      <header className="container flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-medium whitespace-nowrap">All Releases</h2>
        <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
          {/* Search Input */}
          <div className="flex items-center px-4 py-2 gap-x-2 text-default-tertiary bg-white/20 rounded-full">
            <Search size={16} />
            <input
              type="search"
              placeholder="Search releases"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-default placeholder:text-default-tertiary text-sm w-36 sm:w-48"
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

          {/* Type Filter Tabs */}
          <button
            type="button"
            onClick={() => setTypeFilter("all")}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-full leading-tight transition-colors cursor-pointer",
              typeFilter === "all"
                ? "bg-brand-blue text-white"
                : "bg-white text-default hover:bg-white/80",
            )}
          >
            <ArrowUp size={16} />
            <span>All</span>
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter("album")}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-full leading-tight transition-colors cursor-pointer",
              typeFilter === "album"
                ? "bg-brand-blue text-white"
                : "bg-white text-default hover:bg-white/80",
            )}
          >
            <Disc size={16} />
            <span>Album</span>
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter("single")}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-full leading-tight transition-colors cursor-pointer",
              typeFilter === "single"
                ? "bg-brand-blue text-white"
                : "bg-white text-default hover:bg-white/80",
            )}
          >
            <Music size={16} />
            <span>Single</span>
          </button>

          {/* Sort Dropdown */}
          <Select
            value={sort}
            onValueChange={(val: "recent" | "oldest" | "popular" | "unpopular") => setSort(val)}
          >
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

          {/* Artist Filter Dropdown */}
          {artistsList.length > 0 && (
            <Select value={selectedArtist} onValueChange={setSelectedArtist}>
              <SelectTrigger className="bg-white rounded-full flex px-4 py-3 items-center max-w-44">
                <span>Artist:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start" className="outline-0! p-2 max-h-60">
                <SelectItem value="any">Any</SelectItem>
                {artistsList.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </header>

      <div className="container">
        {!isLoading && filteredAndSortedReleases.length === 0 ? (
          <div className="bg-white rounded-30 p-12 flex flex-col items-center justify-center text-center gap-2">
            <p className="text-default font-medium text-lg">No releases found</p>
            <p className="text-sm text-border-default-secondary">
              {searchQuery
                ? `No releases match your search "${searchQuery}".`
                : typeFilter !== "all"
                  ? `No ${typeFilter} releases found.`
                  : "No releases have been created yet."}
            </p>
          </div>
        ) : (
          <ReleaseCards>
            {filteredAndSortedReleases.map((release) => (
              <ReleaseCard key={release.reference} {...release} />
            ))}
          </ReleaseCards>
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
