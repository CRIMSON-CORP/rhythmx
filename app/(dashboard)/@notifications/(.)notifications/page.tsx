import NotificationsPanel from "@/components/notifications-panel";
import NotificationList from "@/components/notification-list";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";

export default async function InterceptedNotificationsPage() {
  const { notifications } = await api.get<{ notifications: Notification[] }>(
    `${API_ROUTES.NOTFICATIONS.LIST}?page=1&limit=20`,
  );
  return (
    <NotificationsPanel>
      <NotificationList initialNotifications={notifications} pageSize={20} />
    </NotificationsPanel>
  );
}
