import InfiniteReleases from "@/components/infinite-releases";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { ArrowUpRight, Disc } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ReleaseCardsSkeleton } from "@/components/release-card-skeleton";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

async function MyRelease() {
  const session = await getServerSession(authOptions);
  if (session?.user.account_type === "collaborator") return;

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
      <Suspense fallback={<ReleaseCardsSkeleton count={5} scrollable />}>
        <Releases />
      </Suspense>
    </section>
  );
}

export default MyRelease;

async function Releases() {
  const { releases } = await api.get<{ releases: Release[] }>(API_ROUTES.RELEASES.INDEX);
  return <InfiniteReleases initialReleases={releases} scrollable />;
}
