import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import BillingHistoryClient from "./billing-history-client";

export default async function BillingPage() {
  const { history = [] } = await api.get<SubscriptionResponse>(
    API_ROUTES.SUBSCRIPTION.GET
  );

  return (
    <div className="flex flex-col h-full">
      <BillingHistoryClient initialHistory={history} />
    </div>
  );
}
