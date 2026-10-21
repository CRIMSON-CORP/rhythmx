"use client";

import { ArrowUpRight, Eye, Loader2, Search } from "lucide-react";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import useWithdrawalStore from "@/store/withdrawal-store";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { formatCurrency } from "@/lib/utils";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

function SkeletonRow() {
  return (
    <li className="grid grid-cols-subgrid col-start-1 col-end-4 items-center">
      <div className="flex items-center gap-4">
        <div className="w-13.5 h-13.5 rounded-full bg-default-default/50 animate-pulse shrink-0" />
        <div className="grow flex flex-col gap-2">
          <div className="w-24 h-4 bg-default-default/50 animate-pulse rounded" />
          <div className="w-16 h-3 bg-default-default/50 animate-pulse rounded" />
        </div>
      </div>
      <div className="w-24 h-9 bg-default-default/50 animate-pulse rounded-full" />
      <div className="w-20 h-9 bg-default-default/50 animate-pulse rounded-full" />
    </li>
  );
}

function SkeletonList() {
  return (
    <ul className="grid grid-cols-subgrid col-start-1 col-end-4 gap-4 overflow-hidden">
      {Array.from({ length: 5 }).map((_, idx) => (
        <SkeletonRow key={idx} />
      ))}
    </ul>
  );
}

function SelectArtistView() {
  const { setForm, setView } = useWithdrawalStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [currency, setCurrency] = useState<string>("GBP");
  const [error, setError] = useState<string | null>(null);

  const fetchArtistsPage = useCallback(async (page: number, search: string) => {
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      params.set("page", String(page));
      params.set("limit", "20");

      const res = await api.get<WithdrawalArtistsResponse>(
        API_ROUTES.WITHDRAWALS.ARTISTS(params.toString()),
      );

      if (res?.currency) {
        setCurrency(res.currency);
      }
      setError(null);

      return {
        items: res?.artists || [],
        hasMore: res?.meta?.pagination?.has_next ?? false,
      };
    } catch (err: unknown) {
      console.error("Failed to load withdrawal artists:", err);
      if (page === 1) {
        setError((err as { message?: string })?.message || "Failed to load artists.");
      }
      return { items: [], hasMore: false };
    }
  }, []);

  const {
    items: artists,
    isLoading,
    isLoadingMore,
    sentinelRef,
    refetch,
  } = useInfiniteScroll<WithdrawalArtistItem>({
    fetchPage: fetchArtistsPage,
    search: searchQuery,
    debounceMs: 300,
  });

  const handleSelectArtist = (reference: string) => {
    setForm({ selected_artist: reference });
    setView("enter-amount");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Ambient top gradient matching Figma node 2617-8692 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0 h-43.25 z-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_100%),linear-gradient(180deg,rgba(136,0,255,0.25)_0%,rgba(0,242,234,0)_78.61%)]"
        style={{
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%), linear-gradient(180deg, rgba(136, 0, 255, 0.25) 0%, rgba(0, 242, 234, 0) 78.61%)",
        }}
      />

      {/* Frosted search input pill */}
      <div className="px-6 relative z-10">
        <div className="flex w-full gap-2.5 px-4.5 py-3 rounded-full items-center bg-white/20 backdrop-blur-md">
          <Search size={16} className="text-default-tertiary" />
          <input
            type="search"
            className="bg-transparent w-full outline-none placeholder:text-default-tertiary text-default font-medium text-sm"
            placeholder="Search Artist"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Artist table list */}
      <div className="grid gap-2.5 grid-cols-[1fr_max-content_max-content] px-6 pb-6 mt-4 relative z-10">
        <header className="grid grid-cols-subgrid col-start-1 col-end-4 text-sm text-default font-semibold pb-3 mb-2">
          <p>Artist</p>
          <p>Action</p>
          <p className="flex items-center gap-2 select-none">
            <span>Balance</span>
            <Eye size={16} />
          </p>
        </header>

        {isLoading ? (
          <SkeletonList />
        ) : error ? (
          <div className="col-start-1 col-end-4 text-center py-8 flex flex-col items-center gap-3">
            <p className="text-default-tertiary font-medium text-sm">{error}</p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : artists.length === 0 ? (
          <div className="col-start-1 col-end-4 text-center py-8 text-default-tertiary font-medium text-sm">
            No artists found
          </div>
        ) : (
          <ul className="grid grid-cols-subgrid col-start-1 col-end-4 gap-4 overflow-auto max-h-[calc(100vh-15rem)] scrollbar-none">
            {artists.map((artist) => {
              const numericBalance =
                typeof artist.balance === "number"
                  ? artist.balance
                  : parseFloat(artist.balance) || 0;

              return (
                <li
                  key={artist.reference}
                  className="grid grid-cols-subgrid col-start-1 col-end-4 items-center"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <Image
                      src={artist.avatar_url || "/images/release-1.png"}
                      width={54}
                      height={54}
                      className="rounded-full bg-neutral-100 object-cover flex-none aspect-square"
                      alt={artist.name}
                      unoptimized
                    />
                    <div className="grow min-w-0 flex flex-col gap-1">
                      <p className="font-semibold text-base text-default truncate">{artist.name}</p>
                      <p className="font-normal text-xs text-default-tertiary truncate">
                        {artist.location}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleSelectArtist(artist.reference)}
                    size="sm"
                    variant="outline"
                  >
                    <span>Withdraw</span>
                    <ArrowUpRight size={16} />
                  </Button>
                  <p className="px-4 py-2 rounded-full bg-page-background font-semibold text-sm text-center text-default whitespace-nowrap">
                    {formatCurrency(numericBalance, currency)}
                  </p>
                </li>
              );
            })}

            {/* Sentinel element for infinite scroll */}
            <div ref={sentinelRef} className="col-start-1 col-end-4 h-2" />

            {/* Loading indicator for next pages */}
            {isLoadingMore && (
              <li className="col-start-1 col-end-4 flex items-center justify-center py-4">
                <Loader2 size={20} className="animate-spin text-default-tertiary" />
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SelectArtistView;
