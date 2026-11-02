import Link from "next/link";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { formatCurrency } from "@/lib/utils";
import PlansGrid from "./plans-grid";
import { Button } from "@/components/ui/button";
import SharePlanModal from "./share-plan-modal";

function formatExpiryDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr.includes(" ") ? dateStr.replace(" ", "T") : dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
}

function isSubscriptionExpired(sub?: UserSubscription | null): boolean {
  if (!sub) return false;
  if (sub.status === "expired") return true;
  if (!sub.end_at) return false;
  const date = new Date(sub.end_at.includes(" ") ? sub.end_at.replace(" ", "T") : sub.end_at);
  if (isNaN(date.getTime())) return false;
  return date.getTime() < Date.now();
}

export default async function ManagePlanPage() {
  const [{ plans = [] }, { subscription = null }, userRes] = await Promise.all([
    api.get<PlansResponse>(API_ROUTES.PLANS.LIST),
    api.get<SubscriptionResponse>(API_ROUTES.SUBSCRIPTION.GET),
    api.get<{ user: User }>(API_ROUTES.USER.ME).catch(() => null),
  ]);

  const isExpired = isSubscriptionExpired(subscription);
  const subscriberName = userRes?.user
    ? [userRes.user.first_name, userRes.user.last_name].filter(Boolean).join(" ") ||
      userRes.user.email
    : "Subscriber";

  return (
    <div className="flex flex-col gap-6">
      {/* Active Plan */}
      {subscription && (
        <div className="flex flex-col gap-4 px-3 md:px-8 pb-4">
          <h3 className="font-medium">Active Plan</h3>
          <div className="bg-white p-4 rounded-2xl flex items-center gap-6">
            <div className="flex items-center gap-3 grow">
              <div
                data-is-expired={isExpired}
                className="w-10.5 h-10.5 rounded-full data-[is-expired=true]:bg-black/50 data-[is-expired=false]:bg-brand-purple-2 flex items-center justify-center text-white shrink-0"
              >
                <svg id="loyalty-card" width={27} height={27} viewBox="0 0 27 27" fill="none">
                  <path
                    d="M2.1875 13.125C2.1875 8.74234 2.1875 6.55156 3.46937 5.18984C4.75125 3.82812 6.81297 3.82812 10.9375 3.82812H15.3125C19.437 3.82812 21.4998 3.82812 22.7806 5.18984C24.0614 6.55156 24.0625 8.74234 24.0625 13.125C24.0625 17.5077 24.0625 19.6984 22.7806 21.0602C21.4987 22.4219 19.437 22.4219 15.3125 22.4219H10.9375C6.81297 22.4219 4.75016 22.4219 3.46937 21.0602C2.18859 19.6984 2.1875 17.5077 2.1875 13.125Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19.6873 18.047H16.4061M7.53357 11.8465C8.5606 11.2472 9.45638 11.4889 9.9945 11.8739C10.2154 12.0314 10.3259 12.1101 10.3904 12.1101C10.4561 12.1101 10.5654 12.0314 10.7864 11.8739C11.3245 11.4889 12.2203 11.2472 13.2473 11.8465C14.5948 12.634 14.8989 15.2306 11.7926 17.4214C11.1998 17.8381 10.9034 18.047 10.3904 18.047C9.87747 18.047 9.58107 17.8392 8.98935 17.4214C5.882 15.2306 6.18497 12.634 7.53357 11.8465Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-xs font-medium text-border-default-secondary">
                  {subscription.plan?.name || "Active"} Plan
                </h4>
                <p className="font-medium text-default">
                  {isExpired ? "Expired" : `Expires on ${formatExpiryDate(subscription.end_at)}`}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-0.5 pr-1">
              <span className="text-xs font-medium text-border-default-secondary">Price</span>
              <span className="font-medium text-default">
                {formatCurrency(
                  subscription.amount_paid ?? subscription.plan?.price,
                  subscription.currency || "GBP",
                )}
              </span>
            </div>
            <Button asChild variant="purple">
              <Link href="/settings/plan-billing/sharing" replace>Renew</Link>
            </Button>
            {subscription.plan?.slug === "rhythm-elite" && (
              <SharePlanModal
                subscription={subscription}
                subscriberName={subscriberName}
                disabled={isExpired}
              />
            )}
          </div>
        </div>
      )}

      <div className="px-3 md:px-8 pb-4 flex flex-col gap-3">
        {/* Grid Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-medium">All Plans</h3>
          <a href="#" className="text-xs text-brand-blue font-bold hover:underline">
            Help?
          </a>
        </div>

        {/* Plans Grid */}
        <PlansGrid
          plans={plans}
          activePlanId={subscription?.plan?.id}
          currentPlan={subscription?.plan}
        />
      </div>
    </div>
  );
}
