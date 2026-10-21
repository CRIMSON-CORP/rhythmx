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

function PlatformLogo({ slug, name, logoUrl }: { slug: string; name: string; logoUrl?: string }) {
  if (slug === "spotify") {
    return (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <g clipPath="url(#clip0_spotify)">
          <path
            d="M16 0C7.1635 0 0 7.16362 0 16C0 24.837 7.16362 32 16 32C24.8371 32 32 24.837 32 16C32 7.16425 24.8371 0.000875 15.9998 0.000875L16 0ZM23.3374 23.0767C23.0508 23.5467 22.4355 23.6957 21.9655 23.4072C18.2089 21.1126 13.4799 20.5929 7.9105 21.8654C7.6526 21.9241 7.38193 21.878 7.15802 21.7372C6.93411 21.5964 6.7753 21.3724 6.7165 21.1145C6.68722 20.9868 6.6834 20.8547 6.70526 20.7255C6.72712 20.5964 6.77423 20.4728 6.84389 20.3619C6.91355 20.251 7.0044 20.1549 7.11123 20.0792C7.21807 20.0034 7.33879 19.9494 7.4665 19.9204C13.5615 18.5279 18.7894 19.1274 23.0069 21.7049C23.4769 21.9934 23.6259 22.6068 23.3374 23.0767ZM25.2957 18.7201C24.9345 19.307 24.1665 19.4924 23.58 19.1313C19.2793 16.4878 12.7234 15.7221 7.6365 17.2663C6.97675 17.4655 6.28 17.0938 6.07975 16.4351C5.881 15.7754 6.253 15.0799 6.91162 14.8794C12.7222 13.1161 19.946 13.9703 24.885 17.0053C25.4715 17.3665 25.6569 18.1344 25.2957 18.7201ZM25.4639 14.1835C20.3071 11.1205 11.7992 10.8387 6.87587 12.3333C6.08525 12.573 5.24913 12.1266 5.00962 11.336C4.77 10.545 5.21587 9.7095 6.00712 9.46912C11.6588 7.75338 21.0543 8.085 26.9911 11.6095C27.7039 12.0315 27.9369 12.95 27.5146 13.6601C27.0944 14.3714 26.1734 14.6058 25.4646 14.1835H25.4639Z"
            fill="#1ED760"
          />
        </g>
        <defs>
          <clipPath id="clip0_spotify">
            <rect width="32" height="32" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  }

  if (slug === "apple-music" || slug === "itunes") {
    return (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <g clipPath="url(#clip0_applemusic)">
          <path
            d="M31.992 8.1656C32.0027 7.18296 31.8952 6.2026 31.672 5.2456C31.2493 3.49893 30.256 2.1656 28.7653 1.18826C28.0053 0.699308 27.1539 0.369971 26.2627 0.220263C25.5735 0.10161 24.8765 0.0347564 24.1773 0.020263C24.124 0.016263 24.0667 0.00692969 24.012 0.00292969H7.98133C7.77956 0.0153741 7.57733 0.0269297 7.37467 0.0375964C6.37867 0.0949297 5.388 0.201596 4.45067 0.57093C2.66933 1.2776 1.384 2.50693 0.630667 4.2776C0.374667 4.87493 0.241333 5.51093 0.146667 6.15493C0.0740039 6.6766 0.0294949 7.20181 0.0133333 7.72826C0.0133333 7.77093 0.004 7.81093 0 7.85226V24.1496L0.036 24.7149C0.102667 25.8016 0.241333 26.8803 0.698667 27.8789C1.56533 29.7723 3.016 31.0163 5.01067 31.6136C5.57067 31.7829 6.152 31.8629 6.73467 31.9176C7.47467 31.9883 8.21467 31.9976 8.95733 31.9976H23.664C24.3638 31.9955 25.0629 31.9509 25.7573 31.8643C26.8533 31.7229 27.8853 31.3976 28.8173 30.7843C29.9225 30.0695 30.794 29.0464 31.324 27.8416C31.572 27.2816 31.7147 26.6816 31.8173 26.0763C31.968 25.1763 32.0013 24.2656 32 23.3563C31.9973 18.2896 32 13.2296 31.996 8.1656H31.992ZM23.428 13.4856V21.1016C23.428 21.6576 23.3507 22.2043 23.1027 22.7096C22.716 23.4963 22.0893 23.9923 21.252 24.2296C20.7862 24.3629 20.3107 24.4398 19.8253 24.4603C18.5587 24.5203 17.4613 23.6603 17.2347 22.4123C17.1395 21.8734 17.2232 21.3182 17.4731 20.8314C17.723 20.3446 18.1253 19.953 18.6187 19.7163C19.0493 19.5029 19.512 19.3829 19.976 19.2843C20.48 19.1749 20.9867 19.0803 21.488 18.9643C21.8533 18.8803 22.0973 18.6576 22.168 18.2763C22.1852 18.1916 22.1941 18.1054 22.1947 18.0189C22.1947 15.5985 22.1938 13.1794 22.192 10.7616C22.1915 10.6782 22.1799 10.5952 22.1573 10.5149C22.104 10.3149 21.9573 10.1909 21.752 10.2029C21.5387 10.2163 21.328 10.2496 21.1187 10.2909C20.1053 10.4918 19.092 10.6945 18.0787 10.8989L14.9787 11.5256L13.1467 11.8963L13.0827 11.9136C12.7133 12.0163 12.58 12.1843 12.5627 12.5669C12.5609 12.6229 12.5609 12.6807 12.5627 12.7403C12.56 16.2096 12.5627 19.6789 12.5587 23.1469C12.5587 23.7069 12.496 24.2616 12.272 24.7829C11.9013 25.6363 11.2453 26.1696 10.36 26.4269C9.89244 26.562 9.41467 26.6385 8.92667 26.6563C7.64667 26.7043 6.58667 25.8563 6.36667 24.5976C6.18 23.5149 6.67333 22.3509 7.90533 21.8309C8.38133 21.6309 8.87867 21.5216 9.38267 21.4176C9.76533 21.3376 10.1493 21.2629 10.5293 21.1816C11.0396 21.0696 11.3062 20.7523 11.3293 20.2296V20.0296L11.332 8.18693C11.332 8.02293 11.3493 7.8536 11.388 7.6936C11.4813 7.3136 11.752 7.09626 12.116 7.00293C12.456 6.91493 12.8027 6.8536 13.148 6.78293C14.1258 6.58382 15.1036 6.38649 16.0813 6.19093L19.108 5.5776L21.788 5.04026C22.0813 4.98293 22.3773 4.92293 22.672 4.89893C23.0853 4.8656 23.3693 5.1256 23.4107 5.5416C23.4213 5.63937 23.4267 5.73849 23.4267 5.83893C23.4293 8.38649 23.4293 10.934 23.4267 13.4816L23.428 13.4856Z"
            fill="#FF0040"
          />
        </g>
        <defs>
          <clipPath id="clip0_applemusic">
            <rect width="32" height="32" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  }

  if (slug === "youtube" || slug === "youtube-music") {
    return (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path
          d="M29.2913 8.69C29.1735 8.22919 28.9478 7.80298 28.6329 7.44654C28.318 7.09011 27.9228 6.81366 27.48 6.64C23.195 4.985 16.375 5 16 5C15.625 5 8.805 4.985 4.52 6.64C4.0772 6.81366 3.68204 7.09011 3.36712 7.44654C3.05219 7.80298 2.82653 8.22919 2.70875 8.69C2.385 9.9375 2 12.2175 2 16C2 19.7825 2.385 22.0625 2.70875 23.31C2.82636 23.771 3.05194 24.1975 3.36687 24.5542C3.68181 24.9108 4.07706 25.1875 4.52 25.3613C8.625 26.945 15.05 27 15.9175 27H16.0825C16.95 27 23.3787 26.945 27.48 25.3613C27.9229 25.1875 28.3182 24.9108 28.6331 24.5542C28.9481 24.1975 29.1736 23.771 29.2913 23.31C29.615 22.06 30 19.7825 30 16C30 12.2175 29.615 9.9375 29.2913 8.69ZM20.2775 16.4163L14.2775 20.4163C14.2022 20.4665 14.1146 20.4954 14.0242 20.4997C13.9338 20.5041 13.8438 20.4839 13.764 20.4411C13.6842 20.3984 13.6175 20.3348 13.571 20.2571C13.5245 20.1794 13.4999 20.0905 13.5 20V12C13.4999 11.9095 13.5245 11.8206 13.571 11.7429C13.6175 11.6652 13.6842 11.6016 13.764 11.5589C13.8438 11.5161 13.9338 11.4959 14.0242 11.5003C14.1146 11.5046 14.2022 11.5335 14.2775 11.5838L20.2775 15.5838C20.3461 15.6294 20.4023 15.6913 20.4412 15.7639C20.4801 15.8365 20.5005 15.9176 20.5005 16C20.5005 16.0824 20.4801 16.1635 20.4412 16.2361C20.4023 16.3087 20.3461 16.3706 20.2775 16.4163Z"
          fill="#EC221F"
        />
      </svg>
    );
  }

  if (slug === "tidal") {
    return (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <g clipPath="url(#clip0_tidal)">
          <path
            d="M16.016 5.32227L10.6773 10.6609L5.33867 5.32227L0 10.6609L5.33867 15.9996L10.6773 10.6609L16.016 15.9996L10.6773 21.3383L16.016 26.6769L21.3547 21.3383L16.016 15.9996L21.3547 10.6609L16.016 5.32227ZM21.3893 10.6609L26.6947 5.3556L32 10.6609L26.6947 15.9663L21.3893 10.6609Z"
            fill="black"
          />
        </g>
        <defs>
          <clipPath id="clip0_tidal">
            <rect width="32" height="32" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  }

  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt={name}
        width={32}
        height={32}
        className="size-8 object-contain rounded-lg shrink-0"
        unoptimized
      />
    );
  }

  return (
    <div className="size-8 rounded-full bg-default-default flex items-center justify-center font-bold text-xs text-default shrink-0">
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

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

  const [analysisRes, platformsRes] = await Promise.all([
    api.get<AnalysisOverViewResponse>(API_ROUTES.ANALYTICS.OVERVIEW("30d")).catch((err) => {
      console.error("Failed to load analytics overview:", err);
      return null;
    }),
    api.get<AnalyticsPlatformsResponse>(API_ROUTES.ANALYTICS.PLATFORMS(platformRange)).catch((err) => {
      console.error("Failed to load analytics platforms:", err);
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
                <header className="flex items-center gap-2">
                  <PlatformLogo slug={item.slug} name={item.platform} logoUrl={item.logo_url} />
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

export default TrendsAnalyticsPage;
