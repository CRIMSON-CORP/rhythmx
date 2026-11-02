import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import ReleaseSummary, { FormattedReleaseTrack } from "./release-summary";

function formatContributorList(names: (string | undefined | null)[]): string | null {
  const cleanNames = Array.from(new Set(names.filter((n): n is string => Boolean(n && n.trim()))));
  if (cleanNames.length === 0) return null;
  if (cleanNames.length === 1) return cleanNames[0];
  if (cleanNames.length === 2) return `${cleanNames[0]} & ${cleanNames[1]}`;
  return `${cleanNames[0]} & ${cleanNames.length - 1} others`;
}

async function ReleaseSummaryPage({ params }: { params: Promise<{ release_id: string }> }) {
  const { release_id } = await params;

  const [releaseRes, tracksRes, { platforms }, { genres }, { languages }] = await Promise.all([
    api.get<{ release: ReleaseDetail }>(API_ROUTES.RELEASES.RELEASE(release_id)),
    api.get<{ tracks: ReleaseTrack[]; owns_full_royalty: boolean }>(
      API_ROUTES.RELEASES.DRAFT.TRACKS.INDEX(release_id),
    ),
    api.get<{ platforms: Platform[] }>(API_ROUTES.META.PLATFORMS),
    api.get<GenresResponse>(API_ROUTES.META.GENRES),
    api.get<LanguagesResponse>(API_ROUTES.META.LANGUAGES),
  ]);

  const release = releaseRes.release;
  const tracks = tracksRes?.tracks || [];
  const ownsFullRoyalty =
    tracksRes?.owns_full_royalty ?? release.owns_full_royalty ?? false;

  // Compute resolved genre
  const primaryGenre = genres.find((g) => g.slug === release.genre)?.name || release.genre || "";
  const secondaryGenre =
    genres
      .find((g) => g.slug === release.genre)
      ?.sub_genres?.find((g) => g.slug === release.sub_genre)?.name ||
    release.sub_genre ||
    "";
  const resolvedGenre = [primaryGenre, secondaryGenre].filter(Boolean).join(", ");

  // Compute resolved language
  const resolvedLanguage =
    languages.find((l) => l.slug === release.language)?.name || release.language || "English";

  // Compute resolved producers across tracks (using 1 / 2 / 3+ others format)
  const allTrackProducers = tracks.flatMap((track) =>
    (track.people?.engineer || [])
      .map((e) => e.stage_name || e.name || e.display_name)
      .filter(Boolean),
  );
  const resolvedProducers = formatContributorList(allTrackProducers) || "—";

  // Fallback main artists from release level
  const fallbackMainArtistNames = (release.artists || [])
    .filter((a) => a.role === "main" || !a.role)
    .map((a) => a.name)
    .filter(Boolean);

  // Compute formatted credits per track on the server
  const formattedTracks: FormattedReleaseTrack[] = tracks.map((track) => {
    // 1. Main Primary Artist
    const mainArtists = (track.people?.main || [])
      .map((m) => m.stage_name || m.name || m.display_name)
      .filter(Boolean);
    const mainArtistNames =
      formatContributorList(mainArtists) ||
      formatContributorList(fallbackMainArtistNames) ||
      "—";

    // 2. Key Artist
    const keyArtists = (track.people?.key_artist || [])
      .map((k) => k.stage_name || k.name || k.display_name)
      .filter(Boolean);
    const keyArtistNames = formatContributorList(keyArtists);

    // 3. Producer & Engineer Credits
    const engineerCredits = (track.people?.engineer || [])
      .map((e) => e.stage_name || e.name || e.display_name)
      .filter(Boolean);
    const engineerText = formatContributorList(engineerCredits);

    // 4. Writers & Publishers
    const writerCredits = (track.people?.writer || [])
      .map((w) => w.stage_name || w.name || w.display_name)
      .filter(Boolean);
    const writerText = formatContributorList(writerCredits);

    return {
      ...track,
      mainArtistNames,
      keyArtistNames,
      engineerText,
      writerText,
    };
  });

  // Compute resolved platforms with logos
  const resolvedPlatforms = (release.platforms || []).map((p) => {
    const match = platforms.find((meta) => meta.id === p.platform_id);
    return {
      id: p.platform_id,
      name: p.name || match?.name || "Platform",
      logo_url: p.logo_url || match?.logo_url || null,
    };
  });

  return (
    <ReleaseSummary
      releaseId={release_id}
      release={release}
      tracks={formattedTracks}
      ownsFullRoyalty={ownsFullRoyalty}
      resolvedGenre={resolvedGenre}
      resolvedLanguage={resolvedLanguage}
      resolvedProducers={resolvedProducers}
      platforms={resolvedPlatforms}
    />
  );
}

export default ReleaseSummaryPage;
