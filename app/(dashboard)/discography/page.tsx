import Link from "next/link";
import ReleaseCards from "@/components/realease-cards";
import { releases } from "@/data/releases";
import ReleaseCard from "@/components/release-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUp, ArrowUpRight, Disc, Music, Search } from "lucide-react";
import ReleaseStatus from "@/components/release-status";

function DisocgraphyPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="container flex flex-wrap items-center justify-between gap-6">
        <h1 className="font-heading text-3xl md:text-5xl leading-tight font-semibold flex items-center gap-2.5 text-default">
          <span>Discography</span>
          <div className="bg-white flex items-center gap-2.5 px-5 py-4 rounded-full font-sans font-medium max-sm:hidden">
            <span className="text-sm text-border-default-secondary">Total Release</span>
            <span className="text-base">10203</span>
          </div>
        </h1>
        <ReleaseStatus />
      </div>
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
          {releases.map((release) => (
            <ReleaseCard
              key={release.id}
              reference={release.id.toString()}
              title={release.name}
              type={release.type}
              total_streams={release.engagements}
              platforms={[]}
              cover_url={release.imageSrc}
            />
          ))}
        </ReleaseCards>
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
              reference={release.id.toString()}
              title={release.name}
              type={release.type}
              total_streams={release.engagements}
              cover_url={release.imageSrc}
              platforms={[]}
            />
          ))}
        </ReleaseCards>
      </section>
    </div>
  );
}

export default DisocgraphyPage;
