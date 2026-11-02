"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Disc, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { format, isToday } from "date-fns";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { cn } from "@/lib/utils";
import { goeyToast } from "goey-toast";

interface NotificationListProps {
  initialNotifications?: Notification[];
  pageSize?: number;
}

type NotificationTab = "all" | "invites";

/**
 * Formats notification created_at timestamp into Figma style (e.g., "2:23pm" for today, "Oct 20" for older dates).
 */
function formatNotificationTime(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const normalized = dateStr.includes(" ") ? dateStr.replace(" ", "T") : dateStr;
    const date = new Date(normalized);
    if (isNaN(date.getTime())) return dateStr;
    if (isToday(date)) {
      return format(date, "h:mma").toLowerCase();
    }
    return format(date, "MMM d");
  } catch {
    return dateStr;
  }
}

export default function NotificationList({
  initialNotifications = [],
  pageSize = 20,
}: NotificationListProps) {
  const [activeTab, setActiveTab] = useState<NotificationTab>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchNotificationsPage = useCallback(
    async (page: number, search: string) => {
      try {
        const params = new URLSearchParams();
        if (search === "invites") {
          params.set("filter", "invites");
        }
        params.set("page", String(page));
        params.set("limit", String(pageSize));

        const response = await api.get<
          | {
              notifications: Notification[];
              meta?: { pagination?: { has_next?: boolean } };
            }
          | Notification[]
        >(`${API_ROUTES.NOTIFICATIONS.INDEX}?${params.toString()}`);

        const items = Array.isArray(response) ? response : (response?.notifications ?? []);

        const metaHasNext = !Array.isArray(response)
          ? response?.meta?.pagination?.has_next
          : undefined;

        const hasMore = typeof metaHasNext === "boolean" ? metaHasNext : items.length >= pageSize;

        return {
          items,
          hasMore,
        };
      } catch (error) {
        console.error("Failed to load notifications:", error);
        return { items: [], hasMore: false };
      }
    },
    [pageSize],
  );

  const {
    items: notifications,
    setItems: setNotifications,
    isLoading,
    isLoadingMore,
    hasMore,
    sentinelRef,
  } = useInfiniteScroll<Notification>({
    fetchPage: fetchNotificationsPage,
    search: activeTab,
    initialItems: activeTab === "all" ? initialNotifications : undefined,
    initialHasMore: initialNotifications.length >= pageSize,
  });

  const handleAccept = async (reference: string) => {
    try {
      setActionLoading(reference);
      await api.post(API_ROUTES.NOTIFICATIONS.ACCEPT(reference), {});
      setNotifications((prev) =>
        prev.map((item) =>
          item.reference === reference ? { ...item, invite_status: "accepted" } : item,
        ),
      );
      goeyToast.success("Invite accepted");
    } catch (err: unknown) {
      console.error("Failed to accept invite:", err);
      goeyToast.error((err as Error)?.message || "Failed to accept invite");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (reference: string) => {
    try {
      setActionLoading(reference);
      await api.post(API_ROUTES.NOTIFICATIONS.DECLINE(reference), {});
      setNotifications((prev) =>
        prev.map((item) =>
          item.reference === reference ? { ...item, invite_status: "declined" } : item,
        ),
      );
      goeyToast.success("Invite declined");
    } catch (err: unknown) {
      console.error("Failed to decline invite:", err);
      goeyToast.error((err as Error)?.message || "Failed to decline invite");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-2 h-full">
      {/* Tabs */}
      <div className="flex items-center gap-2 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
            activeTab === "all"
              ? "bg-[#F3F4F6] text-default"
              : "text-default-tertiary hover:text-default",
          )}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("invites")}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
            activeTab === "invites"
              ? "bg-[#F3F4F6] text-default"
              : "text-default-tertiary hover:text-default",
          )}
        >
          Invites
        </button>
      </div>

      {/* Loading state on tab change or initial fetch */}
      {isLoading && notifications.length === 0 && (
        <div className="flex items-center justify-center p-12 text-center text-default-tertiary">
          <Loader2 size={24} className="animate-spin text-default-tertiary" />
        </div>
      )}

      {/* Empty State */}
      {notifications.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full min-h-90 text-center p-6 gap-6">
          <Image
            src="/images/empty-notifications.svg"
            alt="No new notifications"
            width={164}
            height={179}
            className="select-none pointer-events-none"
          />
          <p className="font-medium text-border-default-secondary">
            {activeTab === "invites" ? "No new invites" : "No new notifications"}
          </p>
        </div>
      )}

      {/* Notifications List */}
      {notifications.length > 0 && (
        <div className="flex flex-col">
          {notifications.map((notification) => {
            // Case 1: Release Rejected Notification
            if (notification.kind === "release_rejected") {
              return (
                <div
                  key={notification.reference}
                  className="flex items-start gap-3.5 py-4 border-b border-default/5 transition-all duration-200"
                >
                  {notification.release?.cover_url ? (
                    <Image
                      src={notification.release.cover_url}
                      width={48}
                      height={48}
                      alt={notification.title}
                      className="size-12 rounded-full object-cover shrink-0"
                      unoptimized
                    />
                  ) : (
                    <div className="size-12 rounded-full bg-default-secondary flex items-center justify-center shrink-0">
                      <Disc size={20} className="text-default-tertiary" />
                    </div>
                  )}
                  <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <header className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-default text-sm truncate">
                        {notification.title}
                      </span>
                      <span className="text-xs text-default-tertiary shrink-0">
                        {formatNotificationTime(notification.created_at)}
                      </span>
                    </header>
                    {notification.release?.platforms &&
                      notification.release.platforms.length > 0 && (
                        <p className="text-xs text-default-tertiary font-medium">
                          <span className="text-default-tertiary/70 mr-1.5">Group</span>
                          {notification.release.platforms.join(". ")}
                        </p>
                      )}
                    <div className="flex items-center gap-3 pt-1">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#FEE2E2] text-[#EF4444]">
                        Rejected
                      </span>
                      {notification.release?.reference && (
                        <Link
                          href={`/discography/release/draft/${notification.release.reference}`}
                          className="text-xs font-medium text-[#007AFF] hover:underline"
                        >
                          Update & Submit
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            // Case 2: Split Invite or Label Invite
            if (notification.kind === "split_invite" || notification.kind === "label_invite") {
              return (
                <div
                  key={notification.reference}
                  className="flex flex-col gap-1.5 py-4 border-b border-default/5 transition-all duration-200"
                >
                  <header className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-default text-sm truncate">
                      {notification.title}
                    </span>
                    <span className="text-xs text-default-tertiary shrink-0">
                      {formatNotificationTime(notification.created_at)}
                    </span>
                  </header>
                  <p className="text-sm font-medium text-border-default-secondary leading-relaxed">
                    {notification.message}
                  </p>

                  {notification.invite_status === "pending" && (
                    <div className="flex items-center justify-end gap-4 pt-1">
                      <button
                        type="button"
                        onClick={() => handleDecline(notification.reference)}
                        disabled={actionLoading === notification.reference}
                        className="text-xs font-medium text-[#EF4444] hover:opacity-80 transition-opacity disabled:opacity-50"
                      >
                        Decline
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAccept(notification.reference)}
                        disabled={actionLoading === notification.reference}
                        className="text-xs font-medium text-[#007AFF] hover:opacity-80 transition-opacity disabled:opacity-50 inline-flex items-center gap-1"
                      >
                        {actionLoading === notification.reference && (
                          <Loader2 size={12} className="animate-spin inline" />
                        )}
                        Accept invite
                      </button>
                    </div>
                  )}

                  {notification.invite_status === "accepted" && (
                    <div className="flex items-center justify-end pt-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]">
                        <Check size={12} className="text-[#16A34A]" />
                        Accepted
                      </span>
                    </div>
                  )}

                  {notification.invite_status === "declined" && (
                    <div className="flex items-center justify-end pt-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-100">
                        Declined
                      </span>
                    </div>
                  )}
                </div>
              );
            }

            // Case 3: General / Default Notifications
            return (
              <div
                key={notification.reference}
                className="flex items-start gap-3.5 py-4 border-b border-default/5 transition-all duration-200"
              >
                {notification.image && (
                  <Image
                    src={notification.image}
                    width={48}
                    height={48}
                    alt={notification.title}
                    className="size-12 rounded-lg object-cover shrink-0"
                  />
                )}
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <header className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-default text-sm truncate">
                      {notification.title}
                    </span>
                    <span className="text-xs text-default-tertiary shrink-0">
                      {formatNotificationTime(notification.created_at)}
                    </span>
                  </header>
                  <p className="text-sm font-medium text-border-default-secondary leading-relaxed wrap-break-word">
                    {notification.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Infinite Scroll Sentinel */}
      {hasMore && (
        <div
          ref={sentinelRef}
          className="col-span-full flex items-center justify-center p-6 min-h-16"
        >
          {(isLoading || isLoadingMore) && (
            <Loader2 size={24} className="animate-spin text-default-tertiary" />
          )}
        </div>
      )}
    </div>
  );
}
