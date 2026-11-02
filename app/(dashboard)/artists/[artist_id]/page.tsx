import Icon from "@/components/icon";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
} from "lucide-react";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { RemoveArtistDialog } from "./remove-artist-dialog";
import { ToggleArtistAccessButton } from "./toggle-artist-access-button";
import WithdrawalFlow from "@/app/(dashboard)/wallet/withdrawal-flow";
import ArtistReleasesSection from "./artist-releases-section";

function formatDob(dobStr: string | null | undefined): string {
  if (!dobStr) return "—";
  try {
    const d = new Date(dobStr);
    if (isNaN(d.getTime())) return dobStr;
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dobStr;
  }
}

async function ArtistPage({ params }: { params: Promise<{ artist_id: string }> }) {
  const { artist_id } = await params;

  let artist: LabelArtist | null = null;
  let stats: ArtistStatsResponse | null = null;
  let initialReleases: Release[] = [];
  let initialHasMore = false;

  try {
    const [artistRes, statsRes, releasesRes] = await Promise.all([
      api.get<LabelArtistDetailResponse>(API_ROUTES.LABEL.ARTISTS.ARTIST(artist_id)),
      api.get<ArtistStatsResponse>(API_ROUTES.LABEL.ARTISTS.STATS(artist_id)).catch((err) => {
        console.error("Failed to fetch artist stats:", err);
        return null;
      }),
      api
        .get<ArtistReleasesResponse>(
          API_ROUTES.LABEL.ARTISTS.RELEASES(artist_id, "page=1&limit=20"),
        )
        .catch((err) => {
          console.error("Failed to fetch artist releases:", err);
          return null;
        }),
    ]);
    if (artistRes?.artist) {
      artist = artistRes.artist;
    }
    if (statsRes) {
      stats = statsRes;
    }
    if (releasesRes?.releases) {
      initialReleases = releasesRes.releases;
      initialHasMore =
        releasesRes.meta?.pagination?.has_next ?? initialReleases.length >= 20;
    }
  } catch (error) {
    console.error("Failed to fetch artist profile:", error);
  }

  if (!artist) redirect("/artists");

  const displayName =
    artist.legal_name ||
    artist.stage_name ||
    [artist.first_name, artist.last_name].filter(Boolean).join(" ") ||
    "Artist";
  const avatarImage = artist.portrait_url || artist.avatar_url || "/images/avatar.png";

  const plays = stats?.plays;
  const earningsData = stats?.earnings;

  const totalPlays = plays?.total ?? 0;
  const changeDirection = plays?.change?.toLowerCase();
  const isUp = changeDirection === "up";
  const isDown = changeDirection === "down";
  const comparisonText = isUp
    ? "Increase compared to last month"
    : isDown
    ? "Decrease compared to last month"
    : "Compared to last month";

  const currency = earningsData?.currency || "GBP";
  const totalEarnings = earningsData?.total ?? 0;
  const stores = earningsData?.stores ?? [];

  return (
    <div className="flex flex-col gap-8 container">
      {/* Header bar */}
      <header className="flex flex-wrap items-center justify-between gap-4 w-full pt-4 pb-10">
        <div className="flex items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/artists"
              className="size-[42] bg-brand-blue text-white rounded-full p-2 hover:bg-brand-blue/90 active:scale-95 transition-[colors,transform]"
            >
              <ArrowLeft size={27} />
            </Link>
            <h1 className="font-heading text-3xl md:text-5xl font-semibold leading-[0.7]">
              Artist Profile
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ToggleArtistAccessButton
            reference={artist.reference}
            initialStatus={artist.status}
          />
          <RemoveArtistDialog reference={artist.reference} />
        </div>
      </header>
      <section>
        <div className="container">
          <div className="flex gap-8 flex-wrap">
            <div className="p-6 bg-white flex flex-col items-start gap-6 rounded-30 flex-2">
              <div className="flex items-center self-stretch flex-wrap gap-6">
                <div className="size-42 aspect-square relative rounded-full overflow-hidden bg-default-secondary/30 shrink-0">
                  <Image
                    src={avatarImage}
                    alt={displayName}
                    fill
                    className="rounded-full object-cover object-center"
                  />
                </div>
                <div className="flex grow justify-center items-center divide-x divide-default-default">
                  <div className="flex flex-col p-5 w-full max-w-63">
                    <p className="text-lg">{formatDob(artist.dob)}</p>
                    <p className="text-border-default-secondary">Born</p>
                  </div>
                  <div className="flex flex-col p-5 w-full max-w-63">
                    <p className="text-lg">{artist.genre || "—"}</p>
                    <p className="text-border-default-secondary">Genre</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="font-semibold text-2xl font-heading">{displayName}</h1>
                {artist.bio ? (
                  <p className="font-medium text-border-default-secondary">{artist.bio}</p>
                ) : null}
              </div>
              <Button variant="orange" size="xl">
                <span>Edit Profile</span>
                <ArrowRight size={16} />
              </Button>
            </div>
            <div className="p-6 bg-white flex flex-col gap-2 items-center justify-center rounded-30 grow flex-1 min-w-80">
              <p className="text-sm font-medium text-default">All Platform plays</p>
              <h2 className="flex items-center text-default gap-2">
                <span className="text-5xl">{totalPlays.toLocaleString()}</span>
                {isUp ? (
                  <ArrowUp size={32} className="text-positive-tertiary" />
                ) : isDown ? (
                  <ArrowDown size={32} className="text-danger-default" />
                ) : null}
              </h2>
              <p className="text-[#454545] text-sm font-medium">{comparisonText}</p>
            </div>
            <div className="bg-white flex flex-col rounded-30 grow flex-1 min-w-80">
              <header className="p-4 flex items-baseline justify-between">
                <div className="flex items-center text-default-tertiary gap-1.5">
                  <Icon name="dollar" size={16} />
                  <span>Earning History</span>
                </div>
                <WithdrawalFlow initialArtistReference={artist.reference} />
              </header>
              <div className="overflow-y-auto max-h-77.25 min-h-36">
                <ul className="px-2">
                  {stores.map((store, idx) => (
                    <li
                      key={`${store.platform}-${idx}`}
                      className="p-4 flex items-center gap-3 transition-colors hover:bg-default-secondary/5 rounded-xl"
                    >
                      {store.logo_url ? (
                        <Image
                          src={store.logo_url}
                          alt={store.platform}
                          width={32}
                          height={32}
                          unoptimized
                          className="w-8 h-8 rounded-full object-contain shrink-0 bg-default-secondary/10 p-0.5"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-brand-purple/12 p-1.5 flex items-center justify-center shrink-0">
                          <Icon name="dollar" size={20} className="text-brand-purple" />
                        </div>
                      )}
                      <div className="flex grow flex-col gap-0.5 min-w-0">
                        <h4 className="font-medium text-sm truncate">{store.platform}</h4>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 font-medium text-sm text-[#131313]">
                        <ArrowDown size={12} className="text-positive-tertiary" />
                        <span>+{formatCurrency(store.amount, currency)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <footer className="p-5 flex items-center justify-center gap-2.5 border-t border-t-default-default mt-auto">
                <p className="text-border-default-secondary text-sm">Total Earnings</p>
                <p className="font-medium text-default">{formatCurrency(totalEarnings, currency)}</p>
              </footer>
            </div>
          </div>
        </div>
      </section>

      {/* All Releases Section with Infinite Scroll & Filter Bar */}
      <ArtistReleasesSection
        artistId={artist_id}
        initialReleases={initialReleases}
        initialHasMore={initialHasMore}
      />
    </div>
  );
}

export default ArtistPage;
