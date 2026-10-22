import Image from "next/image";
import { formatCount } from "@/lib/count-formatter";
import Link from "next/link";
import { Eye, Play } from "lucide-react";

function ReleaseCard({
  reference,
  cover_url,
  title,
  total_streams,
  type,
  platforms = [],
}: Pick<Release, "reference" | "cover_url" | "title" | "type" | "total_streams" | "platforms">) {
  const shownPlatforms = platforms.slice(0, 2);
  const hasMorePlatforms = platforms.length > 2;
  return (
    <Link
      href={`/discography/release/${reference}`}
      className="w-full aspect-square rounded-30 overflow-hidden relative flex flex-col justify-between gap-5 text-white isolate snap-center bg-black/5"
    >
      {cover_url && (
        <Image src={cover_url} alt={title} fill className="-z-10 object-cover" loading="lazy" />
      )}
      <header className="flex justify-end p-4">
        <div className="flex items-center gap-0.5 px-2.5 py-1 rounded-full bg-[#F2F2F7]/10 backdrop-blur-lg">
          {type === "album" ? <Play size={16} /> : <Eye size={16} />}
          <span className="font-heading text-xs font-medium">{formatCount(total_streams)}</span>
        </div>
      </header>
      {type === "album" ? (
        <footer className="flex flex-col gap-4 p-4 relative isolate">
          <div className="absolute inset-0 bg-black/1 backdrop-blur-lg -z-10 mask-[linear-gradient(to_bottom,transparent,black_50%)]"></div>
          <div className="flex flex-col gap-2.5">
            <span className="text-2xl font-semibold font-heading">{title}</span>
            <span className="">{title}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium font-heading">
            {shownPlatforms.map((platform, index) => (
              <span
                key={index}
                className="px-2.5 py-1 rounded-full bg-[#F2F2F7]/10 backdrop-blur-lg"
              >
                {platform}
              </span>
            ))}
            {hasMorePlatforms && (
              <span className="px-2.5 py-1 rounded-full bg-[#F2F2F7]/10 backdrop-blur-lg">
                +{platforms.length - 2}
              </span>
            )}
          </div>
        </footer>
      ) : (
        <footer className="flex flex-col gap-4 p-4 relative isolate">
          <div className="absolute inset-0 bg-black/1 backdrop-blur-lg -z-10 mask-[linear-gradient(to_bottom,transparent,black_50%)]"></div>
          <div className="flex flex-col gap-2.5">
            <span className="text-2xl font-semibold font-heading">{title}</span>
            <div className="flex items-center justify-between">
              <span className="capitalize">{type}</span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-black">
                See Stats
              </span>
            </div>
          </div>
        </footer>
      )}
    </Link>
  );
}

export default ReleaseCard;
