"use server";

import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { revalidatePath } from "next/cache";

export async function toggleNotificationPreference(
  category: keyof NotificationPreferences,
  newValue: boolean,
): Promise<void> {
  try {
    await api.patch(API_ROUTES.USER.NOTIFICATION_PREFERENCES, {
      preferences: {
        [category]: newValue,
      },
    });
    revalidatePath("/settings/notification-settings");
  } catch (error: unknown) {
    console.error("[Update Notification Preference Error]:", error);
  }
}
