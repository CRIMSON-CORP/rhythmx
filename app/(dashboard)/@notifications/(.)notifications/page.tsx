import NotificationsPanel from "@/components/notifications-panel";
import NotificationList from "@/components/notification-list";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";

export default async function InterceptedNotificationsPage() {
  let initialNotifications: Notification[] = [];

  try {
    const data = await api.get<{ notifications: Notification[] }>(
      `${API_ROUTES.NOTIFICATIONS.INDEX}?page=1&limit=20`,
    );
    if (data?.notifications && Array.isArray(data.notifications)) {
      initialNotifications = data.notifications;
    }
  } catch (error) {
    console.error("Failed to fetch initial notifications:", error);
  }

  return (
    <NotificationsPanel>
      <NotificationList initialNotifications={initialNotifications} pageSize={20} />
    </NotificationsPanel>
  );
}
