import { Suspense } from "react";
import NewTeam from "./new-team";
import AllTeamSection, { AllTeamSkeleton } from "./all-team-section";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";

export default async function TeamPage() {
  let initialTeam: TeamMember[] = [];
  let initialMeta: PaginationMeta | undefined;

  try {
    const res = await api.get<LabelTeamResponse>(`${API_ROUTES.LABEL.TEAM.INDEX}?page=1&limit=20`);
    if (res?.team) {
      initialTeam = res.team;
      initialMeta = res.meta?.pagination;
    }
  } catch (error) {
    console.error("Failed to fetch initial team on server:", error);
  }

  const totalCount = initialMeta?.total ?? initialTeam.length;
  const initialHasMore = initialMeta?.has_next ?? initialTeam.length >= 20;

  return (
    <div className="flex flex-col gap-6 h-full overflow-auto">
      <div className="container flex flex-wrap items-center justify-between gap-6">
        <h1 className="font-heading text-3xl md:text-5xl leading-tight font-semibold flex items-center gap-2.5 text-default">
          <span>Team</span>
          <div className="bg-white flex items-center gap-2.5 px-5 py-4 rounded-full font-sans font-medium max-sm:hidden">
            <span className="text-sm text-border-default-secondary">Total Team</span>
            <span className="text-base">{totalCount}</span>
          </div>
        </h1>
        <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
          <NewTeam />
        </div>
      </div>

      <Suspense fallback={<AllTeamSkeleton />}>
        <AllTeamSection initialTeam={initialTeam} initialHasMore={initialHasMore} />
      </Suspense>
    </div>
  );
}
