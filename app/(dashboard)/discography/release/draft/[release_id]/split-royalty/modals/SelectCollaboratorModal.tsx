"use client";

import { useState, useMemo, useCallback } from "react";
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
import { Search, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import CreateArtistFlow, { type CreatedArtistData } from "@/components/CreateArtistFlow";

export interface SelectedCollaboratorData {
  reference: string;
  name: string;
  stage_name?: string;
  avatar_url?: string;
  subtitle?: string;
}

interface SelectCollaboratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  excludeIds?: string[];
  onSelectCollaborator: (artist: SelectedCollaboratorData) => void;
}

export function SelectCollaboratorModal({
  open,
  onOpenChange,
  title = "Select Collaborator",
  excludeIds = [],
  onSelectCollaborator,
}: SelectCollaboratorModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateFlowOpen, setIsCreateFlowOpen] = useState(false);

  // Paginated artist fetcher
  const fetchArtistsPage = useCallback(async (page: number, search: string) => {
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: "20",
        search: search.trim(),
      });

      const res = await api
        .get<{
          artists?: ReleaseTrackPerson[];
          meta?: {
            pagination?: {
              page: number;
              limit: number;
              total: number;
              pages: number;
              has_next: boolean;
              has_prev: boolean;
            };
          };
        }>(`${API_ROUTES.LABEL.ARTISTS}?${query.toString()}`)
        .catch(() => null);

      const rawArtists = res?.artists || [];
      const mapped: SelectedCollaboratorData[] = rawArtists.map((a) => ({
        reference: a.reference || "",
        name: a.stage_name || `${a.first_name || ""} ${a.last_name || ""}`.trim() || "Unknown Artist",
        stage_name: a.stage_name,
        avatar_url: a.portrait_url || a.avatar_url,
        subtitle: a.country_name || "Artist",
      }));

      const hasMore =
        res?.meta?.pagination?.has_next !== undefined
          ? res.meta.pagination.has_next
          : rawArtists.length >= 20;

      return {
        items: mapped,
        hasMore,
      };
    } catch {
      return { items: [], hasMore: false };
    }
  }, []);

  const {
    items: artists,
    setItems: setArtists,
    isLoading,
    isLoadingMore,
    sentinelRef,
  } = useInfiniteScroll<SelectedCollaboratorData>({
    fetchPage: fetchArtistsPage,
    search: searchQuery,
    enabled: open,
    debounceMs: 300,
  });

  const filteredArtists = useMemo(() => {
    return artists.filter((a) => {
      if (!a.reference) return true;
      return !excludeIds.includes(a.reference);
    });
  }, [artists, excludeIds]);

  const handleArtistClick = (artist: SelectedCollaboratorData) => {
    onSelectCollaborator(artist);
    onOpenChange(false);
  };

  const handleCreatedArtist = (created: CreatedArtistData) => {
    const mapped: SelectedCollaboratorData = {
      reference: created.reference || `created-${Date.now()}`,
      name: created.stage_name || `${created.first_name || ""} ${created.last_name || ""}`.trim(),
      stage_name: created.stage_name,
      avatar_url: created.portrait_url || created.avatar_url,
      subtitle: created.genre || "Afrobeats",
    };

    setArtists((prev) => [mapped, ...prev.filter((a) => a.reference !== mapped.reference)]);
    setIsCreateFlowOpen(false);
    onSelectCollaborator(mapped);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="gap-0 max-w-150 w-full p-0 overflow-hidden isolate border border-default-default/20 rounded-30 shadow-2xl"
          showCloseButton={false}
        >
          <VisuallyHidden.Root>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>Select a collaborator from the roster</DialogDescription>
            </DialogHeader>
          </VisuallyHidden.Root>

          {/* Top glow background */}
          <div className="absolute w-full top-0 left-0 right-0 h-40 bg-linear-to-r from-[#9747FF] to-[#FFC107] -z-10 opacity-20 blur-3xl pointer-events-none" />

          {/* Header */}
          <header className="p-6 pb-0 flex gap-3 sm:gap-6 items-center justify-between">
            <span className="text-default text-base font-medium grow">{title}</span>

            {/* Add New + Button in Header */}
            <Button
              type="button"
              onClick={() => setIsCreateFlowOpen(true)}
              variant="white-outline"
              size="sm"
              className="rounded-full px-4 py-2 border-default-default/40"
            >
              <span>Add new</span>
              <Plus size={18} />
            </Button>

            {/* Close Button */}
            <DialogClose className="p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer flex-none">
              <X size={20} className="text-default" />
            </DialogClose>
          </header>

          {/* Search bar */}
          <header className="px-6 py-4">
            <div className="flex items-center grow gap-2.5 px-4 py-3 bg-white/40 rounded-full border border-default-default/40 focus-within:border-brand-orange focus-within:bg-white transition-colors">
              <Search size={18} className="text-default-tertiary flex-none" />
              <input
                placeholder="Search Artist"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none w-full text-sm font-medium placeholder:text-border-default-secondary/75"
              />
            </div>
          </header>

          {/* Body */}
          <div className="relative">
            <div className="max-h-115 min-h-85 overflow-y-auto relative pb-10 no-scrollbar">
              {isLoading ? (
                <div className="py-16 text-center text-xs text-border-default-secondary font-medium animate-pulse">
                  Loading roster artists...
                </div>
              ) : filteredArtists.length === 0 ? (
                <div className="py-16 text-center text-xs text-border-default-secondary font-medium">
                  No artists found.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(95px,1fr))] gap-4 p-6">
                    {filteredArtists.map((artist) => (
                      <div
                        key={artist.reference || artist.name}
                        onClick={() => handleArtistClick(artist)}
                        className="w-fit flex flex-col items-center text-center gap-1.5 group cursor-pointer"
                      >
                        <div className="relative size-20 rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-105 border border-default-default/10">
                          <Image
                            src={artist.avatar_url || "/images/avatar.png"}
                            alt={artist.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        <p className="font-semibold text-sm text-default mt-1.5 leading-none line-clamp-1">
                          {artist.name}
                        </p>
                        <p className="text-xs text-border-default-secondary font-medium leading-none line-clamp-1">
                          {artist.subtitle}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Sentinel trigger for infinite scroll */}
                  <div ref={sentinelRef} className="h-4 w-full" />

                  {/* Loading more indicator */}
                  {isLoadingMore && (
                    <div className="py-4 text-center text-xs text-border-default-secondary font-medium">
                      Loading more...
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Artist Flow */}
      <CreateArtistFlow
        open={isCreateFlowOpen}
        onOpenChange={setIsCreateFlowOpen}
        trigger={<span className="hidden" />}
        onArtistCreated={handleCreatedArtist}
      />
    </>
  );
}

export default SelectCollaboratorModal;
