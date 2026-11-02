import { isRedirectError } from "next/dist/client/components/redirect-error";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import HeaderNotificationsClient from "./header-notifications-client";

interface NotificationsResponse {
  notifications?: Notification[];
  meta?: {
    unread_count?: number;
  };
}

export default async function HeaderNotifications() {
  let hasUnread = false;

  try {
    const data = await api.get<NotificationsResponse>(
      `${API_ROUTES.NOTIFICATIONS.INDEX}?page=1&limit=1`,
    );
    const unreadCount = data?.meta?.unread_count ?? 0;
    hasUnread = unreadCount > 0;
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Failed to fetch notification count for header:", error);
  }

  return <HeaderNotificationsClient initialHasUnread={hasUnread} />;
}
