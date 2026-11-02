"use client";

import { useState, useEffect } from "react";
import useWithdrawalStore from "@/store/withdrawal-store";
import { DollarSign, Landmark, Loader2 } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { Button } from "@/components/ui/button";

function BankSkeleton() {
  return (
    <div className="flex flex-col gap-3 w-full">
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4.5 p-4 bg-white/70 w-full rounded-2xl animate-pulse"
        >
          <div className="size-10 rounded-full bg-default-default/50 shrink-0" />
          <div className="flex flex-col gap-2 grow">
            <div className="w-32 h-4 bg-default-default/50 rounded" />
            <div className="w-24 h-3 bg-default-default/50 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function WithdrawalBank() {
  const form = useWithdrawalStore((state) => state.form);
  const setForm = useWithdrawalStore((state) => state.setForm);
  const setView = useWithdrawalStore((state) => state.setView);

  const [accounts, setAccounts] = useState<WithdrawalAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await api.get<WithdrawalAccountsResponse>(
        API_ROUTES.WITHDRAWALS.ACCOUNTS.INDEX,
      );
      setAccounts(res?.accounts || []);
    } catch (err: unknown) {
      console.error("Failed to load withdrawal accounts:", err);
      setFetchError(
        (err as { message?: string })?.message || "Failed to load withdrawal accounts.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSelectAccount = async (account: WithdrawalAccount) => {
    if (submittingId !== null) return;
    setSubmittingId(account.id);

    try {
      const amountInPounds = form.amount / 100;
      const res = await api.post<WithdrawalRequestResponse>(
        API_ROUTES.WITHDRAWALS.REQUEST.INDEX,
        {
          amount: amountInPounds,
          bank_id: account.id,
        },
      );

      setForm({
        withdrawal_account_id: account.id,
        selected_bank: account,
        withdrawal_response: res?.withdrawal,
      });
      setView("enter-otp");
    } catch (err: unknown) {
      console.error("Failed to initiate withdrawal:", err);
      // api.ts already triggers goeyToast.error for failed responses
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="px-6 pb-6 flex flex-col gap-4 relative">
      <div className="absolute w-full top-0 right-0 h-64 bg-linear-to-r from-[#0080FF] to-[#9747FF] -z-10 opacity-25 blur-3xl"></div>

      <div className="relative z-10 flex flex-col gap-3">
        {isLoading ? (
          <BankSkeleton />
        ) : fetchError ? (
          <div className="text-center py-6 flex flex-col items-center gap-3">
            <p className="text-default-tertiary text-sm">{fetchError}</p>
            <Button size="sm" variant="outline" onClick={fetchAccounts}>
              Retry
            </Button>
          </div>
        ) : accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 bg-white/60 backdrop-blur-md rounded-2xl text-center gap-3">
            <div className="size-12 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center">
              <Landmark size={24} />
            </div>
            <div>
              <p className="font-semibold text-sm text-default">No withdrawal account found</p>
              <p className="text-default-tertiary text-xs mt-1">
                Please add a bank account in your settings before making a withdrawal.
              </p>
            </div>
            <Link
              href="/settings/withdrawal-account"
              className="mt-2 text-xs font-semibold text-white bg-brand-orange hover:bg-brand-orange/90 px-4 py-2 rounded-full transition-colors"
            >
              Add Withdrawal Account
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-h-75 overflow-y-auto scrollbar-none">
            {accounts.map((account) => {
              const isSelectedAndSubmitting = submittingId === account.id;
              return (
                <button
                  key={account.id}
                  disabled={submittingId !== null}
                  onClick={() => handleSelectAccount(account)}
                  type="button"
                  className="flex items-center justify-between p-4 bg-white hover:bg-neutral-50 active:scale-[0.99] transition-all w-full rounded-2xl relative overflow-hidden text-left cursor-pointer border border-black/5 disabled:opacity-60"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="size-10 rounded-full bg-[#EAF5FF] text-brand-blue flex items-center justify-center shrink-0">
                      <Landmark size={20} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-default truncate">
                          {account.account_name}
                        </span>
                        {account.is_default && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#14AE5C]/15 text-[#14AE5C]">
                            Default
                          </span>
                        )}
                      </div>
                      <span className="font-medium text-xs text-default-tertiary">
                        {account.account_number}
                      </span>
                      <span className="text-xs text-grey truncate">
                        {account.bank_name}
                      </span>
                    </div>
                  </div>

                  {isSelectedAndSubmitting && (
                    <Loader2 size={18} className="animate-spin text-default-tertiary shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        <Link
          href="/settings/withdrawal-account"
          className="w-full text-default hover:bg-black/5 transition-colors duration-300 flex items-center gap-3 p-3 rounded-20 text-left mt-1"
        >
          <div className="size-9 rounded-full bg-black/5 flex items-center justify-center text-default shrink-0">
            <DollarSign size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm text-default">Withdrawal Account</span>
            <span className="text-default-tertiary text-xs">Manage your withdrawal accounts</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default WithdrawalBank;
