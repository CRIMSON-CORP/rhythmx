import Link from "next/link";
import { Suspense } from "react";
import { ArrowUpRight, Star } from "lucide-react";
import { InvitesInvitesTrigger, PendingInvitesTrigger } from "./invites";
import Artist from "@/components/artist";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import AllArtistsSection, { AllArtistsSkeleton } from "./all-artists-section";

function parseJoinedDate(dateStr: string): number {
  if (!dateStr) return 0;
  const isoStr = dateStr.includes(" ") ? dateStr.replace(" ", "T") : dateStr;
  const time = new Date(isoStr).getTime();
  return isNaN(time) ? 0 : time;
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export default async function ArtistsPage() {
  let initialArtists: LabelArtist[] = [];
  let initialMeta: PaginationMeta | undefined;

  try {
    const res = await api.get<LabelArtistsResponse>(
      `${API_ROUTES.LABEL.ARTISTS}?page=1&limit=20`
    );
    if (res?.artists) {
      initialArtists = res.artists;
      initialMeta = res.meta?.pagination;
    }
  } catch (error) {
    console.error("Failed to fetch initial artists on server:", error);
  }

  // Derive "Recently Added" on the server:
  // Artists who joined in the last 7 days; fallback to top 10 most recent artists
  const sorted = [...initialArtists].sort(
    (a, b) => parseJoinedDate(b.joined_at) - parseJoinedDate(a.joined_at)
  );
  const now = Date.now();
  const last7Days = sorted.filter((artist) => {
    const joinedTime = parseJoinedDate(artist.joined_at);
    return joinedTime > 0 && now - joinedTime <= SEVEN_DAYS_MS;
  });
  const recentlyAdded = last7Days.length > 0 ? last7Days : sorted.slice(0, 10);

  const totalCount = initialMeta?.total ?? initialArtists.length;
  const initialHasMore = initialMeta?.has_next ?? (initialArtists.length >= 20);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header - Server Rendered */}
      <div className="container flex flex-wrap items-center justify-between gap-6">
        <h1 className="font-heading text-[32px] leading-tight font-semibold flex items-center gap-2.5 text-default">
          <span>Artists</span>
          <div className="bg-white flex items-center gap-2.5 px-5 py-4 rounded-full font-sans font-medium max-sm:hidden">
            <span className="text-sm text-border-default-secondary">All Artist</span>
            <span className="text-base">{totalCount}</span>
          </div>
        </h1>
        <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
          <PendingInvitesTrigger />
          <InvitesInvitesTrigger />
        </div>
      </div>

      {/* Recently Added Section - Server Rendered */}
      {recentlyAdded.length > 0 && (
        <section className="flex flex-col gap-8">
          <header className="container flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 text-default-tertiary">
              <Star size={24} />
              <h2 className="font-medium">Recently Added</h2>
            </div>
            <Link href="/trends-analytics" className="flex items-center gap-1 text-xs">
              <span>See Trends & Analytics</span>
              <ArrowUpRight size={16} />
            </Link>
          </header>
          <div className="container">
            <div className="bg-white rounded-30 p-3 md:p-8 grid grid-cols-[repeat(auto-fill,minmax(min(168px,100%),1fr))] gap-8">
              {recentlyAdded.map((artist) => (
                <Artist
                  id={artist.reference}
                  key={`recent-${artist.reference}`}
                  image={artist.portrait_url || artist.avatar_url}
                  name={artist.stage_name || artist.legal_name}
                  location={artist.country_name || artist.country}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Artists Section - Client Driven with Suspense */}
      <Suspense fallback={<AllArtistsSkeleton />}>
        <AllArtistsSection
          initialArtists={initialArtists}
          initialHasMore={initialHasMore}
        />
      </Suspense>
    </div>
  );
}
