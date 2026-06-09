import { Trash2 } from "lucide-react";
import Icon from "@/components/icon";
import { formatCount } from "@/lib/count-formatter";
import { releases } from "@/data/releases";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUp, Edit, Trash2 } from "lucide-react";

// About description mapping for each release to showcase rich details
const ABOUT_DESCRIPTIONS: Record<string, string> = {
  "1": "An exceptional indie-pop collection featuring shimmering synth leads, atmospheric guitar lines, and personal, heartfelt lyrics. Recorded over the course of a year, this record encapsulates the artist's signature blending of organic and electronic elements, delivering a raw yet polished soundscape.",
  "2": "An immersive ambient journey inspired by ocean tides and coastal soundscapes. Waves features field recordings of the Atlantic shore layered with warm analog synthesizer pads and delicate acoustic strings, designed to be played in moments of deep relaxation and reflection.",
  "3": "A high-energy, beat-focused release that bridges classic house grooves with futuristic sound design. This record is built for the dancefloor, featuring driving basslines, vocal hooks, and vintage synth chords that will keep listeners moving late into the night.",
};

const DEFAULT_ABOUT =
  "An inspiring and beautiful release from Captain RL, blending unique vocal delivery with top-tier production and modern electronic beats. This release marks another highlight in the artist's discography, showcasing their signature sound design and musical depth.";

const DUMMY_TRACKS = [
  { index: 1, name: "Audio83840559930.mp3", status: "Uploaded" },
  { index: 2, name: "Audio83840559931.mp3", status: "Uploaded" },
  { index: 3, name: "Audio83840559932.mp3", status: "Uploaded" },
  { index: 4, name: "Audio83840559933.mp3", status: "Uploaded" },
  { index: 5, name: "Audio83840559934.mp3", status: "Uploaded" },
  { index: 6, name: "Audio83840559935.mp3", status: "Uploaded" },
  { index: 7, name: "Audio83840559936.mp3", status: "Uploaded" },
  { index: 8, name: "Audio83840559937.mp3", status: "Uploaded" },
  { index: 9, name: "Audio83840559937.mp3", status: "Uploaded" },
  { index: 10, name: "Audio83840559937.mp3", status: "Uploaded" },
  { index: 11, name: "Audio83840559937.mp3", status: "Uploaded" },
];

const DUMMY_EARNINGS = [
  { platform: "Apple Music", detail: "Single: Sugar", amount: "+ $0.32" },
  { platform: "Spotify", detail: "Album: Waves", amount: "+ $0.45" },
  { platform: "Amazon Music", detail: "EP: Echoes", amount: "+ $0.29" },
  { platform: "Tidal", detail: "Playlist: Vibes", amount: "+ $0.50" },
  { platform: "YouTube Music", detail: "Single: Dreams", amount: "+ $0.35" },
  { platform: "Deezer", detail: "Album: Journeys", amount: "+ $0.40" },
  { platform: "SoundCloud", detail: "Mixtape: Beats", amount: "+ $0.20" },
  { platform: "Pandora", detail: "Station: Chill Vibes", amount: "+ $0.55" },
  { platform: "iHeartRadio", detail: "Show: Morning Mix", amount: "+ $0.30" },
  { platform: "Tidal", detail: "Album: New Horizon", amount: "+ $0.60" },
];

const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.83-.98 2.94.1.08.2.08.3.08.88 0 1.95-.56 2.51-1.41z" />
  </svg>
);

const SpotifyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 .007c-6.627 0-12 5.372-12 12 0 6.627 5.373 12 12 12 6.628 0 12-5.373 12-12 0-6.628-5.372-12-12-12zm5.501 17.311c-.22.359-.689.479-1.047.26-2.879-1.76-6.502-2.16-10.771-1.18-.411.096-.821-.161-.917-.573-.096-.411.16-.821.574-.917 4.671-1.069 8.663-.611 11.897 1.369.359.22.478.689.264 1.041zm1.469-3.26c-.279.45-.869.59-1.32.31-3.289-2.02-8.31-2.61-12.19-1.43-.51.15-1.05-.14-1.2-.66-.15-.51.14-1.05.66-1.2 4.44-1.35 10-1.7 13.82.65.45.28.6.86.32 1.33zm.09-3.39c-3.95-2.35-10.47-2.57-14.26-1.42-.6.18-1.25-.17-1.43-.78-.18-.61.17-1.25.78-1.43 4.35-1.32 11.53-1.07 16.08 1.63.54.32.72 1.02.4 1.56-.32.53-1.02.71-1.57.44z" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

