"use client";

import ReleaseCards from "@/components/realease-cards";
import ReleaseCard from "@/components/release-card";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface InfiniteReleasesProps {
  initialReleases?: Release[];
  scrollable?: boolean;
  pageSize?: number;
}

export default function InfiniteReleases({
  initialReleases = [],
  scrollable = false,
  pageSize = 10,
}: InfiniteReleasesProps) {
  const [releases, setReleases] = useState<Release[]>(initialReleases);
  const [page, setPage] = useState<number>(initialReleases.length > 0 ? 2 : 1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchNextPage = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const response = await api.get<{ releases: Release[] }>(
        `${API_ROUTES.RELEASES.MY}?page=${page}&size=${pageSize}`,
      );
      const items = Array.isArray(response.releases) ? response.releases : [];

      if (items.length < pageSize) {
        setHasMore(false);
      }

      if (items.length > 0) {
        setReleases((prev) => [...prev, ...items]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Failed to load releases:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, isLoading, hasMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
      },
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasMore]);

  useEffect(() => {
    if (initialReleases.length === 0 && page === 1 && hasMore && !isLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchNextPage();
    }
  }, [initialReleases.length, page, hasMore, isLoading, fetchNextPage]);

  return (
    <ReleaseCards scrollable={scrollable}>
      {releases.map((release) => (
        <ReleaseCard key={release.reference} {...release} />
      ))}
      {hasMore && (
        <div
          ref={sentinelRef}
          className={
            scrollable
              ? "flex items-center justify-center min-w-20 h-full"
              : "col-span-full flex items-center justify-center p-6 min-h-20"
          }
        >
          {isLoading && <Loader2 size={24} className="animate-spin text-default-tertiary" />}
        </div>
      )}
    </ReleaseCards>
  );
}
