"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";

interface NotificationListProps {
  initialNotifications?: Notification[];
  pageSize?: number;
}

export default function NotificationList({
  initialNotifications = [],
  pageSize = 20,
}: NotificationListProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [page, setPage] = useState<number>(initialNotifications.length >= pageSize ? 2 : 1);
  const [hasMore, setHasMore] = useState<boolean>(initialNotifications.length >= pageSize);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchNextPage = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const response = await api.get<{ notifications: Notification[] } | Notification[]>(
        `${API_ROUTES.NOTFICATIONS.LIST}?page=${page}&limit=${pageSize}`,
      );
      const items = Array.isArray(response)
        ? response
        : response?.notifications ?? [];

      if (items.length < pageSize) {
        setHasMore(false);
      }

      if (items.length > 0) {
        setNotifications((prev) => {
          const existingRefs = new Set(prev.map((n) => n.reference));
          const newItems = items.filter((item) => !existingRefs.has(item.reference));
          return [...prev, ...newItems];
        });
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Failed to load notifications:", error);
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
    if (initialNotifications.length === 0 && page === 1 && hasMore && !isLoading) {
      fetchNextPage();
    }
  }, [initialNotifications.length, page, hasMore, isLoading, fetchNextPage]);

  if (notifications.length === 0 && !isLoading) {
    return (
      <div className="flex items-center justify-center p-8 text-center text-default-tertiary">
        <p className="text-sm font-medium">No notifications yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {notifications.map((notification) => (
        <div
          key={notification.reference}
          className="flex items-start gap-4 py-4 hover:bg-default-secondary/50 border-b border-b-default-default transition-all duration-200 group"
        >
          {notification.image ? (
            <Image
              src={notification.image}
              width={50}
              height={50}
              alt={notification.title}
              className="rounded-lg"
            />
          ) : null}
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <header className="flex items-center justify-between gap-2">
              <span className="font-medium text-default truncate">{notification.title}</span>
              <span className="text-sm text-default shrink-0">{notification.created_at}</span>
            </header>
            <p className="text-border-default-secondary font-medium text-sm leading-relaxed wrap-break-word">
              {notification.message}
            </p>
          </div>
        </div>
      ))}
      {hasMore && (
        <div
          ref={sentinelRef}
          className="col-span-full flex items-center justify-center p-6 min-h-16"
        >
          {isLoading && <Loader2 size={24} className="animate-spin text-default-tertiary" />}
        </div>
      )}
    </div>
  );
}
