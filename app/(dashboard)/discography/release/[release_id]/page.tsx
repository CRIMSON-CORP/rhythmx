import Icon from "@/components/icon";
import { formatCount } from "@/lib/count-formatter";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUp, DollarSign, Edit, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import DeleteRelease from "./delete-release";
import PlayTrack from "./play-track";

async function Release({ params }: { params: Promise<{ release_id: string }> }) {
  const { release_id } = await params;
  const [{ release }, earnings] = await Promise.all([
    api.get<{ release: ReleaseDetail }>(`${API_ROUTES.RELEASES.MY}/${release_id}`),
    api.get<EarningsResponse>(`${API_ROUTES.RELEASES.EARNINGS(release_id)}`),
  ]);

  return (
    <div className="flex flex-col gap-8 container pb-6">
      {/* Header bar */}
      <header className="flex flex-wrap items-center justify-between gap-4 w-full pt-4 pb-10">
        <div className="flex items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/discography"
              className="size-[42] bg-brand-blue text-white rounded-full p-2 hover:bg-brand-blue/90 active:scale-95 transition-[colors,transform]"
            >
              <ArrowLeft name="arrow-left" size={27} />
            </Link>
            <h1 className="font-heading text-3xl md:text-5xl font-semibold leading-[0.7]">
              Release Details
            </h1>
          </div>
          <div className="bg-white flex items-center gap-2.5 px-5 py-4 rounded-full font-medium">
            <span className="text-sm text-border-default-secondary">All Platform plays</span>
            <span className="font-semibold">{formatCount(release.all_platform_plays)}</span>
            <ArrowUp size={32} className="text-positive-tertiary" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/discography/release/draft/${release.reference}`}>
            <Button variant="white">
              <Edit size={16} />
              <span>Edit Release</span>
            </Button>
          </Link>
          <DeleteRelease release_id={release.reference} release_status={release.status} />
        </div>
      </header>

      {/* Grid columns */}
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 items-stretch w-full">
        {/* Column 1: Album Details info */}
        <div className="bg-white rounded-30 p-8 flex flex-col justify-between gap-8 border border-default-secondary/5 min-h-125">
          <div className="flex flex-col gap-6">
            <div className="relative w-full max-w-80 aspect-square rounded-20 overflow-hidden">
              <Image
                fill
                src={release.cover_url}
                alt={release.title}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 30vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="font-heading text-2xl font-semibold">{release.title}</h2>
              {/* TODO: To add description when backend is redy to provide it */}
              {/* <p className="text-border-default-secondary leading-relaxed font-medium">
                &quot;You have to be really open, I think,&quot; Mabel tells Apple Music about the
                personal nature of her songwriting. &quot;All the songs people really relate to,
                that&apos;s because you&apos;re being human and saying, &apos;Look-this is the real!
                &quot; Born in 1996 in Spain, Mabel Alabama-Pearl McVey-daughter of Swedish artist
                Neneh Cherry and English producer Cameron McVey-has a knack for taking the intimate
                and relatable and turning it into spectacular, pumped-up{" "}
              </p> */}
            </div>
          </div>
          <div className="flex flex-col gap-4 border-t border-default-default pt-4">
            <span className="font-medum text-border-default-secondary">Release platforms</span>
            <div className="flex flex-wrap items-center gap-2">
              {release.platforms.map((platform) => (
                <span
                  key={platform.platform_id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-page-background rounded-full text-xs font-medium"
                >
                  {platform.logo_url ? (
                    <Image width={16} height={16} src={platform.logo_url} alt={platform.name} />
                  ) : (
                    <Music size={16} className="text-border-default-secondary" />
                  )}
                  <span>{platform.name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Track List */}
        <div className="bg-white rounded-30 p-6 flex flex-col gap-4 min-h-125">
          <h2 className="font-medium text-border-default-secondary">Tracks</h2>
          <div className="grow relative overflow-auto pr-2">
            <ul className="flex flex-col gap-4 overflow-auto absolute inset-0">
              {release.tracks.map((track) => (
                <li
                  key={track.reference}
                  className="flex max-lg:flex-wrap items-center justify-between gap-4 px-5 py-3 hover:rounded-20 border-default-tertiary border-b hover:bg-page-background transition-colors group"
                >
                  <span className="size-10 font-medium text-border-default-secondary text-center bg-page-background rounded-full flex items-center justify-center flex-none">
                    {track.order}
                  </span>
                  <div className="size-10.5 bg-brand-purple/12 rounded-full flex items-center justify-center flex-none">
                    <Icon name="music" size={26.25} className="text-brand-purple" />
                  </div>
                  <div className="flex flex-col grow break-all">
                    <span className="font-medium break-after-all">{track.title}</span>
                    <span className="text-[11px] text-border-default-secondary">
                      {track.is_uploaded ? "Uploaded" : "Not Uploaded"}
                    </span>
                  </div>
                  <Link
                    href="/"
                    className="px-5 py-3 border border-black hover:bg-white rounded-full transition-colors whitespace-nowrap"
                  >
                    Edit Track
                  </Link>
                  <PlayTrack source={track.audio_url} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Column 3: Earnings History */}
        <div className="bg-white rounded-30 p-8 flex flex-col gap-4 min-h-125">
          <header className="flex items-center justify-between gap-4">
            <h2 className="font-medium text-border-default-secondary">Earnings History</h2>
            <div className="flex items-center gap-1">
              <span className="text-sm text-border-default-secondary">Total Earnings</span>
              <span className="font-medium">
                {earnings.currency}
                {earnings.total_earnings}
              </span>
              <Icon name="arrow-up" size={16} className="text-positive-tertiary" />
            </div>
          </header>
          <div className="grow relative overflow-auto pr-2">
            <ul className="flex flex-col gap-4 overflow-auto absolute inset-0">
              {earnings.earnings.map((earning, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4 p-4 rounded-xl hover:bg-page-background/50 transition-colors"
                >
                  <div className="size-8 bg-brand-purple/12 rounded-full flex items-center justify-center text-brand-purple flex-none">
                    <DollarSign size={20} />
                  </div>
                  <div className="flex flex-col grow gap-0.5">
                    <span className="text-sm font-medium text-default truncate">
                      {earning.platform}
                    </span>
                    <span className="text-xs text-grey">{earning.track}</span>
                  </div>
                  <div className="flex items-center gap-1 font-medium text-sm">
                    <Icon name="arrow-up" size={12} className="text-positive-tertiary rotate-180" />
                    <span>{earning.amount}</span>
                  </div>
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Release;
