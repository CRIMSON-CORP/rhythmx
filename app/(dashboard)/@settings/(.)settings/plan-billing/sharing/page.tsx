import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import PlanSharingClient from "./plan-sharing-client";

export default async function PlanSharingPage() {
  const [subRes, userRes] = await Promise.all([
    api.get<SubscriptionResponse>(API_ROUTES.SUBSCRIPTION.GET).catch((err) => {
      console.error("Failed to fetch subscription on sharing page:", err);
      return { subscription: null };
    }),
    api.get<{ user: User }>(API_ROUTES.USER.ME).catch(() => null),
  ]);

  const subscription = subRes?.subscription ?? null;
  const subscriberName = userRes?.user
    ? [userRes.user.first_name, userRes.user.last_name].filter(Boolean).join(" ") ||
      userRes.user.email ||
      "Alex Morgan"
    : "Alex Morgan";

  return (
    <div className="flex flex-col h-full">
      <PlanSharingClient
        subscription={subscription}
        subscriberName={subscriberName}
        user={userRes?.user ?? null}
      />
    </div>
  );
}
