import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import AddArtistPageComponent from "./add-artists";

async function AddArtistPage({ params }: { params: Promise<{ release_id: string }> }) {
  const { release_id } = await params;
  const { main, featured } = await api.get<{
    main: ArtistRelease[];
    featured: ArtistRelease[];
  }>(API_ROUTES.RELEASES.ARTISTS(release_id));
  return <AddArtistPageComponent main={main} featured={featured} producer_credits={[]} />;
}

export default AddArtistPage;
