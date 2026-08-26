import { api } from "@/lib/api";
import ChoosePlatforms from "./choose-platforms";
import { API_ROUTES } from "@/lib/api-routes";

async function ChoosePlatformPage({ params }: { params: Promise<{ release_id: string }> }) {
  const { release_id } = await params;
  const { platforms } = await api.get<{ platforms: Platform[] }>(API_ROUTES.META.PLATFORMS);
  return <ChoosePlatforms release_id={release_id} releasePlatforms={platforms} />;
}

export default ChoosePlatformPage;
