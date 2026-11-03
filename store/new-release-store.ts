import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { goeyToast } from "goey-toast";
import { AlignLeft, Calendar, Disc, DollarSign, Info, Layers, ShoppingBag } from "lucide-react";
import { create } from "zustand";

export interface ReleaseDetailsForm {
  title: string;
  release_description: string;
  type: string;
  genre: string;
  sub_genre: string;
  version: string;
  producers: string;
  record_label: string;
  copyright_holder: string;
  production_copyright_year: string;
  copyright_year: string;
  language: string;
  upc: string;
  original_release_date: string;
  artwork: File | null;
  main_artists: Artist[];
  featured_artists: Artist[];
  producer_credits: Artist[];
  tracks: Track[];
  platforms: string[];
  own_full_royalty?: boolean;
  release_date?: Date;
  release_time?: string;
  xpress_release?: boolean;
  artwork_url?: string;
}

interface NewReleaseStoreProps {
  currentStep: number;
  form: ReleaseDetailsForm;
  setForm: (form: Partial<ReleaseDetailsForm>) => void;

  isLoading: boolean;
  release_id: string;

  next: () => void;
  previous: () => void;
  setStep: (step: number) => void;

  sendDraftRelease: (release_id?: string) => Promise<void>;
  getReleaseDataFromState: () => Record<string, string>;
}

export const newReleaseStoreTitles = [
  {
    title: "Release Details (Single)",
    subtitle: "Add all the necessary information for this release",
    tab_title: "Release Details",
    icon: Info,
    path: "",
  },
  {
    title: "Release Tracks",
    subtitle: "Add release tracks and track meta data",
    tab_title: "Tracks",
    icon: Disc,
    path: "release-tracks",
  },
  {
    title: "Choose platforms",
    subtitle: "Select the platforms you would like to distribute to.",
    tab_title: "Platforms",
    icon: Layers,
    path: "choose-platforms",
  },
  {
    title: "Split Royalty",
    subtitle: "Split revenue with collaborators and partners",
    tab_title: "Split Royalty",
    icon: DollarSign,
    path: "split-royalty",
  },
  {
    title: "Preorder Date",
    subtitle: "Set your preorder start date and build early anticipation",
    tab_title: "Pre-order",
    icon: ShoppingBag,
    path: "pre-order",
  },
  {
    title: "Release Date",
    subtitle: "Set your release date",
    tab_title: "Release Date",
    icon: Calendar,
    path: "release-date",
  },
  {
    title: "Review",
    subtitle:
      "Publish your release, fill all the necessary information, upload tracks, album art cover and more.",
    tab_title: "Review & Submit",
    icon: AlignLeft,
    path: "release-summary",
  },
];

const useNewReleaseStore = create<NewReleaseStoreProps>((set, get) => ({
  currentStep: 0,
  isLoading: false,
  release_id: "",
  form: {
    title: "",
    release_description: "",
    type: "",
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
    main_artists: [],
    featured_artists: [],
    producer_credits: [],
    tracks: [],
    platforms: [],
    own_full_royalty: false,
    release_date: new Date("2025-04-20"),
    release_time: "09:41 AM",
    xpress_release: false,
  },
  setForm: (updatedFields) =>
    set((state) => ({
      form: { ...state.form, ...updatedFields },
    })),

  next: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  previous: () => set((state) => ({ currentStep: state.currentStep - 1 })),
  setStep: (step) => set({ currentStep: step }),
  setRealeseId: (release_id: string) => {
    set({ release_id });
  },
  getReleaseDataFromState() {
    const form = get().form;
    const payload = {
      title: form.title,
      description: form.release_description,
      type: form.type,
      primary_genre: form.genre,
      secondary_genre: form.sub_genre,
      version: form.version,
      producer: form.producers,
      label: form.record_label,
      copyright_holder: form.copyright_holder,
      production_copyright_year: form.production_copyright_year,
      copyright_year: form.copyright_year,
      language: form.language,
      barcode: form.upc,
      original_release_date: form.original_release_date,
    };
    return payload;
  },

  sendDraftRelease: async () => {
    const { release_id } = get();
    set({ isLoading: true });
    const upload_Relase_toast_id = "upload_release";
    const upload_artwork_toast_id = "upload_artwork";
    try {
      goeyToast.info(release_id ? "Updating Release.." : "Creating Release...", {
        id: upload_Relase_toast_id,
      });
      const data = await api[release_id ? "patch" : "post"]<{ reference: string }>(
        release_id ? API_ROUTES.RELEASES.DRAFT.DRAFT(release_id) : API_ROUTES.RELEASES.DRAFT.INDEX,
        get().getReleaseDataFromState(),
      );
      goeyToast.dismiss(upload_Relase_toast_id);
      goeyToast.success(release_id ? "Relase Updated" : "Release Created");
      set({ release_id: data.reference });
      const { artwork } = get().form;
      const _release_id = data.reference || release_id;
      if (artwork && _release_id) {
        try {
          goeyToast.info("Uploading Artwork...", { id: upload_artwork_toast_id });
          const formData = new FormData();
          formData.set("artwork", artwork);
          await api.postFormData({
            url: API_ROUTES.RELEASES.DRAFT.ARTWORK(_release_id),
            formData,
          });
          goeyToast.dismiss(upload_artwork_toast_id);
          goeyToast.success("Artwork Uploaded Successfully");
        } catch (error) {
          get().setForm({
            artwork: null,
            artwork_url: "",
          });
          throw new Error((error as { artwork: string }).artwork);
        }
      }
      get().next();
    } catch (error) {
      goeyToast.dismiss(upload_artwork_toast_id);
      goeyToast.dismiss(upload_Relase_toast_id);
      goeyToast.error((error as Error).message);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useNewReleaseStore;
