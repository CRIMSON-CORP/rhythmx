import { redirect } from "next/navigation";

export default function InterceptedSettingsRedirectPage() {
  redirect("/settings/account");
}
