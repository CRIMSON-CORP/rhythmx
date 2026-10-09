import Icon from "@/components/icon";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReleaseCards from "@/components/realease-cards";
import { releases } from "@/data/releases";
import ReleaseCard from "@/components/release-card";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { earnings } from "@/data/earnings";
import { EarningItem } from "../../components/earning-item";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  CircleMinus,
  Disc,
  Music,
  Search,
} from "lucide-react";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { RemoveArtistDialog } from "./remove-artist-dialog";

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
  try {
    const res = await api.get<LabelArtistDetailResponse>(API_ROUTES.LABEL.ARTIST(artist_id));
    if (res?.artist) {
      artist = res.artist;
    }
  } catch (error) {
    console.error("Failed to fetch artist profile:", error);
  }

  if (!artist) redirect("/artists");

  const displayName = artist.legal_name || artist.stage_name;
  const avatarImage = artist.portrait_url || artist.avatar_url || "/images/avatar.png";

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
          <Button variant="white">
            <CircleMinus size={16} />
            <span>{artist.status === "inactive" ? "Enable Artist" : "Disable Artist"}</span>
          </Button>
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
                <span className="text-5xl">12,303,394</span>
                <ArrowUp size={32} className="text-positive-tertiary" />
              </h2>
              <p className="text-[#454545] text-sm font-medium">Increase compared to last week</p>
            </div>
            <div className="bg-white flex flex-col rounded-30 grow flex-1 min-w-80">
              <header className="p-4 flex items-baseline justify-between">
                <div className="flex items-center text-default-tertiary gap-1.5">
                  <Icon name="dollar" size={16} />
                  <span>Earning History</span>
                </div>
                <Button>
                  <span>Withdraw</span>
                  <ArrowUpRight size={16} />
                </Button>
              </header>
              <div className="overflow-y-auto max-h-77.25">
                <ul className="px-2">
                  {earnings.map((earning) => (
                    <EarningItem key={earning.id} {...earning} />
                  ))}
                </ul>
              </div>
              <footer className="p-5 flex items-center justify-center gap-2.5 border-t border-t-default-default">
                <p className="text-border-default-secondary text-sm">Total Earnings</p>
                <p className="font-medium text-default">$12,303,394</p>
              </footer>
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-8 pt-8 pb-4">
        <header className="container flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-medium whitespace-nowrap">All Releases</h2>
          <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
            <div className="flex items-center p-4 gap-x-2">
              <Search size={16} />
              <input
                type="search"
                placeholder="Search releases"
                className="bg-transparent outline-none"
              />
            </div>
            <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-white leading-tight">
              <ArrowUp size={16} />
              <span>All</span>
            </button>
            <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-white leading-tight">
              <Disc size={16} />
              <span>Album</span>
            </button>
            <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-white leading-tight">
              <Music size={16} />
              <span>Single</span>
            </button>
            <Select defaultValue="recent">
              <SelectTrigger className="bg-white rounded-full flex px-4 py-3 items-center">
                <span>Sort:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start" className="outline-0! p-2">
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="unpopular">Unpopular</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="any">
              <SelectTrigger className="bg-white rounded-full flex px-4 py-3 items-center">
                <span>Artist:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start" className="outline-0! p-2">
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>
        <ReleaseCards>
          {releases.map((release) => (
            <ReleaseCard
              key={release.id}
              {...({
                reference: release.id,
                cover_url: release.imageSrc,
                title: release.title,
                total_streams: release.engagements,
                type: release.type,
                platforms: [],
              } as unknown as Release)}
            />
          ))}
        </ReleaseCards>
      </section>
    </div>
  );
}

export default ArtistPage;
