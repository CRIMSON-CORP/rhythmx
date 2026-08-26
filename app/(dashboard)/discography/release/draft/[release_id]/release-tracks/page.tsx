import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import ReleaseTracks from "./release-tracks";

async function ReleaseTracksPage({ params }: { params: Promise<{ release_id: string }> }) {
  const { release_id } = await params;
  const { tracks } = await api.get<{ tracks: ReleaseTrack[] }>(
    API_ROUTES.RELEASES.TRACKS(release_id),
  );
  return <ReleaseTracks tracks={tracks} />;
}

export default ReleaseTracksPage;
