import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import SplitRoyalty from "./split-royalty";

async function SplitRoyaltyPage({ params }: { params: Promise<{ release_id: string }> }) {
  const { release_id } = await params;
  const [releaseRes, tracksRes, { genres }] = await Promise.all([
    api.get<{ release: ReleaseDetail }>(`${API_ROUTES.RELEASES.MY}/${release_id}`),
    api.get<{ tracks: ReleaseTrack[]; owns_full_royalty: boolean }>(
      API_ROUTES.RELEASES.TRACKS.LIST(release_id),
    ),
    api.get<GenresResponse>(API_ROUTES.META.GENRES),
  ]);

  const primaryGenre = genres.find((g) => g.slug === releaseRes.release.genre)?.name || "";
  const secondaryGenre =
    genres
      .find((g) => g.slug === releaseRes.release.genre)
      ?.sub_genres?.find((g) => g.slug === releaseRes.release.sub_genre)?.name || "";

  const genreList = [primaryGenre, secondaryGenre].filter(Boolean).join(", ");

  return (
    <SplitRoyalty
      releaseId={release_id}
      releaseOwnsFullRoyalty={tracksRes?.owns_full_royalty}
      releaseArtworkUrl={releaseRes?.release.cover_url}
      releaseTitle={releaseRes.release.title}
      releaseGenre={genreList}
      tracks={tracksRes?.tracks || []}
    />
  );
}

export default SplitRoyaltyPage;
