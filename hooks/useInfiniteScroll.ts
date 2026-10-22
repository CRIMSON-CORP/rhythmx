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

function areArraysShallowEqual<T>(a?: T[], b?: T[]): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function useInfiniteScroll<T>({
  fetchPage,
  search = "",
  debounceMs = 300,
  enabled = true,
  initialItems,
  initialHasMore = true,
}: UseInfiniteScrollOptions<T>) {
  const hasInitialItems = initialItems !== undefined;

  const [items, setItems] = useState<T[]>(initialItems ?? []);
  const [page, setPage] = useState<number>(hasInitialItems ? 2 : 1);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Track initial props to detect when server sends fresh data (e.g., router.refresh())
  const prevInitialItemsRef = useRef(initialItems);
  const prevInitialHasMoreRef = useRef(initialHasMore);

  // Track search query changes to only trigger search fetch when search genuinely changes
  const prevSearchRef = useRef(search);
  const isInitialMount = useRef(true);

  // Keep a stable ref to fetchPage
  const fetchPageRef = useRef(fetchPage);
  useEffect(() => {
    fetchPageRef.current = fetchPage;
  }, [fetchPage]);

  // Sync state when initialItems or initialHasMore updates from parent (e.g. router.refresh())
  useEffect(() => {
    if (initialItems === undefined) return;

    const itemsChanged = !areArraysShallowEqual(prevInitialItemsRef.current, initialItems);
    const hasMoreChanged = prevInitialHasMoreRef.current !== initialHasMore;

    if (itemsChanged || hasMoreChanged) {
      prevInitialItemsRef.current = initialItems;
      prevInitialHasMoreRef.current = initialHasMore;

      // Only sync if not currently actively searching
      if (!search) {
        setItems(initialItems);
        setHasMore(initialHasMore);
        setPage(2);
      }
    }
  }, [initialItems, initialHasMore, search]);

  // Handle search changes or initial fetch when initialItems was omitted
  useEffect(() => {
    if (!enabled) return;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevSearchRef.current = search;

      // If initial items were provided (even if empty []), do NOT fetch page 1 on mount!
      if (hasInitialItems) {
        return;
      }
      // If initialItems was omitted (undefined), proceed with initial fetch below
    } else {
      // On subsequent renders, only fetch if the search query actually changed
      if (search === prevSearchRef.current) {
        return;
      }
      prevSearchRef.current = search;
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
        console.error("Failed to load initial page:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }, debounceMs);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [search, debounceMs, enabled, hasInitialItems]);

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
