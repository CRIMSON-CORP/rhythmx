import Link from "next/link";
import ReleaseCards from "@/components/realease-cards";
import ReleaseCard from "@/components/release-card";
import ReleaseStatus from "@/components/release-status";
import { ArrowUpRight, Disc } from "lucide-react";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import AllReleasesSection, { AllReleasesSkeleton } from "./all-releases-section";
import { Suspense } from "react";

export default async function DiscographyPage() {
  let initialReleases: Release[] = [];
  let totalCount = 0;
  let counts: ReleaseStatusCounts | undefined;
  let initialHasMore = true;

  try {
    const res = await api.get<ReleasesResponse>(`${API_ROUTES.RELEASES.MY}?page=1&limit=20`);

    if (res?.releases) {
      initialReleases = res.releases;
      totalCount = res.meta?.pagination?.total ?? 0;
      counts = res.meta?.counts;
      initialHasMore =
        res.meta?.pagination?.has_next !== undefined
          ? res.meta.pagination.has_next
          : res.releases.length >= 20;
    }
  } catch (error) {
    console.error("Failed to fetch releases for discography:", error);
  }

  // Top Releases yardstick:
  // Sort releases descending by total_streams.
  // Pick releases with streams > 0; if none have streams, fallback to top 10 most recent.
  const sortedByStreams = [...initialReleases].sort(
    (a, b) => (b.total_streams || 0) - (a.total_streams || 0),
  );
  const withStreams = sortedByStreams.filter((r) => (r.total_streams || 0) > 0);
  const topReleases =
    withStreams.length > 0 ? withStreams.slice(0, 10) : initialReleases.slice(0, 10);

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Top Header */}
      <div className="container flex flex-wrap items-center justify-between gap-6">
        <h1 className="font-heading text-3xl md:text-5xl leading-tight font-semibold flex items-center gap-2.5 text-default">
          <span>Discography</span>
          <div className="bg-white flex items-center gap-2.5 px-5 py-4 rounded-full font-sans font-medium max-sm:hidden">
            <span className="text-sm text-border-default-secondary">Total Release</span>
            <span className="text-base">{totalCount.toLocaleString()}</span>
          </div>
        </h1>
        <ReleaseStatus counts={counts} />
      </div>

      {/* Top Releases Carousel */}
      {topReleases.length > 0 && (
        <section className="flex flex-col gap-8">
          <header className="container flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 text-default-tertiary">
              <Disc size={24} />
              <h2 className="font-medium">Top Releases</h2>
            </div>
            <Link href="/trends-analytics" className="flex items-center gap-1 text-xs">
              <span>See Trends & Analytics</span>
              <ArrowUpRight size={16} />
            </Link>
          </header>
          <ReleaseCards scrollable>
            {topReleases.map((release) => (
              <ReleaseCard key={`top-${release.reference}`} {...release} />
            ))}
          </ReleaseCards>
        </section>
      )}

      {/* All Releases Section with Infinite Scroll & Filters */}
      <Suspense fallback={<AllReleasesSkeleton />}>
        <AllReleasesSection initialReleases={initialReleases} initialHasMore={initialHasMore} />
      </Suspense>
    </div>
  );
}
