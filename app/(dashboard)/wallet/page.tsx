import { ArrowUpRight, Check, ChevronDown, X, Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import WithdrawalFlow from "./withdrawal-flow";
import ReportTransactionModal from "./report-transaction-modal";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Icon from "@/components/icon";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Field, FieldLabel } from "@/components/ui/field";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowUpRight, Check, ChevronDown, X, Zap } from "lucide-react";

function WalletPage() {
  return (
    <div className="flex flex-col gap-8 grow min-h-0 overflow-auto">
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
          <WithdrawalFlow />
          <ReportTransactionModal />
        </div>
      </div>
      <div className="container flex gap-5 grow min-h-0 overflow-auto">
        <div className="flex flex-col gap-6 overflow-auto grow min-h-0">
          <header className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-lg font-medium">Transactions History</p>
            <div className="flex items-center max-md:gap-4 gap-8">
              <Select defaultValue="all">
                <SelectTrigger className="bg-white rounded-full flex px-4 py-3 items-center">
                  <span>Fitler:</span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" align="start" className="outline-0! p-2">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="wallet">Wallet Transaction</SelectItem>
                  <SelectItem value="royalty">Royalty Transaction</SelectItem>
                </SelectContent>
              </Select>
              <DropdownMenu>
                <DropdownMenuTrigger className="bg-white rounded-full flex px-4 py-3 items-center gap-2">
                  <span>Export Transactions</span>
                  <ChevronDown size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <a href="/wallet/export/csv" download>
                      CSV
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/wallet/export/excel" download>
                      Excel
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <div className="flex flex-col gap-4 grow min-h-0 justify-between h-full overflow-x-auto">
            <div className="bg-white rounded-30 grid grid-rows-[max-content_1fr] grid-cols-[max-content_max-content_max-content_1fr_max-content_max-content_max-content] pt-4 min-h-0 overflow-auto whitespace-nowrap">
              <header className="grid grid-cols-subgrid col-start-1 col-end-8 font-medium text-default/50 *:px-6 *:py-3 w-full border-b border-default-default">
                <p>Transaction ID</p>
                <p>Trans Type</p>
                <p>Trans Action</p>
                <p>Transact by</p>
                <p>Date</p>
                <p>Amount</p>
                <p>Status</p>
              </header>
              <ul className="grid grid-cols-subgrid col-start-1 col-end-8 h-full overflow-auto">
                <li className="grid grid-cols-subgrid col-start-1 col-end-8 w-full py-6 border-b border-default-default *:px-6 *:py-3 items-center">
                  <TransactionDetails transaction_id="#RHY38849403" />
                  <p>Wall</p>
                  <p>Credit</p>
                  <p className="flex items-center gap-3">
                    <Image
                      src="/images/release-1.png"
                      alt="Mabel"
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-default">Mabel</span>
                  </p>
                  <p>Jan 4, 2022</p>
                  <p>$847.00</p>
                  {STATUS_MAP["paid"]}
                </li>
                <li className="grid grid-cols-subgrid col-start-1 col-end-8 w-full py-6 border-b border-default-default *:px-6 *:py-3 items-center">
                  <p>#RHY38849403</p>
                  <p>Wall</p>
                  <p>Credit</p>
                  <p className="flex items-center gap-3">
                    <Image
                      src="/images/release-1.png"
                      alt="Mabel"
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-default">Mabel</span>
                  </p>
                  <p>Jan 4, 2022</p>
                  <p>$847.00</p>
                  {STATUS_MAP["paid"]}
                </li>
                <li className="grid grid-cols-subgrid col-start-1 col-end-8 w-full py-6 border-b border-default-default *:px-6 *:py-3 items-center">
                  <TransactionDetails transaction_id="#RHY38849403" />
                  <p>Wall</p>
                  <p>Credit</p>
                  <p className="flex items-center gap-3">
                    <Image
                      src="/images/release-1.png"
                      alt="Mabel"
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-default">Mabel</span>
                  </p>
                  <p>Jan 4, 2022</p>
                  <p>$847.00</p>
                  {STATUS_MAP["paid"]}
                </li>
                <li className="grid grid-cols-subgrid col-start-1 col-end-8 w-full py-6 border-b border-default-default *:px-6 *:py-3 items-center">
                  <p>#RHY38849403</p>
                  <p>Wall</p>
                  <p>Credit</p>
                  <p className="flex items-center gap-3">
                    <Image
                      src="/images/release-1.png"
                      alt="Mabel"
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-default">Mabel</span>
                  </p>
                  <p>Jan 4, 2022</p>
                  <p>$847.00</p>
                  {STATUS_MAP["paid"]}
                </li>
                <li className="grid grid-cols-subgrid col-start-1 col-end-8 w-full py-6 border-b border-default-default *:px-6 *:py-3 items-center">
                  <TransactionDetails transaction_id="#RHY38849403" />
                  <p>Wall</p>
                  <p>Credit</p>
                  <p className="flex items-center gap-3">
                    <Image
                      src="/images/release-1.png"
                      alt="Mabel"
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-default">Mabel</span>
                  </p>
                  <p>Jan 4, 2022</p>
                  <p>$847.00</p>
                  {STATUS_MAP["paid"]}
                </li>
              </ul>
            </div>
            <Pagination className="px-6 py-4 justify-between rounded-30 bg-white">
              <PaginationContent className="justify-between w-full">
                <Field orientation="horizontal" className="w-fit text-black/50">
                  <FieldLabel htmlFor="select-rows-per-page" className="max-sm:hidden">
                    Rows per page
                  </FieldLabel>
                  <Select defaultValue="25">
                    <SelectTrigger className="w-10" id="select-rows-per-page">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="start">
                      <SelectGroup>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <div className="flex items-center gap-1">
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      2
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                </div>
                <div className="flex items-center gap-1">
                  <PaginationItem>
                    <PaginationPrevious text="" href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext text="" href="#" />
                  </PaginationItem>
                </div>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
        <div className="bg-brand-purple outline outline-default-default rounded-30 p-4 flex flex-col gap-6 basis-94.75 max-xl:hidden">
          <header className="flex items-center justify-between">
            <Zap size={32} className="text-white" />
            <button>
              <X size={12} className="text-white" />
            </button>
          </header>
          <div className="grow flex items-center justify-center">
            <Image
              src="/images/box-with-toy-items.png"
              alt="Complet Profile Card"
              width={226.39}
              height={198.4}
            />
          </div>
          <div className="flex flex-col gap-1 text-white">
            <h2 className="text-white text-5xl font-bold leading-tight">
              Let&apos;s blow things up 💣
            </h2>
            <p className="text-xs">Start with setting up your account</p>
            <Link href="/profile" className="flex items-center gap-2 text-xs">
              <span>Complete Profile</span>
              <ArrowUpRight size={16} className="text-default" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WalletPage;

const STATUS_MAP = {
  paid: (
    <div className="px-1.5! py-1! rounded-full flex items-center gap-2 bg-secondary w-fit">
      <Check size={16} className="text-[#14AE5C]" />
      <span className="text-sm">Paid</span>
    </div>
  ),
};

function TransactionDetails({ transaction_id }: { transaction_id: string }) {
  return (
    <Dialog>
      <DialogTrigger className="text-brand-blue">{transaction_id}</DialogTrigger>
      <DialogContent showCloseButton={false} className="max-w-173 overflow-hidden gap-0">
        <DialogHeader className="flex-row items-center justify-between px-6 py-5 border-b border-default-default">
          <DialogTitle className="text-sm text-default font-medium">
            Transaction Details
          </DialogTitle>
          <DialogClose className="p-2 text-default">
            <X size={20} />
          </DialogClose>
        </DialogHeader>
        <div className="p-6 flex flex-col gap-6">
          <div className="p-6 flex items-center justify-between text-xl">
            <div className="flex items-center gap-2.5">
              <p className="text-default">#RHY38849403</p>
              <div className="bg-[#EBFFEE] rounded-full p-0.5">
                <Icon name="arrow-down" size={12} className="text-[#14AE5C]" />
              </div>
              {STATUS_MAP["paid"]}
            </div>
            <p>$847.00</p>
          </div>
          <div className="flex flex-col gap-2 p-4">
            <div className="flex items-center justify-between py-3.5">
              <p className="text-default/50 font-medium">Transaction Date</p>
              <p className="text-lg text-default">Jan 6, 2022</p>
            </div>
            <div className="flex items-center justify-between py-3.5">
              <p className="text-default/50 font-medium">Transaction Type</p>
              <p className="text-lg text-default">Wallet</p>
            </div>
            <div className="flex items-center justify-between py-3.5">
              <p className="text-default/50 font-medium">Transaction Action</p>
              <p className="text-lg text-default">Credit</p>
            </div>
            <div className="flex items-center justify-between py-3.5">
              <p className="text-default/50 font-medium">Status</p>
              <p className="text-lg text-default">Paid</p>
            </div>
            <div className="flex items-center justify-between py-3.5">
              <p className="text-default/50 font-medium">Transact by</p>
              <p className="flex items-center gap-3">
                <Image
                  src="/images/release-1.png"
                  alt="Mabel"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="text-default">Mabel</span>
              </p>
            </div>
            <div className="flex items-center justify-between py-3.5">
              <p className="text-default/50 font-medium">Reference ID</p>
              <p className="text-lg text-default">3948975jd3834jw03j39849</p>
            </div>
          </div>
          <div className="outline outline-black rounded-full w-fit mx-auto">
            <ReportTransactionModal defaultRefId="#RHY38849403" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
