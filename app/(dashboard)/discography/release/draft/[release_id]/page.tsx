import ReleaseDetalsPageComponent from "../release-details";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";

async function NewDraftReleasePage({ params }: { params: Promise<{ release_id: string }> }) {
  const { release_id } = await params;
  const [{ release }, { genres }, { languages }] = await Promise.all([
    api.get<{ release: ReleaseDetail }>(API_ROUTES.RELEASES.RELEASE(release_id)),
    api.get<GenresResponse>(API_ROUTES.META.GENRES),
    api.get<LanguagesResponse>(API_ROUTES.META.LANGUAGES),
  ]);

  return (
    <ReleaseDetalsPageComponent
      initialData={{
        reference: release.reference,
        title: release.title,
        release_description: "",
        type: release.type,
        genre: release.genre,
        sub_genre: release.sub_genre,
        version: release.version,
        producers: "",
        record_label: "",
        copyright_holder: release.copyright_holder,
        production_copyright_year: "",
        copyright_year: release.copyright_year,
        language: release.language,
        upc: release.upc,
        original_release_date: release.original_release_date,
        artwork: null,
        cover_url: release.cover_url,
      }}
      meta={{ genres, languages }}
    />
  );
}

export default NewDraftReleasePage;
