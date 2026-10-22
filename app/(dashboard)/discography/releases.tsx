"use client";

import { DialogClose } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Clock, Loader2, Search, X } from "lucide-react";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";

interface ReleasesModalProps {
  title: string;
  status?: string;
  releases?: Release[];
  type?: "approved" | "pending" | "rejected";
}

function Releases({
  title,
  status,
  releases: initialReleases,
  type = "approved",
}: ReleasesModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [releases, setReleases] = useState<Release[]>(initialReleases ?? []);
  const [isLoading, setIsLoading] = useState(!initialReleases && !!status);

  useEffect(() => {
    if (!status) return;
    let isMounted = true;
    setIsLoading(true);

    api
      .get<{ releases: Release[] }>(`${API_ROUTES.RELEASES.MY}?status=${status}&limit=50`)
      .then((res) => {
        if (isMounted && res?.releases) {
          setReleases(res.releases);
        }
      })
      .catch((err) => {
        console.error(`Failed to load ${status} releases:`, err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [status]);

  const filteredReleases = releases.filter((release) => {
    if (!searchQuery.trim()) return true;
    return release.title?.toLowerCase().includes(searchQuery.toLowerCase().trim());
  });

  return (
    <>
      <header className="p-5 flex items-center gap-4 text-default justify-between">
        <span className="text-sm leading-tight font-semibold">{title}</span>
        <DialogClose className="p-2 hover:bg-black/5 rounded-full transition-colors">
          <X size={20} className="text-default" />
        </DialogClose>
      </header>
      <div className="px-3 md:px-6 pb-10.5 overflow-auto max-h-[75vh]">
        <div className="flex gap-1.5 md:gap-4 flex-wrap items-center">
          <div className="flex items-center grow w-full gap-2.5 px-4 py-3 bg-white/20 rounded-full">
            <Search size={16} className="text-default-tertiary shrink-0" />
            <input
              placeholder="Search releases"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none w-full text-default placeholder:text-default-tertiary text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-default-tertiary hover:text-default p-0.5"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="p-4 flex flex-col gap-4 overflow-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 gap-3 text-default-tertiary">
              <Loader2 size={24} className="animate-spin" />
              <span className="text-sm">Loading releases...</span>
            </div>
          ) : filteredReleases.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center text-default-tertiary">
              <p className="text-sm font-medium">No releases found</p>
            </div>
          ) : (
            filteredReleases.map((release) => {
              const platformNames = Array.isArray(release.platforms)
                ? release.platforms.filter(Boolean).join(", ")
                : "";

              return (
                <div
                  key={release.reference}
                  className="flex items-center gap-4 group p-2 hover:bg-black/5 rounded-2xl transition-colors"
                >
                  <div className="relative size-14 rounded-full overflow-hidden bg-black/10 shrink-0">
                    {release.cover_url ? (
                      <Image
                        src={release.cover_url}
                        alt={release.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-default-tertiary uppercase">
                        {release.title?.slice(0, 2) || "RX"}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col grow min-w-0">
                    <span className="font-medium text-base truncate">{release.title}</span>
                    <div className="flex items-center gap-2 text-xs text-default-tertiary mt-0.5">
                      <span className="font-medium capitalize">{release.type}</span>
                      {platformNames && (
                        <>
                          <span>•</span>
                          <span className="truncate">{platformNames}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {type === "approved" ? (
                    <div className="px-3 py-1.5 rounded-20 bg-[#DCFCE7] text-[#14532D] text-xs font-medium shrink-0">
                      Approved
                    </div>
                  ) : type === "pending" ? (
                    <div className="px-3 py-1.5 rounded-20 bg-[#FFF1C2] text-[#FF9A03] flex items-center gap-1.5 text-xs font-medium shrink-0">
                      <Clock size={14} />
                      Pending
                    </div>
                  ) : (
                    <div className="px-3 py-1.5 rounded-20 bg-[#FEE2E2] text-[#DC2626] text-xs font-medium shrink-0">
                      Rejected
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

export default Releases;
