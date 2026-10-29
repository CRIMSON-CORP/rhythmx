"use client";

import * as React from "react";
import { Suspense, use } from "react";
import { Dialog as DialogPrimitive, VisuallyHidden } from "radix-ui";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Input from "@/components/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Landmark,
  Loader2,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Icon from "@/components/icon";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { goeyToast } from "goey-toast";
import { useRouter } from "next/navigation";

interface WithdrawalAccountClientProps {
  initialAccounts?: WithdrawalAccount[];
  countries?: Array<{ code: string; name: string }>;
  currencies?: (PaymentCurrencyItem | string)[];
}

async function fetchBanks(): Promise<Bank[]> {
  try {
    const res = await api.get<{ banks: Bank[] }>(API_ROUTES.META.BANKS);
    return res?.banks || [];
  } catch (error) {
    console.error("Failed to fetch banks:", error);
    return [];
  }
}

function BankSkeletonList() {
  return (
    <div className="max-h-75 overflow-y-auto pr-1 flex flex-col gap-1 scrollbar-none">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-3 rounded-xl w-full animate-pulse"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-black/10 shrink-0" />
            <div className="flex flex-col gap-1.5">
              <div className="w-32 h-4 rounded bg-black/10" />
              <div className="w-20 h-3 rounded bg-black/10" />
            </div>
          </div>
          <div className="w-4 h-4 rounded bg-black/10 opacity-60" />
        </div>
      ))}
    </div>
  );
}

