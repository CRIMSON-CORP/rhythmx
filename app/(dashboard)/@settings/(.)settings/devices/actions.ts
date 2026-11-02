"use server";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { revalidatePath } from "next/cache";

export async function signOutDevice(device_id: Device["id"]) {
  await api.delete(API_ROUTES.ME.DEVICES.DEVICE(device_id));

  revalidatePath("/settings/devices");
}
export async function signOutAllDevices() {
  await api.post(API_ROUTES.ME.DEVICE_SIGN_OUTS, {});

  revalidatePath("/settings/devices");
}
