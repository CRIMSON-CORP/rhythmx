import { ArrowUpRight, Disc, Search } from "lucide-react";
import Icon from "@/components/icon";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InvitesInvitesTrigger, PendingInvitesTrigger } from "./invites";
import Artist from "@/components/artist";
import { artists } from "@/data/artists";
import { ArrowUp, ArrowUpRight, Disc, List, Music, Search, Star } from "lucide-react";

function ArtistsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="container flex flex-wrap items-center justify-between gap-6">
        <h1 className="font-heading text-[32px] leading-tight font-semibold flex items-center gap-2.5 text-default">
          <span>Artists</span>
          <div className="bg-white flex items-center gap-2.5 px-5 py-4 rounded-full font-sans font-medium max-sm:hidden">
            <span className="text-sm text-border-default-secondary">All Artist</span>
            <span className="text-base">43</span>
          </div>
        </h1>
        <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
          <PendingInvitesTrigger />
          <InvitesInvitesTrigger />
        </div>
      </div>
      <section className="flex flex-col gap-8">
        <header className="container flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 text-default-tertiary">
            <Star size={24} />
            <h2 className="font-medium">Recently Added</h2>
          </div>
          <Link href="/" className="flex items-center gap-1 text-xs">
            <span>See Trends & Analytics</span>
            <ArrowUpRight size={16} />
          </Link>
        </header>
        <div className="container">
          <div className="bg-white rounded-30 p-3 md:p-8 grid grid-cols-[repeat(auto-fill,minmax(min(168px,100%),1fr))] gap-8">
            {artists.slice(0, 10).map((artist) => (
              <Artist
                id={artist.id}
                key={artist.id}
                image={artist.image}
                name={artist.name}
                location={artist.location}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-8 pt-8 pb-4">
        <header className="container flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-medium whitespace-nowrap">All Artists</h2>
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
            <Select defaultValue="recent">
              <SelectTrigger className="bg-white rounded-full flex px-4 py-3 items-center">
                <span>Artist Type:</span>
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
            <Select defaultValue="any">
              <SelectTrigger className="bg-white rounded-full flex px-4 py-3 items-center">
                <span>Location:</span>
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
            <div className="flex items-center px-4 py-3 gap-2 bg-white rounded-full">
              <button>
                <Icon name="circles-four" size={18} />
              </button>
              <span className="w-px h-4 bg-default-default/20" />
              <button>
                <List size={18} />
              </button>
            </div>
          </div>
        </header>
        <div className="container">
          <div className="bg-white rounded-30 p-3 md:p-8 grid grid-cols-[repeat(auto-fill,minmax(min(168px,100%),1fr))] gap-8">
            {artists.map((artist) => (
              <Artist
                id={artist.id}
                key={artist.id}
                image={artist.image}
                name={artist.name}
                location={artist.location}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ArtistsPage;
