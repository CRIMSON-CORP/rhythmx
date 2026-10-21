import { Activity, ArrowUp, CircleCheckBig, Disc, Globe, TrendingUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "radix-ui";
import Releases from "../discography/releases";
import PlatformRangeSelect from "@/components/platform-range-select";
import Image from "next/image";
import WorldDominationMap from "./world-domination-map";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { formatCurrency } from "@/lib/utils";

const data = [15, 21, 6, 10, 9, 20, 23, 10, 3, 24, 16, 22, 4, 5];
const dataMax = Math.max(...data);

const VALID_RANGES = ["7d", "14d", "30d", "60d", "120d", "180d", "1yr"] as const;

const RANGE_LABELS: Record<string, string> = {
  "7d": "7 days",
  "14d": "14 days",
  "30d": "30 days",
  "60d": "60 days",
  "120d": "120 days",
  "180d": "180 days",
  "1yr": "1 year",
};



interface TrendsAnalyticsPageProps {
  searchParams: Promise<{
    platform_range?: string;
  }>;
}

async function TrendsAnalyticsPage({ searchParams }: TrendsAnalyticsPageProps) {
  const resolvedParams = await searchParams;
  const rawPlatformRange = resolvedParams?.platform_range || "30d";
  const platformRange = (VALID_RANGES as readonly string[]).includes(rawPlatformRange)
    ? rawPlatformRange
    : "30d";

  const [analysisRes, platformsRes, countriesRes] = await Promise.all([
    api.get<AnalysisOverViewResponse>(API_ROUTES.ANALYTICS.OVERVIEW("30d")).catch((err) => {
      console.error("Failed to load analytics overview:", err);
      return null;
    }),
    api
      .get<AnalyticsPlatformsResponse>(API_ROUTES.ANALYTICS.PLATFORMS(platformRange))
      .catch((err) => {
        console.error("Failed to load analytics platforms:", err);
        return null;
      }),
    api
      .get<AnalyticsCountriesResponse>(API_ROUTES.ANALYTICS.COUNTRIES("30d"))
      .catch((err) => {
        console.error("Failed to load analytics countries:", err);
        return null;
      }),
  ]);

  const analysis: AnalysisOverViewResponse = analysisRes || {
    streams: { lifetime: 0, range: 0 },
    downloads: { lifetime: 0, range: 0 },
    artists: { lifetime: 0, range: 0 },
    releases: { total: 0, approved: 0, rejected: 0, pending: 0 },
    revenue: { total: 0, currency: "GBP" },
    earnings_history: [],
  };

  const platforms = platformsRes?.platforms || [];
  const currentRangeLabel = RANGE_LABELS[platformRange] || "30 days";

  const countries = countriesRes?.countries || [];
  const totalMapLocations = 256;
  const dominationPercent =
    countries.length > 0 ? (countries.length / totalMapLocations) * 100 : 0;
  const dominationFormatted =
    dominationPercent === 0
      ? "0%"
      : dominationPercent < 1
      ? `${dominationPercent.toFixed(1)}%`
      : `${Math.round(dominationPercent)}%`;

  return (
    <div className="flex flex-col gap-6">
      <div className="container flex flex-wrap items-center justify-between gap-6">
        <h1 className="font-heading text-3xl md:text-5xl leading-tight font-semibold flex items-center gap-2.5 text-default">
          <span>Trends & Analytics</span>
        </h1>
        <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
          {analysis.releases.approved > 0 && (
            <Dialog>
              <DialogTrigger className="bg-white p-4 rounded-full flex items-center gap-2 whitespace-nowrap">
                <CircleCheckBig size={16} />
                <span>Approved Release ({analysis.releases.approved})</span>
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
          )}
          {analysis.releases.pending > 0 && (
            <Dialog>
              <DialogTrigger className="bg-white p-4 rounded-full flex items-center gap-2">
                <CircleCheckBig size={16} />
                <span>Pending Release ({analysis.releases.pending})</span>
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
          )}
          {analysis.releases.rejected > 0 && (
            <Dialog>
              <DialogTrigger className="bg-white p-4 rounded-full flex items-center gap-2">
                <CircleCheckBig size={16} />
                <span>Rejected Release ({analysis.releases.rejected})</span>
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
          )}
        </div>
      </div>
      <section className="flex flex-col gap-8">
        <div className="container">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(500px,100%),1fr))] gap-6">
            {/* Lifetime Streams Card */}
            <div className="bg-white rounded-30 basis-91.25">
              <header className="flex items-center gap-1 text-default-tertiary px-4 py-5">
                <Activity size={16} />
                <h2 className="font-medium leading-tight">Lifetime Streams</h2>
              </header>
              <div className="flex flex-col px-6 pb-6 gap-6">
                <div className="flex flex-col gap-2 py-4 border-b border-b-default/10">
                  <span className="font-heading text-xl font-medium leading-tight">
                    {analysis.streams.lifetime.toLocaleString()}
                  </span>
                  <span className="text-default/40 font-medium leading-tight">Streams</span>
                </div>
                <div className="flex flex-col gap-2 self-stretch">
                  <span className="font-heading text-xl font-medium leading-tight">
                    {analysis.streams.range.toLocaleString()}
                  </span>
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
                <Activity size={16} />
                <h2 className="font-medium leading-tight">All Artist</h2>
              </header>
              <div className="flex flex-col px-6 pb-6 gap-6">
                <div className="flex flex-col gap-2 py-4 border-b border-b-default/10">
                  <span className="font-heading text-xl font-medium leading-tight">
                    {analysis.artists.lifetime.toLocaleString()}
                  </span>
                  <span className="text-default/40 font-medium leading-tight">Artists</span>
                </div>
                <div className="flex flex-col gap-2 self-stretch">
                  <span className="font-heading text-xl font-medium leading-tight">
                    {analysis.artists.range.toLocaleString()}
                  </span>
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
                  <span className="font-medium text-sm text-default">
                    {formatCurrency(analysis.revenue.total, analysis.revenue.currency)}
                  </span>
                  <ArrowUp size={18} className="text-positive-tertiary" />
                </div>
              </header>
              <ul className="divide-y divide-default-default">
                {(analysis.earnings_history || []).map((earning, index) => (
                  <li key={index} className="p-4 flex items-center justify-between gap-3">
                    <span className="font-medium text-sm text-default">{earning.platform}</span>
                    <span className="font-medium text-sm text-default">
                      +{formatCurrency(earning.amount, analysis.revenue.currency)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Total Release */}
            <div className="bg-white rounded-30 basis-91.25">
              <header className="flex items-center gap-1 text-default-tertiary px-4 py-5">
                <Disc size={16} />
                <h2 className="font-medium leading-tight">Total Release</h2>
              </header>
              <div className="flex flex-col px-6 pb-6 gap-6">
                <div className="flex flex-col gap-2 py-4">
                  <span className="font-heading text-xl font-medium leading-tight">
                    {analysis.releases.total.toLocaleString()}
                  </span>
                  <span className="text-default/40 font-medium leading-tight">Releases</span>
                </div>
              </div>
            </div>
            {/* Total Revenue */}
            <div className="bg-white rounded-30 basis-91.25">
              <header className="flex items-center gap-1 text-default-tertiary px-4 py-5">
                <Disc size={16} />
                <h2 className="font-medium leading-tight">Total Revenue</h2>
              </header>
              <div className="flex flex-col px-6 pb-6 gap-6">
                <div className="flex flex-col gap-2 py-4">
                  <span className="font-heading text-xl font-medium leading-tight">
                    {formatCurrency(analysis.revenue.total, analysis.revenue.currency)}
                  </span>
                  <span className="text-default/40 font-medium leading-tight">Revenue</span>
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
              <TrendingUp name="trending-up" size={24} />
              <h2 className="font-medium">Growth by platform</h2>
            </div>
            <PlatformRangeSelect />
          </header>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-6">
            {platforms.map((item) => (
              <div key={item.slug || item.platform} className="bg-white rounded-30 basis-91.25 p-6">
                <header className="flex items-center gap-2.5">
                  {item.logo_url && (
                    <Image
                      src={item.logo_url}
                      alt={item.platform}
                      width={32}
                      height={32}
                      className="size-8 object-contain rounded-lg shrink-0"
                      unoptimized
                    />
                  )}
                  <h2 className="font-medium leading-tight">{item.platform}</h2>
                </header>
                <div className="flex flex-col py-6">
                  <div className="flex flex-col gap-2 self-stretch">
                    <span className="font-heading text-xl font-medium leading-tight">
                      {item.streams.toLocaleString()}
                    </span>
                    <span className="text-default/40 font-medium leading-tight">
                      Total Stream Last {currentRangeLabel}
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
            ))}
            {platforms.length === 0 && (
              <div className="col-span-full py-12 text-center text-sm text-default-tertiary bg-white rounded-30">
                No platform data found for this period.
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-8">
        <div className="container flex flex-col gap-8">
          <header className="container flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3.5 text-default">
              <Globe size={24} />
              <h2 className="font-medium">World Domination</h2>
            </div>
            <div className="px-5 py-4 bg-white rounded-full flex items-center gap-2">
              <span className="text-border-default-secondary text-sm font-medium leading-tight">
                By Percentage
              </span>
              <span className="font-medium leading-tight">{dominationFormatted}</span>
            </div>
          </header>
          <WorldDominationMap
            countries={countries}
            totals={countriesRes?.totals}
          />
        </div>
      </section>
      <section className="flex flex-col gap-8 pt-8 pb-4"></section>
    </div>
  );
}

export default TrendsAnalyticsPage;
