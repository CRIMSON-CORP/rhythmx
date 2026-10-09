"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface PaginationResult<T> {
  items: T[];
  hasMore: boolean;
}

export interface UseInfiniteScrollOptions<T> {
  fetchPage: (page: number, search: string) => Promise<PaginationResult<T>>;
  search?: string;
  debounceMs?: number;
  enabled?: boolean;
  initialItems?: T[];
  initialHasMore?: boolean;
}

export function useInfiniteScroll<T>({
  fetchPage,
  search = "",
  debounceMs = 300,
  enabled = true,
  initialItems = [],
  initialHasMore = true,
}: UseInfiniteScrollOptions<T>) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [page, setPage] = useState<number>(initialItems.length > 0 ? 2 : 1);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isInitialMount = useRef(true);

  // Keep a stable ref to fetchPage
  const fetchPageRef = useRef(fetchPage);
  useEffect(() => {
    fetchPageRef.current = fetchPage;
  }, [fetchPage]);

  // Load initial page (or reset on search/enabled change)
  useEffect(() => {
    if (!enabled) return;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      // If initial items were provided and search is empty, skip fetching page 1 on mount
      if (initialItems.length > 0 && !search) {
        return;
      }
    }

    let isMounted = true;
    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const result = await fetchPageRef.current(1, search);
        if (isMounted) {
          setItems(result.items);
          setHasMore(result.hasMore);
          setPage(2);
        }
      } catch (err) {
        console.error("Failed to fetch initial page:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }, debounceMs);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [search, debounceMs, enabled]);

  // Fetch next page
  const fetchNextPage = useCallback(async () => {
    if (isLoading || isLoadingMore || !hasMore || !enabled) return;

    setIsLoadingMore(true);
    try {
      const result = await fetchPageRef.current(page, search);
      setItems((prev) => [...prev, ...result.items]);
      setHasMore(result.hasMore);
      setPage((prevPage) => prevPage + 1);
    } catch (err) {
      console.error("Failed to load next page:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoading, isLoadingMore, hasMore, enabled, page, search]);

  // Setup intersection observer on sentinel
  useEffect(() => {
    if (!enabled || !hasMore) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    observerRef.current = new IntersectionObserver(
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

    observerRef.current.observe(sentinel);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchNextPage, enabled, hasMore]);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchPageRef.current(1, search);
      setItems(result.items);
      setHasMore(result.hasMore);
      setPage(2);
    } catch (err) {
      console.error("Failed to refetch:", err);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  return {
    items,
    setItems,
    page,
    hasMore,
    isLoading,
    isLoadingMore,
    sentinelRef,
    fetchNextPage,
    refetch,
  };
}

export default useInfiniteScroll;
