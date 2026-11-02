import { ArrowUpRight, ChevronDown, X, Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import WithdrawalFlow from "./withdrawal-flow";
import ReportTransactionModal from "./report-transaction-modal";
import {
  Select,
  SelectContent,
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
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { TransactionDetailsModal } from "./transaction-details-modal";
import { StatusBadge } from "./status-badge";
import { WalletPagination } from "./wallet-pagination";

function formatCurrency(amount: number, currencyCode: string = "GBP"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr.replace(" ", "T"));
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

interface WalletPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

export default async function WalletPage({ searchParams }: WalletPageProps) {
  const resolvedParams = await searchParams;
  const page = Math.max(1, parseInt(resolvedParams?.page || "1", 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(resolvedParams?.limit || "20", 10) || 20));

  const [balanceRes, transactionsRes] = await Promise.all([
    api.get<EarningsBalanceResponse>(API_ROUTES.EARNINGS.GET).catch(() => null),
    api
      .get<WalletTransactionsResponse>(
        API_ROUTES.EARNINGS.TRANSACTIONS.LIST(`page=${page}&limit=${limit}`),
      )
      .catch(() => null),
  ]);

  const formattedBalance = formatCurrency(balanceRes?.balance ?? 0, balanceRes?.currency ?? "GBP");

  const transactions = transactionsRes?.transactions ?? [];
  const pagination = transactionsRes?.meta?.pagination ?? {
    page,
    limit,
    total: transactions.length,
    pages: Math.max(1, Math.ceil(transactions.length / limit)),
    has_next: false,
    has_prev: page > 1,
  };

  return (
    <div className="flex flex-col gap-8 grow min-h-0 pb-8 overflow-auto">
      <div className="container flex flex-wrap items-center justify-between gap-6">
        <h1 className="font-heading text-3xl md:text-5xl leading-tight font-semibold flex items-center gap-2.5 text-default">
          <span>Wallet</span>
          <div className="bg-white flex items-center gap-2.5 px-5 py-4 rounded-full font-sans font-medium max-sm:hidden">
            <span className="text-sm text-border-default-secondary">Balance</span>
            <Separator orientation="vertical" />
            <span className="text-2xl font-semibold">{formattedBalance}</span>
          </div>
        </h1>
        <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
          <WithdrawalFlow />
          <ReportTransactionModal />
        </div>
      </div>
      <div className="container grid grid-rows-[max-content_1fr] xl:grid-cols-[minmax(0,1fr)_379px] gap-5 grow min-h-0 overflow-auto">
        <header className="flex items-center justify-between gap-4 flex-wrap">
          <p className="text-lg font-medium">Transactions History</p>
          <div className="flex items-center max-md:gap-4 gap-8">
            <Select defaultValue="all">
              <SelectTrigger className="bg-white rounded-full flex px-4 py-3 items-center">
                <span>Filter:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start" className="outline-0! p-2">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="wallet">Wallet Transaction</SelectItem>
                <SelectItem value="royalty">Royalty Transaction</SelectItem>
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-white rounded-full flex px-4 py-3 items-center gap-2 text-sm font-medium">
                <span>Export Transactions</span>
                <ChevronDown size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <a href={API_ROUTES.EARNINGS.TRANSACTIONS.EXPORT} download>
                    CSV
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={`${API_ROUTES.EARNINGS.TRANSACTIONS.EXPORT}?format=excel`} download>
                    Excel
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="flex flex-col gap-6 row-start-2 overflow-auto grow min-h-0">
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
              <ul className="grid grid-cols-subgrid col-start-1 -col-end-1 h-full overflow-auto">
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <li
                      key={tx.reference}
                      className="grid grid-cols-subgrid col-start-1 col-end-8 w-full py-5 border-b border-default-default *:px-6 *:py-2 items-center hover:bg-default-secondary/5 transition-colors"
                    >
                      <div>
                        <TransactionDetailsModal reference={tx.reference} initialData={tx} />
                      </div>
                      <p className="text-default/70 font-medium text-sm capitalize">{tx.source}</p>
                      <p className="text-default/70 font-medium text-sm capitalize">{tx.type}</p>
                      <p className="flex items-center gap-2.5">
                        <Image
                          src={tx.transact_by?.avatar_url || "/images/release-1.png"}
                          alt={tx.transact_by?.name || "avatar"}
                          width={24}
                          height={24}
                          unoptimized
                          className="rounded-full object-cover w-6 h-6 shrink-0"
                        />
                        <span className="text-default font-medium text-sm">
                          {tx.transact_by?.name}
                        </span>
                      </p>
                      <p className="text-default/70 font-medium text-sm">
                        {formatDate(tx.created_at)}
                      </p>
                      <p className="font-semibold text-sm text-default">
                        {formatCurrency(tx.amount, tx.currency)}
                      </p>
                      <div>
                        <StatusBadge status={tx.status} />
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="col-start-1 col-end-8 py-16 text-center text-default-tertiary font-medium">
                    No transactions found.
                  </li>
                )}
              </ul>
            </div>
            <WalletPagination
              page={pagination.page}
              limit={pagination.limit}
              total={pagination.total}
              pages={pagination.pages}
              hasNext={pagination.has_next}
              hasPrev={pagination.has_prev}
            />
          </div>
        </div>
        <div className="bg-brand-purple-2 row-start-2 outline outline-default-default rounded-30 p-4 flex flex-col gap-6 basis-94.75 max-xl:hidden">
          <header className="flex items-center justify-between">
            <Zap size={32} className="text-white" />
            <button>
              <X size={12} className="text-white" />
            </button>
          </header>
          <div className="grow flex items-center justify-center">
            <Image
              src="/images/box-with-toy-items.png"
              alt="Complete Profile Card"
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