async function Release({ params }: { params: Promise<{ release_id: string }> }) {
  const { release_id } = await params;

  // Find current release, default to first release if not found
  const release = releases.find((r) => r.id === release_id) || releases[0];
  const aboutText = ABOUT_DESCRIPTIONS[release.id] || DEFAULT_ABOUT;

  return (
    <div className="flex flex-col gap-8 container">
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
            <span className="font-semibold">{formatCount(release.engagements)}</span>
            <ArrowUp size={32} className="text-positive-tertiary" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 p-4 bg-white rounded-full hover:bg-page-background transition-colors cursor-pointer">
            <Edit size={16} />
            <span>Edit Release</span>
          </button>
          <button className="flex items-center gap-2 p-4 bg-white rounded-full hover:bg-page-background transition-colors cursor-pointer">
            <Trash2 size={16} className="text-danger-default" />
            <span>Delete Release</span>
          </button>
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
                src={release.imageSrc}
                alt={release.title}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 30vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="font-heading text-2xl font-semibold">{release.title}</h2>
              <p className="text-border-default-secondary leading-relaxed font-medium">
                {aboutText}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 border-t border-default-default pt-4">
            <span className="font-medum text-border-default-secondary">Release platforms</span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-2 px-3 py-1.5 bg-page-background rounded-full text-xs font-medium">
                <AppleIcon className="size-4 text-black" />
                <span>Apple Music</span>
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 bg-page-background rounded-full text-xs font-medium">
                <SpotifyIcon className="size-4 text-[#1DB954]" />
                <span>Spotify</span>
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 bg-page-background rounded-full text-xs font-medium">
                <YoutubeIcon className="size-4 text-[#FF0000]" />
                <span>YouTube Music</span>
              </span>
            </div>
          </div>
        </div>

        {/* Column 2: Track List */}
        <div className="bg-white rounded-30 p-6 flex flex-col gap-4 min-h-125">
          <h2 className="font-medium text-border-default-secondary">Tracks</h2>
          <div className="grow relative overflow-auto pr-2">
            <ul className="flex flex-col gap-4 overflow-auto absolute inset-0">
              {DUMMY_TRACKS.map((track) => (
                <li
                  key={track.index}
                  className="flex max-lg:flex-wrap items-center justify-between gap-4 px-5 py-3 rounded-20 hover:bg-page-background transition-colors group"
                >
                  <span className="size-10 font-medium text-border-default-secondary text-center bg-page-background rounded-full flex items-center justify-center flex-none">
                    {track.index}
                  </span>
                  <div className="size-10.5 bg-brand-purple/12 rounded-full flex items-center justify-center flex-none">
                    <Icon name="music" size={26.25} className="text-brand-purple" />
                  </div>
                  <div className="flex flex-col break-all">
                    <span className="font-medium break-after-all">{track.name}</span>
                    <span className="text-[11px] text-border-default-secondary">
                      {track.status}
                    </span>
                  </div>
                  <Link
                    href="/"
                    className="px-5 py-3 border border-black hover:bg-white rounded-full transition-colors whitespace-nowrap"
                  >
                    Edit Track
                  </Link>
                  <button className="rounded-full group/btn cursor-pointer">
                    <Icon
                      name="play"
                      size={16}
                      className="text-brand-orange group-hover/btn:scale-110 transition-transform"
                    />
                  </button>
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
              <span className="font-medium">$2,384.00</span>
              <Icon name="arrow-up" size={16} className="text-positive-tertiary" />
            </div>
          </header>
          <div className="grow relative overflow-auto pr-2">
            <ul className="flex flex-col gap-4 overflow-auto absolute inset-0">
              {DUMMY_EARNINGS.map((earning, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4 p-4 rounded-xl hover:bg-page-background/50 transition-colors"
                >
                  <div className="size-8 bg-brand-purple/12 rounded-full flex items-center justify-center text-brand-purple flex-none">
                    <Icon name="dollar" size={20} />
                  </div>
                  <div className="flex flex-col grow gap-0.5">
                    <span className="text-sm font-medium text-default truncate">
                      {earning.platform}
                    </span>
                    <span className="text-xs text-grey">{earning.detail}</span>
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
