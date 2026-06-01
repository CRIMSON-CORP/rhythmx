import Home from "../page";
import NotificationsPanel from "@/components/notifications-panel";
import NotificationList from "@/components/notification-list";

export default function NotificationsFallbackPage() {
  return (
    <>
      <Home />
      <NotificationsPanel>
        <NotificationList />
      </NotificationsPanel>
    </>
  );
}
