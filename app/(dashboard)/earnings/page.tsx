import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";

function EarningsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="container flex flex-wrap items-center justify-between gap-6">
        <h1 className="font-heading text-3xl md:text-5xl leading-tight font-semibold flex items-center gap-2.5 text-default">
          <span>Earnings</span>
          <div className="bg-white flex items-center gap-2.5 px-5 py-4 rounded-full font-sans font-medium max-sm:hidden">
            <span className="text-sm text-border-default-secondary">Total Earning</span>
            <span className="text-base">$0.00</span>
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
              <div className="flex gap-2 grow text-[32px] font-medium">
                <span>$ 0.00</span>
                <Icon name="arrow-up-right" size={32} />
              </div>
              <Button className="w-fit" variant="outline">
                <span>Withdraw Funds</span>
                <Icon name="plus" size={16} />
              </Button>
            </div>
            {/* Payment Cleared */}
            <div className="bg-white rounded-30 p-6 flex flex-col gap-4 justify-between">
              <div className="flex flex-col gap-4">
                <h2 className="font-medium leading-tight mb-4">Payment Cleared</h2>
                <div className="flex items-center gap-2 grow text-[32px] font-medium">
                  <span>$ 0.00</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="font-medium leading-tight pt-4 border-t border-t-default-default">
                  Ongoing Earnings
                </h2>
                <div className="flex items-center gap-2 grow text-[32px] font-medium">
                  <span>$ 0.00</span>
                  <Icon name="arrow-up-right" size={32} />
                </div>
              </div>
            </div>
            {/* Payment Cleared */}
            <div className="bg-white rounded-30 p-6 flex flex-col gap-4 justify-between">
              <div className="flex flex-col gap-4">
                <h2 className="font-medium leading-tight mb-4">Earnings to date</h2>
                <div className="flex items-center gap-2 grow text-[32px] font-medium">
                  <span>$ 0.00</span>
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
                  <span>$ 0.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col gap-6 flex-1 basis-125">
              <header className="flex items-center gap-2.5 py-2 font-medium">
                <span className="text-lg">Earning History</span>
                <span className="text-brand-purple-2 bg-brand-purple-2/12 px-3 py-1 rounded-full text-xs">
                  Plaforms
                </span>
              </header>
              <div className="h-140 overflow-y-auto p-4 bg-white rounded-30 flex">
                <div className="flex flex-col items-center self-center mx-auto gap-8">
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
              </div>
            </div>
            <div className="flex flex-col gap-6 flex-1 basis-125">
              <header className="flex items-center gap-2.5 py-2 font-medium">
                <span className="text-lg">Earning History</span>
                <span className="text-brand-orange bg-brand-orange/12 px-3 py-1 rounded-full text-xs">
                  Royalty
                </span>
              </header>
              <div className="h-140 overflow-y-auto p-4 bg-white rounded-30 flex">
                <div className="flex flex-col items-center self-center mx-auto gap-8">
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
              </div>
            </div>
            <div className="flex-[0.45] min-w-70 bg-brand-orange outline outline-default-default rounded-30 p-4 flex flex-col gap-6">
              <header className="flex items-center justify-between">
                <Icon name="zap" size={32} className="text-white" />
                <button>
                  <Icon name="cancel" size={12} className="text-white" />
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

export default EarningsPage;
