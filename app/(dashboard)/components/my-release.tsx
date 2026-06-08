import Icon from "@/components/icon";
import ReleaseCards from "@/components/realease-cards";
import ReleaseCard from "@/components/release-card";
import { releases } from "@/data/releases";
import Link from "next/link";

function MyRelease() {
  return (
    <section className="flex flex-col gap-8">
      <header className="container flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 text-default-tertiary">
          <Icon name="disc" size={24} />
          <h2 className="font-medium">My Release</h2>
        </div>
        <Link href="/discography" className="flex items-center gap-1">
          <span>See all releases</span>
          <Icon name="arrow-up-right" size={16} />
        </Link>
      </header>
      <ReleaseCards scrollable>
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
  );
}

export default MyRelease;