function BankList({
  banksPromise,
  searchQuery,
  onSelectBank,
}: {
  banksPromise: Promise<Bank[]>;
  searchQuery: string;
  onSelectBank: (bank: Bank) => void;
}) {
  const banks = use(banksPromise);

  const filteredBanks = React.useMemo(() => {
    if (!banks || !Array.isArray(banks)) return [];
    const query = searchQuery.trim().toLowerCase();
    if (!query) return banks;
    return banks.filter(
      (bank) =>
        bank.name?.toLowerCase().includes(query) ||
        bank.slug?.toLowerCase().includes(query) ||
        bank.code?.includes(query),
    );
  }, [banks, searchQuery]);

  return (
    <div className="max-h-75 overflow-y-auto pr-1 flex flex-col gap-1 scrollbar-none">
      {filteredBanks.map((bank) => (
        <button
          key={bank.code || bank.slug || bank.name}
          onClick={() => onSelectBank(bank)}
          type="button"
          className="flex items-center justify-between p-3 rounded-xl hover:bg-black/3 transition-all text-left w-full group cursor-pointer"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <Image
              src={(bank as { image?: string }).image || "/images/avatar.png"}
              alt={bank.name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover border border-black/5 shrink-0"
            />
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-default group-hover:text-brand-orange transition-colors truncate">
                {bank.name}
              </h4>
              <p className="text-xs text-default-tertiary truncate">
                {(bank as { fullName?: string }).fullName || bank.slug || bank.currency}
              </p>
            </div>
          </div>
          <ChevronRight
            size={16}
            className="text-default-tertiary opacity-60 group-hover:opacity-100 transition-opacity shrink-0 ml-2"
          />
        </button>
      ))}
      {filteredBanks.length === 0 && (
        <div className="py-8 text-center text-sm text-default-tertiary">
          No banks found matching &quot;{searchQuery}&quot;
        </div>
      )}
    </div>
  );
}

export default function WithdrawalAccountClient({
  initialAccounts = [],
  countries = [],
  currencies = [],
}: WithdrawalAccountClientProps) {
  const router = useRouter();
  const [accounts, setAccounts] = React.useState<WithdrawalAccount[]>(initialAccounts);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);
  const [settingDefaultId, setSettingDefaultId] = React.useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalStep, setModalStep] = React.useState<"select-bank" | "bank-details">("select-bank");
  const [selectedBank, setSelectedBank] = React.useState<Bank | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const banksPromise = React.useMemo(() => fetchBanks(), []);

  // Form Fields - Bank Country, Currency, Account Name, Account Number, Routing Number
  const [accountName, setAccountName] = React.useState("");
  const [accountNumber, setAccountNumber] = React.useState("");
  const [routingNumber, setRoutingNumber] = React.useState("");
  const [bankCountry, setBankCountry] = React.useState("");
  const [currency, setCurrency] = React.useState("");

  const handleOpenModal = () => {
    setModalStep("select-bank");
    setSelectedBank(null);
    setSearchQuery("");
    setAccountName("");
    setAccountNumber("");
    setRoutingNumber("");
    setBankCountry("");
    setCurrency("");
    setIsSubmitting(false);
    setIsModalOpen(true);
  };

  const handleSelectBank = (bank: Bank) => {
    setSelectedBank(bank);
    setBankCountry("");
    setCurrency("");
    setModalStep("bank-details");
  };

  const handleDelete = async (id: number) => {
    if (deletingId) return;
    setDeletingId(id);

    try {
      await api.delete(API_ROUTES.WITHDRAWALS.ACCOUNTS.DELETE(id));
      setAccounts((prev) => {
        const remaining = prev.filter((acc) => acc.id !== id);
        const hadDefault = prev.find((a) => a.id === id)?.is_default;
        if (hadDefault && remaining.length > 0) {
          remaining[0] = { ...remaining[0], is_default: true };
        }
        return remaining;
      });
      goeyToast.success("Bank account removed.");
      router.refresh();
    } catch (err: unknown) {
      const msg =
        (err as { message?: string })?.message ||
        "Failed to remove bank account. Please try again.";
      goeyToast.error(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id: number) => {
    if (settingDefaultId) return;
    setSettingDefaultId(id);

    try {
      await api.patch(API_ROUTES.WITHDRAWALS.ACCOUNTS.SET_DEFAULT(id), { is_default: true });
      setAccounts((prev) =>
        prev.map((acc) => ({
          ...acc,
          is_default: acc.id === id,
        })),
      );
      goeyToast.success("Default withdrawal account updated.");
      router.refresh();
    } catch (err: unknown) {
      const msg =
        (err as { message?: string })?.message ||
        "Failed to update default account. Please try again.";
      goeyToast.error(msg);
    } finally {
      setSettingDefaultId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedBank ||
      !accountName.trim() ||
      !accountNumber.trim() ||
      !bankCountry.trim() ||
      !currency.trim() ||
      isSubmitting
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: Record<string, unknown> = {
        account_name: accountName.trim(),
        bank_name: selectedBank.name.trim(),
        account_number: accountNumber.trim(),
        bank_country: bankCountry.trim(),
        currency: currency.trim().toLowerCase(),
      };

      if (routingNumber.trim()) {
        payload.routing_number = routingNumber.trim();
      }

      if (selectedBank.code) {
        payload.bank_code = selectedBank.code;
      }

      const res = await api.post<{
        account?: WithdrawalAccount;
        accounts?: WithdrawalAccount[];
      }>(API_ROUTES.WITHDRAWALS.ACCOUNTS.ADD, payload);

      if (res?.account) {
        setAccounts((prev) => [
          res.account!,
          ...prev.map((a) => (res.account!.is_default ? { ...a, is_default: false } : a)),
        ]);
      } else if (res?.accounts) {
        setAccounts(res.accounts);
      } else {
        const newAccount: WithdrawalAccount = {
          id: Date.now(),
          account_name: accountName.trim(),
          bank_name: selectedBank.name.trim(),
          bank_code: selectedBank.code || null,
          account_number: accountNumber.trim(),
          routing_number: routingNumber.trim() || null,
          iban: null,
          swift_code: null,
          bank_country: bankCountry.trim(),
          currency: currency.trim().toLowerCase(),
          is_default: accounts.length === 0,
          is_verified: false,
          created_at: new Date().toISOString(),
        };
        setAccounts((prev) => [newAccount, ...prev]);
      }

      goeyToast.success("Bank account added successfully.");
      setIsModalOpen(false);
      router.refresh();
    } catch (err: unknown) {
      const msg =
        (err as { message?: string })?.message ||
        "Failed to add bank account. Please check your details.";
      goeyToast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    selectedBank !== null &&
    accountName.trim().length > 0 &&
    accountNumber.trim().length >= 6 &&
    bankCountry.trim().length > 0 &&
    currency.trim().length > 0;

  return (
    <>
      {/* Account Cards List */}
      <div className="flex flex-col gap-3 w-full max-w-135">
        {accounts.length === 0 ? (
          <div className="flex items-center gap-4 p-4 bg-[#EAF5FF] rounded-2xl w-full">
            <Icon name="piggy-bank" size={32} />
            <div className="flex flex-col gap-0.5">
              <h3 className="text-sm font-medium text-default">No Withdrawal Account</h3>
              <p className="text-xs font-semibold text-grey">
                You do not have any account added yet
              </p>
            </div>
          </div>
        ) : (
          accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between p-4 bg-[#EAF5FF] w-full rounded-2xl relative overflow-hidden transition-all hover:bg-[#E3F1FF]"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="size-10 rounded-full bg-white flex items-center justify-center text-brand-blue shadow-xs shrink-0">
                  <Landmark size={20} />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-grey leading-tight truncate">
                      {account.account_name}
                    </h3>
                    {account.is_default && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#14AE5C]/15 text-[#14AE5C]">
                        Default
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-sm leading-tight text-default tracking-wide">
                    {account.account_number}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-medium text-grey leading-tight">
                    <span className="truncate">{account.bank_name}</span>
                    {account.currency && (
                      <span className="uppercase text-[10px] px-1.5 py-0.5 bg-black/5 rounded font-semibold text-default-tertiary">
                        {account.currency}
                      </span>
                    )}
                    {account.bank_country && (
                      <span className="uppercase text-[10px] px-1.5 py-0.5 bg-brand-blue/10 text-brand-blue rounded font-semibold">
                        {account.bank_country}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                {!account.is_default && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(account.id)}
                    disabled={settingDefaultId === account.id || deletingId === account.id}
                    className="text-xs text-brand-blue hover:underline font-medium px-2 py-1 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {settingDefaultId === account.id ? "Setting..." : "Make default"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(account.id)}
                  disabled={deletingId === account.id || settingDefaultId === account.id}
                  className="p-2 text-grey hover:text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 cursor-pointer"
                  title="Delete account"
                  aria-label="Delete account"
                >
                  {deletingId === account.id ? (
                    <Loader2 size={18} className="animate-spin text-red-500" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Button to open Modal */}
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          rounded={10}
          onClick={handleOpenModal}
          disabled={accounts.length >= 5}
          className="w-fit"
        >
          Add Account
          <ArrowRight size={24} />
        </Button>
        {accounts.length >= 5 && (
          <p className="text-xs text-default-tertiary">
            You have reached the maximum limit of 5 bank accounts.
          </p>
        )}
      </div>

      {/* Modal Dialog */}
      <DialogPrimitive.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/10 backdrop-blur-xs duration-200 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
          <DialogPrimitive.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col w-full max-w-115 max-h-[88vh] rounded-20 bg-white shadow-2xl duration-200 outline-none overflow-hidden data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:zoom-out-95">
            <VisuallyHidden.Root>
              <DialogPrimitive.Title>
                {modalStep === "select-bank" ? "Select Bank" : "Add Bank Account"}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description>
                {modalStep === "select-bank"
                  ? "Select the bank you would like to link"
                  : "Enter bank account details"}
              </DialogPrimitive.Description>
            </VisuallyHidden.Root>

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
              <div className="flex items-center gap-2">
                {modalStep === "bank-details" && (
                  <button
                    onClick={() => setModalStep("select-bank")}
                    type="button"
                    className="p-1.5 rounded-full hover:bg-black/5 text-default transition-all mr-1 cursor-pointer"
                    aria-label="Back to bank list"
                  >
                    <ChevronLeft size={18} />
                  </button>
                )}
                <h3 className="font-semibold text-default text-base">
                  {modalStep === "select-bank" ? "Select Bank" : "Add Bank Account"}
                </h3>
              </div>
              <DialogPrimitive.Close asChild>
                <button className="p-2 rounded-full hover:bg-black/5 text-default transition-all cursor-pointer">
                  <X size={20} />
                </button>
              </DialogPrimitive.Close>
            </div>

            {/* Modal Body */}
            {modalStep === "select-bank" ? (
              <div className="p-6 flex flex-col gap-4 overflow-y-auto">
                <p className="text-sm text-default-tertiary">
                  Select the bank you like to link to your account
                </p>

                {/* Search */}
                <div className="flex items-center gap-2.5 px-4 py-3 bg-[#F4F5F7] rounded-xl border border-black/2">
                  <Search size={18} className="text-default-tertiary shrink-0" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent outline-none w-full text-sm text-default font-medium placeholder-default-tertiary"
                  />
                </div>

                {/* Bank List */}
                <Suspense fallback={<BankSkeletonList />}>
                  <BankList
                    banksPromise={banksPromise}
                    searchQuery={searchQuery}
                    onSelectBank={handleSelectBank}
                  />
                </Suspense>
              </div>
            ) : (
              /* Step 2: Bank Details Form */
              <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto">
                {/* Selected Bank Preview */}
                {selectedBank && (
                  <div className="flex items-center justify-between p-3.5 bg-light-blue rounded-xl">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <Image
                        src={(selectedBank as { image?: string })?.image || "/images/avatar.png"}
                        alt={selectedBank.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover border border-black/5 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-default truncate">
                          {selectedBank.name}
                        </h4>
                        <p className="text-xs text-default-tertiary truncate">
                          {(selectedBank as { fullName?: string })?.fullName ||
                            selectedBank.slug ||
                            selectedBank.currency}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setModalStep("select-bank")}
                      className="text-xs text-brand-blue hover:underline font-medium shrink-0 ml-2 cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                )}

                {/* Bank Country */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-default/70">Bank Country</label>
                  <Select value={bankCountry} onValueChange={setBankCountry}>
                    <SelectTrigger className="w-full bg-white outline outline-[#D9D9D9] border border-default-default px-4 py-5 rounded-10 text-sm text-default font-medium">
                      <SelectValue placeholder="Select Bank Country" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {countries.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.name} ({c.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Currency */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-default/70">Currency</label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-full bg-white outline outline-[#D9D9D9] border border-default-default px-4 py-5 rounded-10 text-sm text-default font-medium">
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {currencies.map((curr) => {
                        const code = typeof curr === "string" ? curr : curr.code;
                        const label =
                          typeof curr === "string" ? curr : `${curr.name} (${curr.code})`;
                        return (
                          <SelectItem key={code} value={code}>
                            {label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Account Number */}
                <Input
                  name="account-number"
                  label="Account Number"
                  placeholder="e.g. 55554444"
                  required
                  maxLength={25}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                />

                {/* Account Name */}
                <Input
                  name="account-name"
                  label="Account Name"
                  required
                  disabled
                  readOnly
                  value={accountName}
                />

                {/* Routing Number (Optional) */}
                <Input
                  name="routing-number"
                  label="Routing Number / Sort Code (Optional)"
                  placeholder="e.g. 040004"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value)}
                />

                {/* Submit button */}
                <Button
                  rounded={10}
                  width="full"
                  type="submit"
                  className="mt-2"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Adding...
                    </span>
                  ) : (
                    "Done"
                  )}
                </Button>
              </form>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
