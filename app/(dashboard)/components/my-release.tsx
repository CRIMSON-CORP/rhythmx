import InfiniteReleases from "@/components/infinite-releases";
import { ArrowUpRight, Disc } from "lucide-react";
import Link from "next/link";

function MyRelease({ releases }: { releases: Release[] }) {
  return (
    <section className="flex flex-col gap-8">
      <header className="container flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 text-default-tertiary">
          <Disc size={24} />
          <h2 className="font-medium">My Release</h2>
        </div>
        <Link href="/discography" className="flex items-center gap-1">
          <span>See all releases</span>
          <ArrowUpRight size={16} />
        </Link>
      </header>
      <InfiniteReleases initialReleases={releases} scrollable />
    </section>
  );
}

export default MyRelease;
