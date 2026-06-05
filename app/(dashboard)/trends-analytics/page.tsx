import Icon from "@/components/icon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "radix-ui";
import Releases from "../discography/releases";
import { earnings } from "@/data/earnings";
import { EarningItem } from "../components/earning-item";
import TimeSorterSelect from "@/components/time-sorter-select";
import Image from "next/image";

const data = [15, 21, 6, 10, 9, 20, 23, 10, 3, 24, 16, 22, 4, 5];
const dataMax = Math.max(...data);
function DisocgraphyPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="container flex flex-wrap items-center justify-between gap-6">
        <h1 className="font-heading text-3xl md:text-5xl leading-tight font-semibold flex items-center gap-2.5 text-default">
          <span>Trends & Analytics</span>
        </h1>
        <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
          <Dialog>
            <DialogTrigger className="bg-white p-4 rounded-full flex items-center gap-2 whitespace-nowrap">
              <Icon name="check-circle" size={16} />
              <span>Approved Release (3)</span>
            </DialogTrigger>
            <DialogContent
              className="overflow-hidden rounded-30 isolate gap-0 max-w-204.25"
              showCloseButton={false}
            >
              <VisuallyHidden.Root>
                <DialogTitle>Approved releases Popup</DialogTitle>
                <DialogDescription>Approved Releases Popup</DialogDescription>
              </VisuallyHidden.Root>
              <div className="absolute w-full top-0 right-0 h-64 bg-linear-to-r from-[#14AE5C] to-[#FFC107] -z-10 opacity-25 blur-3xl"></div>
              <Releases title="Approved Release" />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger className="bg-white p-4 rounded-full flex items-center gap-2">
              <Icon name="check-circle" size={16} />
              <span>Pending Release (3)</span>
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
              <Releases title="Pending Release" type="pending" />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger className="bg-white p-4 rounded-full flex items-center gap-2">
              <Icon name="check-circle" size={16} />
              <span>Rejected Release (3)</span>
            </DialogTrigger>
            <DialogContent
              className="overflow-hidden rounded-30 isolate gap-0 max-w-204.25"
              showCloseButton={false}
            >
              <VisuallyHidden.Root>
                <DialogTitle>Rejected releases Popup</DialogTitle>
                <DialogDescription>Rejected Releases Popup</DialogDescription>
              </VisuallyHidden.Root>
              <div className="absolute w-full top-0 right-0 h-64 bg-linear-to-r from-[#FF7247] to-[#EC221F] -z-10 opacity-25 blur-3xl"></div>
              <Releases title="Rejected Release" type="rejected" />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <section className="flex flex-col gap-8">
        <div className="container">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(500px,100%),1fr))] gap-6">
            {/* Lifetime Streams Card */}
            <div className="bg-white rounded-30 basis-91.25">
              <header className="flex items-center gap-1 text-default-tertiary px-4 py-5">
                <Icon name="activity" size={16} />
                <h2 className="font-medium leading-tight">Lifetime Streams</h2>
              </header>
              <div className="flex flex-col px-6 pb-6 gap-6">
                <div className="flex flex-col gap-2 py-4 border-b border-b-default/10">
                  <span className="font-heading text-xl font-medium leading-tight">
                    192,463,897
                  </span>
                  <span className="text-default/40 font-medium leading-tight">Streams</span>
                </div>
                <div className="flex flex-col gap-2 self-stretch">
                  <span className="font-heading text-xl font-medium leading-tight">874,376</span>
                  <span className="text-default/40 font-medium leading-tight">
                    Total Stream Last 30 days
                  </span>
                  <div className="flex items-end justify-between h-12.5">
                    {data.map((amount, index) => (
                      <div
                        key={index}
                        style={{ height: (amount / dataMax) * 100 + "%" }}
                        className="bg-default-tertiary rounded-full w-1.5"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* All Artist Card */}
            <div className="bg-white rounded-30 basis-91.25">
              <header className="flex items-center gap-1 text-default-tertiary px-4 py-5">
                <Icon name="activity" size={16} />
                <h2 className="font-medium leading-tight">All Artist</h2>
              </header>
              <div className="flex flex-col px-6 pb-6 gap-6">
                <div className="flex flex-col gap-2 py-4 border-b border-b-default/10">
                  <span className="font-heading text-xl font-medium leading-tight">
                    192,463,897
                  </span>
                  <span className="text-default/40 font-medium leading-tight">Artists</span>
                </div>
                <div className="flex flex-col gap-2 self-stretch">
                  <span className="font-heading text-xl font-medium leading-tight">874,376</span>
                  <span className="text-default/40 font-medium leading-tight">
                    Total Artists Last 30 days
                  </span>
                  <div className="flex items-end justify-between h-12.5">
                    {data.map((amount, index) => (
                      <div
                        key={index}
                        style={{ height: (amount / dataMax) * 100 + "%" }}
                        className="bg-default-tertiary rounded-full w-1.5"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Earning history */}
            <div className="bg-white rounded-30 row-span-2 flex flex-col w-full md:basis-84.5">
              <header className="flex items-center justify-between gap-1 text-default-tertiary px-4 py-5">
                <h2 className="font-medium leading-tight">Earning History</h2>
                <div className="flex items-center gap-2.5">
                  <span className="font-medium text-sm text-border-default-secondary">
                    Total Earnings
                  </span>
                  <span className="font-medium text-sm text-default">$2,384.00</span>
                  <Icon name="arrow-up" size={18} className="text-positive-tertiary" />
                </div>
              </header>
              <ul className="divide-y divide-default-default">
                {earnings.slice(0, 4).map((earning) => (
                  <EarningItem key={earning.id} {...earning} />
                ))}
              </ul>
            </div>
            {/* Total Release */}
            <div className="bg-white rounded-30 basis-91.25">
              <header className="flex items-center gap-1 text-default-tertiary px-4 py-5">
                <Icon name="disc" size={16} />
                <h2 className="font-medium leading-tight">Total Release</h2>
              </header>
              <div className="flex flex-col px-6 pb-6 gap-6">
                <div className="flex flex-col gap-2 py-4">
                  <span className="font-heading text-xl font-medium leading-tight">
                    192,463,897
                  </span>
                  <span className="text-default/40 font-medium leading-tight">Streams</span>
                </div>
              </div>
            </div>
            {/* Total Revenue */}
            <div className="bg-white rounded-30 basis-91.25">
              <header className="flex items-center gap-1 text-default-tertiary px-4 py-5">
                <Icon name="disc" size={16} />
                <h2 className="font-medium leading-tight">Total Revenue</h2>
              </header>
              <div className="flex flex-col px-6 pb-6 gap-6">
                <div className="flex flex-col gap-2 py-4">
                  <span className="font-heading text-xl font-medium leading-tight">
                    192,463,897
                  </span>
                  <span className="text-default/40 font-medium leading-tight">Streams</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-8">
        <div className="container flex flex-col gap-8">
          <header className="container flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 text-default">
              <Icon name="trending-up" size={24} />
              <h2 className="font-medium">Growth by platform</h2>
            </div>
          </header>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(500px,100%),1fr))] gap-6">
            {/* Apple music stream */}
            <div className="bg-white rounded-30 basis-91.25 p-6">
              <header className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="apple-music" size={32} />
                  <h2 className="font-medium leading-tight">Apple Music</h2>
                </div>
                <TimeSorterSelect />
              </header>
              <div className="flex flex-col py-6">
                <div className="flex flex-col gap-2 self-stretch">
                  <span className="font-heading text-xl font-medium leading-tight">874,376</span>
                  <span className="text-default/40 font-medium leading-tight">
                    Total Stream Last 30 days
                  </span>
                  <div className="flex items-end justify-between h-12.5">
                    {data.map((amount, index) => (
                      <div
                        key={index}
                        style={{ height: (amount / dataMax) * 100 + "%" }}
                        className="bg-default-tertiary rounded-full w-1.5"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Spotify music stream */}
            <div className="bg-white rounded-30 basis-91.25 p-6">
              <header className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="spotify" size={32} />
                  <h2 className="font-medium leading-tight">Spotify</h2>
                </div>
                <TimeSorterSelect />
              </header>
              <div className="flex flex-col py-6">
                <div className="flex flex-col gap-2 self-stretch">
                  <span className="font-heading text-xl font-medium leading-tight">874,376</span>
                  <span className="text-default/40 font-medium leading-tight">
                    Total Stream Last 30 days
                  </span>
                  <div className="flex items-end justify-between h-12.5">
                    {data.map((amount, index) => (
                      <div
                        key={index}
                        style={{ height: (amount / dataMax) * 100 + "%" }}
                        className="bg-default-tertiary rounded-full w-1.5"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Youtube Music stream */}
            <div className="bg-white rounded-30 basis-91.25 p-6">
              <header className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="youtube" size={32} />
                  <h2 className="font-medium leading-tight">Youtube Music</h2>
                </div>
                <TimeSorterSelect />
              </header>
              <div className="flex flex-col py-6">
                <div className="flex flex-col gap-2 self-stretch">
                  <span className="font-heading text-xl font-medium leading-tight">874,376</span>
                  <span className="text-default/40 font-medium leading-tight">
                    Total Stream Last 30 days
                  </span>
                  <div className="flex items-end justify-between h-12.5">
                    {data.map((amount, index) => (
                      <div
                        key={index}
                        style={{ height: (amount / dataMax) * 100 + "%" }}
                        className="bg-default-tertiary rounded-full w-1.5"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-8">
        <div className="container flex flex-col gap-8">
          <header className="container flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3.5 text-default">
              <Icon name="globe" size={24} />
              <h2 className="font-medium">World Domination</h2>
            </div>
            <div className="px-5 py-4 bg-white rounded-full flex items-center gap-2">
              <span className="text-border-default-secondary text-sm font-medium leading-tight">
                By Percentage
              </span>
              <span className="font-medium leading-tight">60%</span>
            </div>
          </header>
          <Image
            src="/images/world.png"
            alt="world-map"
            width={1770}
            height={715}
            className="object-cover rounded-30"
          />
        </div>
      </section>
      <section className="flex flex-col gap-8 pt-8 pb-4"></section>
    </div>
  );
}

export default DisocgraphyPage;
