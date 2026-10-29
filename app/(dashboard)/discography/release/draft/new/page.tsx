import ReleaseDetalsPageComponent from "../release-details";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";

async function NewDraftReleasePage({
  searchParams,
}: {
  searchParams: Promise<{ release_type: string }>;
}) {
  const { release_type } = await searchParams;
  const [{ genres }, { languages }] = await Promise.all([
    api.get<GenresResponse>(API_ROUTES.META.GENRES),
    api.get<LanguagesResponse>(API_ROUTES.META.LANGUAGES),
  ]);

  return (
    <ReleaseDetalsPageComponent
      initialData={{
        reference: "",
        title: "",
        release_description: "",
        type: release_type ?? "",
        genre: "",
        sub_genre: "",
        version: "",
        producers: "",
        record_label: "",
        copyright_holder: "",
        production_copyright_year: "",
        copyright_year: "",
        language: "",
        upc: "",
        original_release_date: "",
        artwork: null,
        cover_url: "",
      }}
      meta={{ genres, languages }}
    />
  );
}

export default NewDraftReleasePage;
