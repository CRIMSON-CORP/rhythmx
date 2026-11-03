import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import PlanSharingClient from "./plan-sharing-client";

const DEFAULT_SHARING_ERROR = "Only the owner of a Rhythm Elite plan can share it.";

export default async function PlanSharingPage() {
  const [subRes, userRes, sharingResult] = await Promise.all([
    api.get<SubscriptionResponse>(API_ROUTES.SUBSCRIPTION.INDEX).catch((err) => {
      if (isRedirectError(err)) throw err;
      console.error("Failed to fetch subscription on sharing page:", err);
      return { subscription: null };
    }),
    api.get<{ user: User }>(API_ROUTES.ME.INDEX).catch((err) => {
      if (isRedirectError(err)) throw err;
      return null;
    }),
    api
      .get<SubscriptionSharingResponse>(API_ROUTES.SUBSCRIPTION.MEMBER_INVITATIONS.INDEX)
      .then((data) => ({ data, error: null as string | null }))
      .catch((err: unknown) => {
        if (isRedirectError(err)) throw err;
        const msg =
          (err instanceof Error && err.message) ||
          (err as { message?: string })?.message ||
          DEFAULT_SHARING_ERROR;
        return { data: null, error: msg };
      }),
  ]);

  const subscription = subRes?.subscription ?? null;

  // 1. Direct plan check: Only Rhythm Elite subscribers can access sharing
  if (subscription?.plan?.slug !== "rhythm-elite") {
    redirect(`/settings/plan-billing?error=${encodeURIComponent(DEFAULT_SHARING_ERROR)}`);
  }

  // 2. If the invitations endpoint returned an error (e.g. non-owner member)
  if (sharingResult.error) {
    redirect(`/settings/plan-billing?error=${encodeURIComponent(sharingResult.error)}`);
  }

  const subscriberName = userRes?.user
    ? [userRes.user.first_name, userRes.user.last_name].filter(Boolean).join(" ") ||
      userRes.user.email ||
      "Subscriber"
    : "Subscriber";

  const initialMember = sharingResult.data?.member ?? null;
  const initialInvites = sharingResult.data?.invites ?? [];

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
