import Icon from "@/components/icon";
import Link from "next/link";
import { artists } from "@/data/artists";
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  CircleMinus,
  Disc,
  Music,
  Search,
  Trash2,
  X,
} from "lucide-react";

async function ArtistPage({ params }: { params: Promise<{ artist_id: string }> }) {
  const { artist_id } = await params;

  // Find current release, default to first release if not found
  const artist = artists.find((a) => a.id === artist_id);

  if (!artist) redirect("/artists");

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
              <ArrowLeft name="arrow-left" size={27} />
            </Link>
            <h1 className="font-heading text-3xl md:text-5xl font-semibold leading-[0.7]">
              Artist Profile
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 p-4 bg-white rounded-full hover:bg-page-background transition-colors cursor-pointer">
            <CircleMinus size={16} />
            <span>Disable Artist</span>
          </button>
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 p-4 bg-white rounded-full hover:bg-page-background transition-colors cursor-pointer">
                <Trash2 size={16} />
                <span>Remove Artist</span>
              </button>
            </DialogTrigger>
            <DialogContent
              showCloseButton={false}
              className="max-w-115 w-full p-8 rounded-30 bg-white"
            >
              <div className="flex flex-col gap-6 relative">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl font-semibold text-default font-heading">
                    Remove Artist
                  </DialogTitle>
                  <DialogClose className="cursor-pointer text-default hover:opacity-80">
                    <X size={20} />
                  </DialogClose>
                </div>

                {/* Body */}
                <DialogDescription className="text-default">
                  Are you sure, you want this artist to removed from your record label?
                </DialogDescription>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 mt-4">
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      className="w-fit rounded-xl px-5 py-2.5 text-sm font-semibold border-default-default/10 text-default hover:bg-page-background cursor-pointer"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button className="w-fit rounded-xl px-5 py-2.5 text-sm font-semibold bg-[#E52E2E] hover:bg-[#E52E2E]/90 text-white border-0 cursor-pointer">
                    Yes, Remove
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>
      <section>
        <div className="container">
          <div className="flex gap-8 flex-wrap">
            <div className="p-6 bg-white flex flex-col items-start gap-6 rounded-30 flex-2">
              <div className="flex items-center self-stretch flex-wrap gap-6">
                <Image
                  src={artist.image}
                  alt={artist.name}
                  width={168}
                  height={168}
                  className="rounded-full"
                />
                <div className="flex grow justify-center items-center divide-x divide-default-default">
                  <div className="flex flex-col p-5 w-full max-w-63">
                    <p>20 February 1996</p>
                    <p>Born</p>
                  </div>
                  <div className="flex flex-col p-5 w-full max-w-63">
                    <p>Pop</p>
                    <p>Genre</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="font-semibold text-2xl font-heading">{artist.name}</h1>
                <p className="font-medium text-border-default-secondary">
                  &quot;You have to be really open, I think,&quot; Mabel tells Apple Music about the
                  personal nature of her songwriting. &quot;All the songs people really relate to,
                  that&apos;s because you&apos;re being human and saying, &apos;Look-this is the
                  real!&quot;&quot; Born in 1996 in Spain, Mabel Alabama-Pearl McVey-daughter of
                  Swedish artist Neneh Cherry and English producer Cameron McVey-has a knack for
                  taking the intimate and relatable and turning it into spectacular, pumped-up
                </p>
              </div>
              <button className="px-6 py-5 bg-brand-orange rounded-full text-white flex items-center gap-2">
                <span>Edit Profile</span>
                <ArrowRight size={16} />
              </button>
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
                <Button className="w-fit rounded-full">
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
              id={release.id}
              name={release.name}
              href={release.href}
              imageSrc={release.imageSrc}
              sources={release.sources}
              engagements={release.engagements}
              title={release.title}
              type={release.type}
            />
          ))}
        </ReleaseCards>
      </section>
    </div>
  );
}

export default ArtistPage;
