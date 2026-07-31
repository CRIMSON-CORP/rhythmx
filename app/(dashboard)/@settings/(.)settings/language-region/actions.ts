"use server";

import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { revalidatePath, updateTag } from "next/cache";

export async function updateTimezone(timezone: string): Promise<void> {
  try {
    await api.patch(API_ROUTES.USER.LOCALE, { timezone });
    updateTag("user");
    revalidatePath("/settings/language-region");
  } catch (error: unknown) {
    console.error("[Update Timezone Error]:", error);
  }
}
