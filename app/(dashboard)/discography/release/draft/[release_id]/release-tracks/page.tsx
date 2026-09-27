import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import ReleaseTracks from "./release-tracks";

async function ReleaseTracksPage({ params }: { params: Promise<{ release_id: string }> }) {
  const { release_id } = await params;
  const [{ tracks }, { genres }, { languages }, contributorsData] = await Promise.all([
    api.get<{ tracks: ReleaseTrack[] }>(API_ROUTES.RELEASES.TRACKS.LIST(release_id)),
    api.get<GenresResponse>(API_ROUTES.META.GENRES),
    api.get<LanguagesResponse>(API_ROUTES.META.LANGUAGES),
    api.get<ContributorsResponse>(API_ROUTES.META.CONTRIBUTORS),
  ]);

  return (
    <ReleaseTracks
      releaseReference={release_id}
      tracks={tracks || []}
      meta={{
        genres: genres || [],
        languages: languages || [],
        contributors: contributorsData?.groups || [],
      }}
    />
  );
}

export default ReleaseTracksPage;
