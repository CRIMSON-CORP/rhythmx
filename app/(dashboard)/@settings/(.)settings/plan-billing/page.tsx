import Icon from "@/components/icon";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { formatCurrency } from "@/lib/utils";
import PlansGrid from "./plans-grid";

function formatExpiryDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr.includes(" ") ? dateStr.replace(" ", "T") : dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
}

export default async function ManagePlanPage() {
  const [{ plans = [] }, { subscription = null }] = await Promise.all([
    api.get<PlansResponse>(API_ROUTES.PLANS.LIST),
    api.get<SubscriptionResponse>(API_ROUTES.SUBSCRIPTION.GET),
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Active Plan */}
      {subscription && (
        <div className="flex flex-col gap-4 px-3 md:px-8 pb-4">
          <h3 className="font-medium">Active Plan</h3>
          <div className="bg-white p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-purple flex items-center justify-center text-white shrink-0">
                <Icon name="loyalty-card" size={27} />
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-xs font-medium text-border-default-secondary">
                  {subscription.plan?.name || "Active"} Plan
                </h4>
                <p className="font-medium text-default">
                  Expires on {formatExpiryDate(subscription.end_at)}
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
        <PlansGrid plans={plans} activePlanId={subscription?.plan?.id} />
      </div>
    </div>
  );
}
