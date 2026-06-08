import Icon from "@/components/icon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "radix-ui";
import { Separator } from "@/components/ui/separator";
import WithdrawalFlow from "./withdrawal-flow";

function WalletPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="container flex flex-wrap items-center justify-between gap-6">
        <h1 className="font-heading text-3xl md:text-5xl leading-tight font-semibold flex items-center gap-2.5 text-default">
          <span>Wallet</span>
          <div className="bg-white flex items-center gap-2.5 px-5 py-4 rounded-full font-sans font-medium max-sm:hidden">
            <span className="text-sm text-border-default-secondary">Balance</span>
            <Separator orientation="vertical" />
            <span className="text-2xl font-semibold">$38,488.00</span>
          </div>
        </h1>
        <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
          <Dialog>
            <DialogTrigger className="bg-black text-white p-4 flex items-center gap-2 rounded-full">
              <span>Withdraw</span>
              <Icon name="arrow-up-right" size={16} />
            </DialogTrigger>
            <DialogContent
              className="overflow-hidden rounded-30 isolate gap-0 max-w-150"
              showCloseButton={false}
            >
              <VisuallyHidden.Root>
                <DialogTitle>Withdrawal Popup</DialogTitle>
                <DialogDescription>Withdrawal Popup</DialogDescription>
              </VisuallyHidden.Root>
              <WithdrawalFlow />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger className="bg-white text-black p-4 flex items-center gap-2 rounded-full">
              <span>Report Transaction</span>
              <Icon name="chat" size={16} />
            </DialogTrigger>
            <DialogContent
              className="overflow-hidden rounded-30 isolate gap-0 max-w-204.25"
              showCloseButton={false}
            >
              <VisuallyHidden.Root>
                <DialogTitle>Pending releases Popup</DialogTitle>
                <DialogDescription>Pending Releases Popup</DialogDescription>
              </VisuallyHidden.Root>
              <div className="absolute w-full top-0 right-0 h-64 bg-linear-to-r from-[#FF7247] to-[#FFC107] -z-10 opacity-25 blur-3xl"></div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default WalletPage;
