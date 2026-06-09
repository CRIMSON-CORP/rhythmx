"use client";
import { ArrowUpRight, Eye, Search } from "lucide-react";

import { Suspense, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import useWithdrawalStore from "@/store/withdrawal-store";
import useApi from "@/hooks/useApi";

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

interface ArtistListProps {
  search: string;
  onSelectArtist: (id: string) => void;
}

function ArtistList({ search, onSelectArtist }: ArtistListProps) {
  const artists = useApi<Artist[]>(`/api/artists?search=${encodeURIComponent(search)}`);

  if (artists.length === 0) {
    return (
      <div className="col-start-1 col-end-4 text-center py-8 text-default-tertiary font-medium">
        No artists found
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-subgrid col-start-1 col-end-4 gap-4 overflow-auto max-h-[calc(100vh-15rem)] scrollbar-none">
      {artists.map((artist) => (
        <li key={artist.id} className="grid grid-cols-subgrid col-start-1 col-end-4 items-center">
          <div className="flex items-center gap-4">
            <Image
              src={artist.image}
              width={54}
              height={54}
              className="rounded-full bg-neutral-100 object-cover flex-none aspect-square"
              alt={artist.name}
              onError={(e) => {
                // Fallback standard avatar if mockup image path fails
                const img = e.target as HTMLImageElement;
                img.src = "/images/release-1.png";
              }}
            />
            <div className="grow flex flex-col gap-1">
              <p className="font-medium text-default">{artist.name}</p>
              <p className="font-medium text-xs text-border-default-secondary">{artist.location}</p>
            </div>
          </div>
          <Button onClick={() => onSelectArtist(artist.id)} size="sm" variant="outline">
            <span>Withdraw</span>
            <ArrowUpRight size={16} />
          </Button>
          <p className="px-2.5 py-2 rounded-full bg-page-background font-semibold text-sm text-center text-default">
            {"$" +
              (artist.balance ?? 0).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
          </p>
        </li>
      ))}
    </ul>
  );
}

function SelectArtistView() {
  const { setForm, setView } = useWithdrawalStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input changes by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleSelectArtist = (id: string) => {
    setForm({ selected_artist: id });
    setView("enter-amount");
  };

  return (
    <div className="overflow-auto h-full">
      <div className="absolute w-full top-0 right-0 h-64 bg-linear-to-b from-[#8800FF] to-[#00F2EA]/0 -z-10 opacity-25 blur-3xl"></div>
      <div className="px-6">
        <div className="flex w-full gap-2.5 p-4 rounded-full items-center bg-transparent">
          <Search size={16} className="text-default-tertiary" />
          <input
            type="search"
            className="bg-transparent w-full outline-none placeholder:text-default-tertiary text-default font-medium"
            placeholder="Search Artist"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="grid gap-2.5 grid-cols-[1fr_max-content_max-content] px-6 pb-6 mt-4">
        <header className="grid grid-cols-subgrid col-start-1 col-end-4 text-sm text-default font-semibold border-b border-default-default/10 pb-3 mb-2">
          <p>Artist</p>
          <p>Action</p>
          <p className="flex items-center gap-2 select-none">
            <span>Balance</span>
            <Eye size={16} />
          </p>
        </header>

        {/* Suspense boundary wrapping the list fetching process */}
        <Suspense fallback={<SkeletonList />}>
          <ArtistList search={debouncedSearch} onSelectArtist={handleSelectArtist} />
        </Suspense>
      </div>
    </div>
  );
}

export default SelectArtistView;
