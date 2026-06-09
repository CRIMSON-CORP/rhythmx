import useWithdrawalStore from "@/store/withdrawal-store";
import { DollarSign } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function WithdrawalBank() {
  const defaultAccount = {
    id: "2",
    bank_name: "Moniepoint Microfinance Bank",
    bank_title: "Moniepoint",
    bank_image: "/images/avatar.png",
    account_number: "2308402914",
    account_name: "Jimmy salami",
  };
  const setForm = useWithdrawalStore((state) => state.setForm);
  const setView = useWithdrawalStore((state) => state.setView);
  return (
    <div className="px-8 pb-8 flex flex-col gap-4">
      <div className="absolute w-full top-0 right-0 h-64 bg-linear-to-r from-[#0080FF] to-[#9747FF] -z-10 opacity-25 blur-3xl"></div>
      <button
        onClick={() => {
          setForm({ withdrawal_account_id: defaultAccount.id });
          setView("enter-otp");
        }}
        className="flex items-center gap-4.5 p-4 bg-white w-full max-w-135 rounded-30 relative overflow-hidden"
      >
        <Image
          src={defaultAccount.bank_image}
          alt={defaultAccount.bank_title}
          width={40}
          height={40}
          className="size-10 rounded-full object-cover"
        />
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-grey leading-tight">
            {defaultAccount.account_name}
          </h3>
          <span className="font-medium leading-tight">{defaultAccount.account_number}</span>
          <span className="text-xs font-medium text-grey leading-tight">
            {defaultAccount.bank_title}
          </span>
        </div>
      </button>
      <Link
        href="/settings/withdrawal-account"
        className="w-full text-default hover:bg-default hover:text-white transition-colors duration-300 flex gap-3 p-3 rounded-20 text-left"
      >
        <DollarSign size={20} />
        <div className="flex flex-col gap-1 text-border-default-secondary">
          <span className="font-medium">Withdrawal Acct</span>
          <span className="text-default-tertiary text-sm">Manage your withdrawal account</span>
        </div>
      </Link>
    </div>
  );
}

export default WithdrawalBank;
