import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import PreOrderDate from "./pre-order";

async function PreOrderDatePage({ params }: { params: Promise<{ release_id: string }> }) {
  const { release_id } = await params;
  const { release } = await api.get<{ release: ReleaseDetail }>(
    `${API_ROUTES.RELEASES.MY}/${release_id}`,
  );

  return (
    <PreOrderDate
      releaseId={release_id}
      initialPreorderDate={release?.preorder_date}
      initialPreorderTime={release?.preorder_time}
    />
  );
}

export default PreOrderDatePage;
