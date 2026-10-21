import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import Image from "next/image";
import useWithdrawalStore from "@/store/withdrawal-store";
import { Landmark } from "lucide-react";

function TransferSuccess() {
  const form = useWithdrawalStore((state) => state.form);
  const pounds = (form.amount / 100).toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const bank = form.selected_bank;

  return (
    <div className="flex flex-col items-center gap-6 py-12 px-8 bg-white relative">
      <div className="absolute w-full top-0 right-0 h-64 bg-linear-to-r from-[#0080FF] to-[#9747FF] -z-10 opacity-25 blur-3xl"></div>

      <div className="relative z-10 flex flex-col items-center gap-6 w-full">
        <Image src="/images/money-bag.png" alt="money bag" width={120} height={120} priority />

        <div className="flex flex-col items-center text-center max-w-93.5">
          <p className="text-xl font-bold text-default">Money transferred!</p>
          <p className="text-default-tertiary text-sm mt-1">
            You have successfully transferred £{pounds} to your withdrawal account
          </p>
        </div>

        {bank && (
          <div className="flex items-center gap-3.5 p-4 bg-page-background w-full max-w-85.5 rounded-2xl relative overflow-hidden text-left border border-black/5">
            <div className="size-10 rounded-full bg-white text-brand-blue flex items-center justify-center shrink-0 shadow-xs">
              <Landmark size={20} />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <h3 className="text-sm font-semibold text-default leading-tight truncate">
                {bank.account_name}
              </h3>
              <span className="font-medium text-xs text-default-tertiary leading-tight">
                {bank.account_number}
              </span>
              <span className="text-xs text-grey leading-tight truncate">
                {bank.bank_name}
              </span>
            </div>
          </div>
        )}

        <DialogClose asChild>
          <Button variant="outline" className="min-w-37 mt-2">
            Done
          </Button>
        </DialogClose>
      </div>
    </div>
  );
}

export default TransferSuccess;
