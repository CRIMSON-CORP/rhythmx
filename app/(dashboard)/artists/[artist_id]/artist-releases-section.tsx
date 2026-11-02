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
import { ArrowUp, Disc, Music, Search, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { cn } from "@/lib/utils";

interface ArtistReleasesSectionProps {
  artistId: string;
  initialReleases?: Release[];
  initialHasMore?: boolean;
}

export default function ArtistReleasesSection({
  artistId,
  initialReleases = [],
  initialHasMore = true,
}: ArtistReleasesSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "album" | "single">("all");
  const [sort, setSort] = useState<"recent" | "oldest" | "popular" | "unpopular">("recent");

  const fetchReleasesPage = useCallback(
    async (page: number) => {
      try {
        const query = new URLSearchParams({
          page: String(page),
          limit: "20",
        });

        const res = await api
          .get<ArtistReleasesResponse>(
            API_ROUTES.LABEL.ARTIST_RELEASES(artistId, query.toString()),
          )
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
    [artistId],
  );

  const {
    items: allReleases,
    isLoading,
    isLoadingMore,
    sentinelRef,
  } = useInfiniteScroll<Release>({
    fetchPage: fetchReleasesPage,
    initialItems: initialReleases,
    initialHasMore,
  });

  const filteredAndSortedReleases = useMemo(() => {
    let result = [...allReleases];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (release) =>
          release.title?.toLowerCase().includes(q) ||
          release.artist_name?.toLowerCase().includes(q) ||
          release.artists?.some((a) => a.name?.toLowerCase().includes(q)),
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      result = result.filter((release) => release.type?.toLowerCase() === typeFilter);
    }

    // Sort
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
      return timeB - timeA;
    });

    return result;
  }, [allReleases, searchQuery, typeFilter, sort]);

  return (
    <section className="flex flex-col gap-8 pt-8 pb-4">
      <header className="container flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-medium whitespace-nowrap">All Releases</h2>
        <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
          {/* Search Input */}
          <div className="flex items-center px-4 py-2 gap-x-2 text-default-tertiary bg-white rounded-full">
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
                className="text-default-tertiary hover:text-default p-0.5 cursor-pointer"
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
        </div>
      </header>

      {isLoading ? (
        <div className="container">
          <ReleaseCardsSkeleton count={8} />
        </div>
      ) : filteredAndSortedReleases.length > 0 ? (
        <>
          <ReleaseCards>
            {filteredAndSortedReleases.map((release) => (
              <ReleaseCard
                key={release.reference}
                reference={release.reference}
                cover_url={release.cover_url}
                title={release.title}
                total_streams={release.total_streams}
                type={release.type}
                platforms={release.platforms ?? []}
              />
            ))}
          </ReleaseCards>

          {isLoadingMore && (
            <div className="container">
              <ReleaseCardsSkeleton count={4} />
            </div>
          )}

          {/* Sentinel for infinite scroll */}
          <div ref={sentinelRef} className="h-8 w-full pointer-events-none" aria-hidden="true" />
        </>
      ) : (
        <div className="container">
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-30 text-center gap-3">
            <div className="size-14 rounded-full bg-default-secondary/10 flex items-center justify-center text-default-tertiary">
              <Music size={24} />
            </div>
            <h3 className="font-semibold text-lg text-default">
              {searchQuery || typeFilter !== "all"
                ? "No matching releases found"
                : "No releases found for this artist"}
            </h3>
            <p className="text-default-tertiary text-sm max-w-sm">
              {searchQuery || typeFilter !== "all"
                ? "Try adjusting your search query or filter."
                : "This artist doesn't have any releases yet."}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

