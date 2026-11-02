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
  maxRetries?: number;
}

const RETRY_DELAY_MS = 1000;

export default function InfiniteReleases({
  initialReleases = [],
  scrollable = false,
  pageSize = 10,
  maxRetries = 3,
}: InfiniteReleasesProps) {
  const [releases, setReleases] = useState<Release[]>(initialReleases);
  const [page, setPage] = useState<number>(initialReleases.length > 0 ? 2 : 1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef<boolean>(false);
  const retryCountRef = useRef<number>(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchNextPage = useCallback(async () => {
    if (isFetchingRef.current || !hasMore || retryCountRef.current >= maxRetries) {
      return;
    }

    isFetchingRef.current = true;
    setIsLoading(true);
    let shouldScheduleRetry = false;

    try {
      const response = await api.get<{ releases: Release[] }>(
        `${API_ROUTES.RELEASES.INDEX}?page=${page}&size=${pageSize}`,
      );
      const items = Array.isArray(response?.releases) ? response.releases : [];

      if (items.length < pageSize) {
        setHasMore(false);
      }

      if (items.length > 0) {
        setReleases((prev) => [...prev, ...items]);
        setPage((prevPage) => prevPage + 1);
      }

      // Reset retry count and error on successful fetch
      retryCountRef.current = 0;
      setHasError(false);
    } catch (error) {
      console.error("Failed to load releases:", error);

      if (retryCountRef.current < maxRetries) {
        retryCountRef.current += 1;
        shouldScheduleRetry = true;
        retryTimeoutRef.current = setTimeout(() => {
          isFetchingRef.current = false;
          fetchNextPageRef.current();
        }, RETRY_DELAY_MS);
      } else {
        // Stop retrying once maxRetries is reached
        setHasError(true);
      }
    } finally {
      if (!shouldScheduleRetry) {
        isFetchingRef.current = false;
        setIsLoading(false);
      }
    }
  }, [page, pageSize, hasMore, maxRetries]);

  const fetchNextPageRef = useRef(fetchNextPage);
  fetchNextPageRef.current = fetchNextPage;

  // Clean up any pending retry timeout on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  const handleRetry = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    retryCountRef.current = 0;
    setHasError(false);
    isFetchingRef.current = false;
    fetchNextPageRef.current();
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || hasError) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !isFetchingRef.current && retryCountRef.current < maxRetries) {
          fetchNextPageRef.current();
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
  }, [hasMore, hasError, maxRetries, page]);

  useEffect(() => {
    if (
      initialReleases.length === 0 &&
      page === 1 &&
      hasMore &&
      !isLoading &&
      !hasError &&
      !isFetchingRef.current &&
      retryCountRef.current < maxRetries
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchNextPageRef.current();
    }
  }, [initialReleases.length, page, hasMore, isLoading, hasError, maxRetries]);

  return (
    <ReleaseCards scrollable={scrollable}>
      {releases.map((release) => (
        <ReleaseCard key={release.reference} {...release} />
      ))}
      {hasMore && !hasError && (
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
      {hasError && (
        <div
          className={
            scrollable
              ? "flex flex-col items-center justify-center min-w-36 h-full p-4 text-center gap-2"
              : "col-span-full flex flex-col items-center justify-center p-6 min-h-20 text-center gap-2"
          }
        >
          <p className="text-xs text-default-tertiary">Failed to load releases</p>
          <button
            type="button"
            onClick={handleRetry}
            className="text-xs font-medium text-brand-blue hover:underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}
    </ReleaseCards>
  );
}
