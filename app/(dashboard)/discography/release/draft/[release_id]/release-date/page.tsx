import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import ReleaseDate from "./release-date";

async function ReleaseDatePage({ params }: { params: Promise<{ release_id: string }> }) {
  const { release_id } = await params;
  const { release } = await api.get<{ release: ReleaseDetail }>(
    `${API_ROUTES.RELEASES.MY}/${release_id}`,
  );

  return (
    <ReleaseDate
      releaseId={release_id}
      initialReleaseDate={release?.release_date}
      initialReleaseTime={release?.release_time}
      initialFastTrack={release?.is_fast_track}
    />
  );
}

export default ReleaseDatePage;
