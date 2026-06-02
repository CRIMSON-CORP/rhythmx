import WithdrawalAccountClient from "@/app/(dashboard)/@settings/(.)settings/withdrawal-account/withdrawal-account-client";
import Icon from "@/components/icon";
import Image from "next/image";

export default async function WithdrawalForm() {
  const showNoAccount = false;

  // Dummy account details coming from the server
  const defaultAccount = showNoAccount
    ? null
    : {
        bank_name: "Moniepoint Microfinance Bank",
        bank_title: "Moniepoint",
        bank_image: "/images/avatar.png",
        account_number: "2308402914",
        account_name: "Jimmy salami",
      };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl">
      <p className="text-sm text-grey font-medium leading-relaxed">
        This is where funds you received or made on RhythemX will be sent to when you initiate a
        withdrawal. Funds are sent instantly.
      </p>

      {/* Account Card / Box */}
      {!defaultAccount ? (
        <div className="flex items-center gap-4 p-4 bg-[#EAF5FF] rounded-2xl">
          <Icon name="piggy-bank" size={32} />
          <div className="flex flex-col gap-0.5">
            <h3 className="text-sm font-medium text-default">No Withdrawal Account</h3>
            <p className="text-xs font-semibold text-grey">You do not have any account added yet</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4.5 p-4 bg-[#EAF5FF] w-full max-w-135 rounded-2xl relative overflow-hidden">
          <Image
            src={defaultAccount.bank_image}
            alt={defaultAccount.bank_title}
            width={32}
            height={32}
            className="size-8 rounded-full object-cover"
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
        </div>
      )}

      {/* Info texts below */}
      <div className="space-y-4">
        <p className="text-sm text-grey font-medium leading-relaxed">
          This is where funds you received or made on Remse will be sent to when you initiate a
          withdrawal. Funds are sent instantly.
        </p>
        <p className="text-sm text-grey font-medium leading-relaxed">
          Do ensure the account number you&apos;re adding belongs to you. For further assistance
          contact support at 0700 933 933 933 or support@rhythemx.com for assistance.
        </p>
      </div>

      {/* Client Trigger Component */}
      <WithdrawalAccountClient accountExists={!!defaultAccount} />
    </div>
  );
}
