"use client";

import { DialogClose } from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Search as SearchIcon, ListFilter, Loader2, Disc } from "lucide-react";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>(() => {
    try {
      const stored = localStorage.getItem("recentSearches");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (err) {
      console.error("Failed to parse recent searches from localStorage:", err);
    }
    return [];
  });
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Save an item to recent searches (deduped, max 8)
  const saveRecentSearch = (item: SearchResult) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.reference !== item.reference);
      const updated = [item, ...filtered].slice(0, 8);
      try {
        localStorage.setItem("recentSearches", JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save recent searches:", err);
      }
      return updated;
    });
  };

  // Remove a single item from recent searches
  const removeRecentSearch = (reference: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s.reference !== reference);
      try {
        localStorage.setItem("recentSearches", JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to update recent searches:", err);
      }
      return updated;
    });
  };

  // Clear all recent searches
  const clearAllRecent = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem("recentSearches");
    } catch (err) {
      console.error("Failed to clear recent searches:", err);
    }
  };

  // Debounced search query
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchResults([]);
      setIsLoading(false);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await api.get<SearchResponseData>(API_ROUTES.SEARCH(trimmed));
        setSearchResults(data?.results ?? []);
        setHasSearched(true);
      } catch (err) {
        console.error("Search query failed:", err);
        setSearchResults([]);
        setHasSearched(true);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const formatPlatforms = (platforms?: string[]) => {
    if (!platforms || platforms.length === 0) return "";
    return platforms.join(". ");
  };

  return (
    <>
      <header className="px-6 pt-6 flex gap-6 items-center">
        <div className="flex items-center grow gap-2.5 px-4 py-3 bg-white/20 rounded-full">
          {isLoading ? (
            <Loader2 size={16} className="animate-spin text-brand-orange shrink-0" />
          ) : (
            <SearchIcon size={16} className="text-default-tertiary shrink-0" />
          )}
          <input
            placeholder="Search anything"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none w-full text-border-default-secondary"
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-default-tertiary hover:text-default"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button type="button" aria-label="Filter results">
          <ListFilter size={24} className="text-brand-orange" />
        </button>
        <DialogClose>
          <X size={24} className="text-default" />
        </DialogClose>
      </header>

      <div className="p-6 flex flex-col gap-4 max-h-[65vh] overflow-y-auto">
        {/* Scenario 1: Search Query typed */}
        {searchQuery.trim().length > 0 ? (
          <>
            {isLoading && searchResults.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="animate-spin text-brand-orange" />
              </div>
            )}

            {!isLoading && hasSearched && searchResults.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center text-border-default-secondary">
                <p className="font-medium text-sm">
                  No results found for &ldquo;{searchQuery}&rdquo;
                </p>
                <span className="text-xs text-default-tertiary mt-1">
                  Check your spelling or try another keyword
                </span>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="flex flex-col gap-4">
                <span className="text-default text-sm font-medium">
                  Search Results ({searchResults.length})
                </span>
                <div className="flex flex-col gap-3">
                  {searchResults.map((result) => {
                    const platformsText = formatPlatforms(result.platforms);
                    return (
                      <DialogClose asChild key={result.reference}>
                        <Link
                          href={`/discography/release/${result.reference}`}
                          onClick={() => saveRecentSearch(result)}
                          className="flex items-center gap-4 group hover:bg-black/3 p-2 -mx-2 rounded-2xl transition-colors cursor-pointer"
                        >
                          {result.cover_url ? (
                            <Image
                              src={result.cover_url}
                              alt={result.title}
                              width={56}
                              height={56}
                              className="rounded-full size-14 object-cover shrink-0"
                              unoptimized
                            />
                          ) : (
                            <div className="size-14 rounded-full bg-default-secondary flex items-center justify-center shrink-0">
                              <Disc size={24} className="text-default-tertiary" />
                            </div>
                          )}
                          <div className="flex flex-col grow min-w-0">
                            <span className="font-medium text-base truncate">{result.title}</span>
                            <div className="flex items-center gap-2 text-sm mt-0.5">
                              {result.type && (
                                <span className="text-default-tertiary font-medium text-xs capitalize shrink-0">
                                  {result.type}
                                </span>
                              )}
                              {platformsText && (
                                <span className="text-border-default-secondary text-xs truncate">
                                  {platformsText}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </DialogClose>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Scenario 2: Search Query empty -> Show Recent Searches */
          <>
            {recentSearches.length > 0 ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-default text-sm font-medium">Recent Search</span>
                  <button
                    type="button"
                    onClick={clearAllRecent}
                    className="text-xs text-default-tertiary hover:text-default transition-colors"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  <AnimatePresence mode="popLayout">
                    {recentSearches.map((search) => {
                      const platformsText = formatPlatforms(search.platforms);
                      return (
                        <motion.div
                          key={search.reference}
                          exit={{ opacity: 0, scale: 0.95 }}
                          layout="y"
                          className="flex items-center gap-4 group hover:bg-black/3 p-2 -mx-2 rounded-2xl transition-colors"
                        >
                          <DialogClose asChild className="flex items-center gap-4 grow min-w-0">
                            <Link
                              href={`/discography/release/${search.reference}`}
                              onClick={() => saveRecentSearch(search)}
                              className="flex items-center gap-4 grow min-w-0 cursor-pointer"
                            >
                              {search.cover_url ? (
                                <Image
                                  src={search.cover_url}
                                  alt={search.title}
                                  width={56}
                                  height={56}
                                  className="rounded-full size-14 object-cover shrink-0"
                                  unoptimized
                                />
                              ) : (
                                <div className="size-14 rounded-full bg-default-secondary flex items-center justify-center shrink-0">
                                  <Disc size={24} className="text-default-tertiary" />
                                </div>
                              )}
                              <div className="flex flex-col grow min-w-0">
                                <span className="font-medium text-base truncate">
                                  {search.title}
                                </span>
                                <div className="flex items-center gap-2 text-sm mt-0.5">
                                  {search.type && (
                                    <span className="text-default-tertiary font-medium text-xs capitalize shrink-0">
                                      {search.type}
                                    </span>
                                  )}
                                  {platformsText && (
                                    <span className="text-border-default-secondary text-xs truncate">
                                      {platformsText}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </Link>
                          </DialogClose>
                          <button
                            type="button"
                            className="self-center p-2 text-default-tertiary hover:text-default shrink-0"
                            onClick={(e) => removeRecentSearch(search.reference, e)}
                            aria-label="Remove from recent searches"
                          >
                            <X size={16} />
                          </button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-border-default-secondary">
                <SearchIcon size={32} className="text-default-tertiary/40 mb-2" />
                <p className="text-sm font-medium">Search anything in your discography</p>
                <span className="text-xs text-default-tertiary mt-1">
                  Releases, singles, albums, and tracks
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Search;
