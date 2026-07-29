"use server";

import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";

export async function updateNotificationPreferences(preferences: Record<string, unknown>) {
  try {
    await api.patch(API_ROUTES.USER.NOTIFICTION_PREFERENCES, {
      preferences,
    });
    return { success: true };
  } catch (error: unknown) {
    console.error("[Update Notification Preferences Error]:", error);
    return {
      success: false,
      error: (error as Error).message || "Failed to update notification preferences",
    };
  }
}
