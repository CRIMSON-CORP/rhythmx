import { api } from "@/lib/api";
import ChoosePlatforms from "./choose-platforms";
import { API_ROUTES } from "@/lib/api-routes";

async function ChoosePlatformPage({ params }: { params: Promise<{ release_id: string }> }) {
  const { release_id } = await params;
  const [{ platforms }, { release }] = await Promise.all([
    api.get<{ platforms: Platform[] }>(API_ROUTES.META.PLATFORMS),
    api.get<{ release: ReleaseDetail }>(API_ROUTES.RELEASES.RELEASE(release_id)),
  ]);
  const selectedPlatformIds = release.platforms.map((platform) => platform.platform_id);
  return (
    <ChoosePlatforms
      release_id={release_id}
      releasePlatforms={platforms}
      initialSelectedPlatformIds={selectedPlatformIds}
    />
  );
}

export default ChoosePlatformPage;
