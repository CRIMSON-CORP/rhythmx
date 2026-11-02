import { isRedirectError } from "next/dist/client/components/redirect-error";
import TimeSorterSelect from "@/components/time-sorter-select";
import Greeting from "./components/greeting";
import CompletProfileCard from "./components/complete-profile-card";
import LifeTimeStreams from "./components/lifetime-streams";
import Earnings from "./components/earnings";
import EarningHistory from "./components/earning-history";
import MyRelease from "./components/my-release";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import TopReleasesCard from "./components/top-releases";
import AllArtistsCard from "./components/all-artists";
import { api } from "@/lib/api";
import { Suspense } from "react";
import { DashboardCardsSkeleton } from "./components/dashboard-cards-skeleton";
import { formatRangeLabel, normalizeDashboardRange } from "@/lib/format-range";

interface PageProps {
  searchParams?: Promise<{ "time-sort"?: string; range?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const rawRange = params?.["time-sort"] || params?.range || "30d";
  const range = normalizeDashboardRange(rawRange);

  return (
    <div className="flex flex-col gap-6 pb-6">
      <div className="container flex flex-wrap items-center justify-between gap-6">
        <Greeting />
        <TimeSorterSelect />
      </div>
      <div className="flex flex-col gap-8">
        <div className="container grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 flex-wrap">
          <CompletProfileCard />
          <Suspense key={range} fallback={<DashboardCardsSkeleton />}>
            <DashboardMetricsCards range={range} />
          </Suspense>
        </div>
        <MyRelease />
      </div>
    </div>
  );
}

async function DashboardMetricsCards({ range }: { range: string }) {
  const session = await getServerSession(authOptions);
  let analytics: DashboardAnalyticsData | null = null;

  try {
    analytics = await api.get<DashboardAnalyticsData>(
      `/api/analytics/dashboard?range=${range}`
    );
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Failed to fetch dashboard analytics:", error);
  }

  const accountType = session?.user.account_type || "artist";
  const isLabel = accountType === "label";
  const isArtist = !isLabel;
  const rangeLabel = formatRangeLabel(range);

  return (
    <>
      <LifeTimeStreams data={analytics?.streams} rangeLabel={rangeLabel} />
      {isLabel && (
        <>
          <TopReleasesCard data={analytics?.releases} rangeLabel={rangeLabel} />
          <AllArtistsCard data={analytics?.artists} rangeLabel={rangeLabel} />
        </>
      )}
      {isArtist && <Earnings data={analytics?.earnings} rangeLabel={rangeLabel} />}
      <EarningHistory history={analytics?.earning_history} />
    </>
  );
}
