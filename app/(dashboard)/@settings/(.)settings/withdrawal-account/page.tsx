import WithdrawalAccountClient from "@/app/(dashboard)/@settings/(.)settings/withdrawal-account/withdrawal-account-client";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";

export default async function WithdrawalForm() {
  const [accountsRes, countriesRes, currenciesRes] = await Promise.all([
    api.get<WithdrawalAccountsResponse>(API_ROUTES.WITHDRAWALS.ACCOUNTS.LIST).catch(() => null),
    api
      .get<{ countries: Array<{ code: string; name: string }> }>(API_ROUTES.META.COUNTRIES)
      .catch(() => null),
    api.get<PaymentCurrenciesResponse>(API_ROUTES.PAYMENTS.CURRENCIES).catch(() => null),
  ]);

  const accounts = accountsRes?.accounts || [];
  const countries = countriesRes?.countries || [];
  const currencies = currenciesRes?.currencies || [];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-2xl">
      <p className="text-sm text-grey font-medium leading-relaxed">
        This is where funds you received or made on RhythmX will be sent to when you initiate a
        withdrawal. Funds are sent instantly.
      </p>

      {/* Account List and Add Account Manager */}
      <WithdrawalAccountClient
        initialAccounts={accounts}
        countries={countries}
        currencies={currencies}
      />

      {/* Info texts below */}
      <div className="space-y-4">
        <p className="text-sm text-grey font-medium leading-relaxed">
          This is where funds you received or made on RhythmX will be sent to when you initiate a
          withdrawal. Funds are sent instantly.
        </p>
        <p className="text-sm text-grey font-medium leading-relaxed">
          Do ensure the account number you&apos;re adding belongs to you. For further assistance
          contact support at 0700 933 933 933 or support@rhythmx.com.
        </p>
      </div>
    </div>
  );
}
