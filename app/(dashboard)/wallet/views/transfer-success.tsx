import { DialogClose } from "@/components/ui/dialog";
import Image from "next/image";

function TransferSuccess() {
  const defaultAccount = {
    id: "2",
    bank_name: "Moniepoint Microfinance Bank",
    bank_title: "Moniepoint",
    bank_image: "/images/avatar.png",
    account_number: "2308402914",
    account_name: "Jimmy salami",
  };
  return (
    <div className="flex flex-col items-center gap-8 py-16 px-8 bg-white rounded-t-30">
      <div className="absolute w-full top-0 right-0 h-64 bg-linear-to-r from-[#0080FF] to-[#9747FF] -z-10 opacity-25 blur-3xl"></div>
      <Image src="/images/money-bag.png" alt="money bag" width={133} height={133} />
      <div className="flex flex-col items-center text-center max-w-93.5">
        <p className="text-lg font-medium">Money transferred!</p>
        <p className="text-black/50">
          You have successfully transferred $20.00 (₦60,000.00) to your withdrawal account{" "}
        </p>
      </div>
      <div className="flex items-center gap-4.5 p-4 bg-page-background w-full max-w-85.5 rounded-30 relative overflow-hidden">
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
      </div>
      <DialogClose className="outline outline-black text-black w-full max-w-37 p-4 rounded-full">
        Done
      </DialogClose>
    </div>
  );
}

export default TransferSuccess;
