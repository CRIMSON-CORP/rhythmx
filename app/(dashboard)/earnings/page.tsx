import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDown, ArrowUpRight, ChevronDown, Music, Plus, X, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";

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

export default async function EarningsPage() {
  let overview: EarningsOverviewResponse = {
    total_earning: 0,
    available_funds: 0,
    payment_cleared: 0,
    ongoing_earnings: 0,
    earnings_to_date: 0,
    total_withdrawal: {
      count: 0,
      amount: 0,
    },
    currency: "GBP",
    earning_history: {
      platforms: [],
      royalty: [],
    },
  };

  try {
    const res = await api.get<EarningsOverviewResponse>(API_ROUTES.EARNINGS.OVERVIEW);
    if (res) {
      overview = {
        ...overview,
        ...res,
        total_withdrawal: res.total_withdrawal ?? overview.total_withdrawal,
        earning_history: {
          platforms: res.earning_history?.platforms ?? [],
          royalty: res.earning_history?.royalty ?? [],
        },
      };
    }
  } catch (error) {
    console.warn("Failed to fetch earnings overview:", error);
  }

  const currency = overview.currency || "GBP";
  const formattedTotalEarning = formatCurrency(overview.total_earning, currency);
  const formattedAvailableFunds = formatCurrency(overview.available_funds, currency);
  const formattedPaymentCleared = formatCurrency(overview.payment_cleared, currency);
  const formattedOngoingEarnings = formatCurrency(overview.ongoing_earnings, currency);
  const formattedEarningsToDate = formatCurrency(overview.earnings_to_date, currency);
  const totalWithdrawalCount = overview.total_withdrawal?.count ?? 0;

  const platforms = overview.earning_history?.platforms ?? [];
  const royalty = overview.earning_history?.royalty ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="container flex flex-wrap items-center justify-between gap-6">
        <h1 className="font-heading text-3xl md:text-5xl leading-tight font-semibold flex items-center gap-2.5 text-default">
          <span>Earnings</span>
          <div className="bg-white flex items-center gap-2.5 px-5 py-4 rounded-full font-sans font-medium max-sm:hidden">
            <span className="text-sm text-border-default-secondary">Total Earning</span>
            <span className="text-base">{formattedTotalEarning}</span>
          </div>
        </h1>
        <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
          <Select defaultValue="joining">
            <SelectTrigger className="w-fit px-4 py-3 bg-white rounded-full ring-0! shadow-none border-none gap-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="end" className="rounded-20! outline-0! ring-0">
              <SelectItem value="joining">Since Joining</SelectItem>
            </SelectContent>
          </Select>
          <Link
            href="/wallet"
            className="bg-white p-4 rounded-full flex items-center gap-2 whitespace-nowrap"
          >
            <Icon name="wallet" size={16} />
            <span>Go to Wallet</span>
          </Link>
        </div>
      </div>
      <section className="flex flex-col gap-8 mb-16">
        <div className="container">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(500px,100%),1fr))] gap-6">
            {/* Available funds */}
            <div className="bg-white rounded-30 p-6 flex flex-col gap-4">
              <h2 className="font-medium leading-tight mb-4">Available Funds</h2>
              <div className="flex gap-2 items-center text-[32px] font-medium">
                <span>{formattedAvailableFunds}</span>
                <ArrowUpRight size={32} />
              </div>
              <Button asChild rounded={10} variant="outline" className="mt-auto">
                <Link href="/wallet" className="flex items-center gap-2 justify-center">
                  <span>Withdraw Funds</span>
                  <Plus size={16} />
                </Link>
              </Button>
            </div>
            {/* Payment Cleared */}
            <div className="bg-white rounded-30 p-6 flex flex-col gap-4 justify-between">
              <div className="flex flex-col gap-4">
                <h2 className="font-medium leading-tight mb-4">Payment Cleared</h2>
                <div className="flex items-center gap-2 grow text-[32px] font-medium">
                  <span>{formattedPaymentCleared}</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="font-medium leading-tight pt-4 border-t border-t-default-default">
                  Ongoing Earnings
                </h2>
                <div className="flex items-center gap-2 grow text-[32px] font-medium">
                  <span>{formattedOngoingEarnings}</span>
                  <ArrowUpRight size={32} />
                </div>
              </div>
            </div>
            {/* Earnings to date & Total Withdrawal */}
            <div className="bg-white rounded-30 p-6 flex flex-col gap-4 justify-between">
              <div className="flex flex-col gap-4">
                <h2 className="font-medium leading-tight mb-4">Earnings to date</h2>
                <div className="flex items-center gap-2 grow text-[32px] font-medium">
                  <span>{formattedEarningsToDate}</span>
                </div>
                <p className="text-sm text-border-default-secondary font-medium">
                  Your earnings since joining.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="font-medium leading-tight pt-4 border-t border-t-default-default">
                  Total Withdrawal
                </h2>
                <div className="flex items-center gap-2 grow text-[32px] font-medium">
                  <span>{totalWithdrawalCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <div className="flex flex-wrap gap-6">
            {/* Platforms Earning History */}
            <div className="flex flex-col gap-6 flex-1 basis-125">
              <header className="flex items-center gap-2.5 py-2 font-medium">
                <span className="text-lg">Earning History</span>
                <span className="text-brand-purple-2 bg-brand-purple-2/12 px-3 py-1 rounded-full text-xs">
                  Plaforms
                </span>
              </header>
              <div className="h-140 overflow-y-auto p-4 bg-white rounded-30 flex flex-col">
                {platforms.length > 0 ? (
                  <ul className="flex flex-col divide-y divide-default-default/50 w-full">
                    {platforms.map((item, idx) => (
                      <li
                        key={`${item.platform}-${idx}`}
                        className="p-4 flex items-center gap-3 transition-colors hover:bg-default-secondary/5 rounded-xl"
                      >
                        {item.logo_url ? (
                          <Image
                            src={item.logo_url}
                            alt={item.platform}
                            width={32}
                            height={32}
                            unoptimized
                            className="w-8 h-8 rounded-full object-contain shrink-0 bg-default-secondary/10 p-0.5"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-brand-purple-2/10 flex items-center justify-center shrink-0">
                            <Icon name="music" size={16} className="text-brand-purple-2" />
                          </div>
                        )}
                        <span className="font-medium text-sm text-[#131313] truncate">
                          {item.platform}
                        </span>
                        <div className="flex items-center gap-1 ml-auto shrink-0 font-medium text-sm text-[#131313]">
                          <ArrowDown size={12} className="text-positive-tertiary" />
                          <span>+{formatCurrency(item.amount, currency)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center self-center mx-auto my-auto gap-8">
                    <Image src="/images/money-bag.png" width={133} height={133} alt="money bag" />
                    <div className="flex flex-col gap-2 text-center">
                      <h3 className="text-xl leading-tight font-medium">
                        Beginnings are so exciting!
                      </h3>
                      <p className="text-border-default-secondary text-sm font-medium max-w-108.75 mx-auto">
                        You&apos;ll find all your release platforms earnings history here once you
                        drop your first release.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Royalty Earning History */}
            <div className="flex flex-col gap-6 flex-1 basis-125">
              <header className="flex items-center justify-between py-2 font-medium">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">Earning History</span>
                  <span className="text-brand-orange bg-brand-orange/12 px-3 py-1 rounded-full text-xs">
                    Royalty
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  rounded="full"
                  disabled
                  className="border-brand-blue text-brand-blue hover:text-brand-blue px-4 py-2 h-auto text-sm font-medium gap-1.5 opacity-60 cursor-not-allowed"
                >
                  <span>Download</span>
                  <ChevronDown size={14} />
                </Button>
              </header>
              <div className="h-140 overflow-y-auto p-4 bg-white rounded-30 flex flex-col">
                {royalty.length > 0 ? (
                  <ul className="flex flex-col divide-y divide-default-default/50 w-full">
                    {royalty.map((item, idx) => (
                      <li
                        key={`${item.isrc || item.track}-${idx}`}
                        className="p-4 flex items-center gap-3 transition-colors hover:bg-default-secondary/5 rounded-xl"
                      >
                        <div className="w-8 h-8 rounded-lg bg-brand-purple/10 flex items-center justify-center shrink-0 text-brand-purple">
                          <Music size={16} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-sm text-[#131313] truncate">
                            {item.track}
                          </span>
                          <span className="text-xs text-[#454545] font-normal truncate">
                            {item.isrc}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 ml-auto shrink-0 font-medium text-sm text-[#131313]">
                          <ArrowDown size={12} className="text-positive-tertiary" />
                          <span>+{formatCurrency(item.amount, currency)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center self-center mx-auto my-auto gap-8">
                    <Image
                      src="/images/glass-jar-with-coins.png"
                      width={133}
                      height={133}
                      alt="money bag"
                    />
                    <div className="flex flex-col gap-2 text-center">
                      <h3 className="text-xl leading-tight font-medium">
                        Your Royalty Earning History
                      </h3>
                      <p className="text-border-default-secondary text-sm font-medium max-w-108.75 mx-auto">
                        You&apos;ll find all your Royalty earning history here once you drop your
                        first release.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Promo Banner */}
            <div className="flex-[0.45] min-w-70 bg-brand-orange outline outline-default-default rounded-30 p-4 flex flex-col gap-6 basis-94.75">
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
                  width={128.53}
                  height={112.64}
                />
              </div>
              <div className="flex flex-col gap-1 text-white">
                <h2 className="text-white font-medium leading-tight text-3xl md:text-5xl">
                  Let&apos;s blow things up 💣
                </h2>
                <p className="text-lg">Start with setting up your account</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
