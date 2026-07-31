import AllowPushNotifications from "./allow-push-notifications";
import { API_ROUTES } from "@/lib/api-routes";
import { api } from "@/lib/api";
import { Switch } from "@/components/ui/switch";
import { toggleNotificationPreference } from "./actions";

export default async function NotificationSettingsPage() {
  const { preferences, push_enabled } = await api.get<{
    preferences: NotificationPreferences;
    push_enabled: boolean;
  }>(API_ROUTES.USER.NOTIFICATION_PREFERENCES);

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
            <div className="flex items-center justify-between gap-4 pt-3">
              <span className="text-sm text-default font-medium">
                Email me whenever encounter unusual activity
              </span>
              <form
                action={toggleNotificationPreference.bind(
                  null,
                  "unusual_activity",
                  !preferences?.unusual_activity,
                )}
              >
                <div className="relative cursor-pointer flex items-center">
                  <Switch
                    checked={Boolean(preferences?.unusual_activity)}
                    className="pointer-events-none"
                  />
                  <button
                    type="submit"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    aria-label="Email me whenever encounter unusual activity"
                  />
                </div>
              </form>
            </div>
            <div className="flex items-center justify-between gap-4 pt-3">
              <span className="text-sm text-default font-medium">
                Email me about my new releases
              </span>
              <form
                action={toggleNotificationPreference.bind(
                  null,
                  "new_releases",
                  !preferences?.new_releases,
                )}
              >
                <div className="relative cursor-pointer flex items-center">
                  <Switch
                    checked={Boolean(preferences?.new_releases)}
                    className="pointer-events-none"
                  />
                  <button
                    type="submit"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    aria-label="Email me about my new releases"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* News Alerts */}
        <div className="bg-white p-5 rounded-2xl flex flex-col gap-4">
          <h3 className="text-sm font-bold text-default">News Alerts</h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-default font-medium">
                Notify me of important updates and announcements
              </span>
              <form
                action={toggleNotificationPreference.bind(
                  null,
                  "updates_announcements",
                  !preferences?.updates_announcements,
                )}
              >
                <div className="relative cursor-pointer flex items-center">
                  <Switch
                    checked={Boolean(preferences?.updates_announcements)}
                    className="pointer-events-none"
                  />
                  <button
                    type="submit"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    aria-label="Notify me of important updates and announcements"
                  />
                </div>
              </form>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-default font-medium">
                Email me about new features and updates
              </span>
              <form
                action={toggleNotificationPreference.bind(
                  null,
                  "new_features",
                  !preferences?.new_features,
                )}
              >
                <div className="relative cursor-pointer flex items-center">
                  <Switch
                    checked={Boolean(preferences?.new_features)}
                    className="pointer-events-none"
                  />
                  <button
                    type="submit"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    aria-label="Email me about new features and updates"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Instant Push Notification */}
        <div className="bg-white p-5 rounded-2xl flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h3 className="font-medium text-default">Instant Push Notification</h3>
            <p className="font-medium">Receive instant push notification directly on your device</p>
          </div>

          <AllowPushNotifications pushNotificationSubscribed={push_enabled} />
        </div>
      </div>
    </div>
  );
}
