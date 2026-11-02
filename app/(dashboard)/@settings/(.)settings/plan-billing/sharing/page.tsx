import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import PlanSharingClient from "./plan-sharing-client";

export default async function PlanSharingPage() {
  let sharingError: string | null = null;

  const [subRes, userRes, sharingRes] = await Promise.all([
    api.get<SubscriptionResponse>(API_ROUTES.SUBSCRIPTION.INDEX).catch((err) => {
      console.error("Failed to fetch subscription on sharing page:", err);
      return { subscription: null };
    }),
    api.get<{ user: User }>(API_ROUTES.ME.INDEX).catch(() => null),
    api
      .get<SubscriptionSharingResponse>(API_ROUTES.SUBSCRIPTION.MEMBER_INVITATIONS.INDEX)
      .catch((err: unknown) => {
        if (isRedirectError(err)) throw err;
        const msg =
          err instanceof Error
            ? err.message
            : (err as { message?: string })?.message ||
              "Only the owner of a Rhythm Elite plan can share it.";
        sharingError = msg;
        return null;
      }),
  ]);

  if (sharingError) {
    redirect(`/settings/plan-billing?error=${encodeURIComponent(sharingError)}`);
  }

  const subscription = subRes?.subscription ?? null;
  const subscriberName = userRes?.user
    ? [userRes.user.first_name, userRes.user.last_name].filter(Boolean).join(" ") ||
      userRes.user.email ||
      "Subscriber"
    : "Subscriber";

  const initialMember = sharingRes?.member ?? null;
  const initialInvites = sharingRes?.invites ?? [];

  return (
    <div className="flex flex-col h-full">
      <PlanSharingClient
        subscription={subscription}
        subscriberName={subscriberName}
        user={userRes?.user ?? null}
        initialMember={initialMember}
        initialInvites={initialInvites}
      />
    </div>
  );
}
