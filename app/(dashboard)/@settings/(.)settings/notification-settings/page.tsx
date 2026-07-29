import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { NotificationSwitchRow } from "./notification-switch-row";

import AllowPushNotifications from "./allow-push-notifications";

export default function NotificationSettingsPage() {
  return (
    <div className="flex flex-col">
      <p className="text-grey font-medium p-4 md:p-6">
        You will get only notification on what you have enabled.
      </p>

      <div className="p-4 md:p-6 flex flex-col gap-6">
        {/* Email Alerts */}
        <div className="bg-white p-5 rounded-2xl flex flex-col gap-4">
          <h3 className="text-sm font-bold text-default">Email Alerts</h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-default font-medium">
                Email me whenever encounter unusual activity
              </span>
              <Switch defaultChecked={true} />
            </div>
            <NotificationSwitchRow
              label="Email me about my new releases"
              category="new_releases"
              channel="email"
              defaultChecked={true}
              className="pt-3"
            />
          </div>
        </div>

        {/* News Alerts */}
        <div className="bg-white p-5 rounded-2xl flex flex-col gap-4">
          <h3 className="text-sm font-bold text-default">News Alerts</h3>
          <div className="flex flex-col gap-3">
            <NotificationSwitchRow
              label="Notify me of important updates and announcements"
              category="updates_announcements"
              channel="email"
              defaultChecked={false}
            />
            <div className="flex items-center justify-between gap-4 pt-3">
              <span className="text-sm text-default font-medium">
                Email me about new features and updates
              </span>
              <Switch defaultChecked={true} />
            </div>
          </div>
        </div>

        {/* Instant Push Notification */}
        <div className="bg-white p-5 rounded-2xl flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h3 className="font-medium text-default">Instant Push Notification</h3>
            <p className="font-medium">Receive instant push notification directly on your device</p>
          </div>

          <AllowPushNotifications />
        </div>
      </div>
    </div>
  );
}
