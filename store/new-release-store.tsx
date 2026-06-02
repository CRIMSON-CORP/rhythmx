import ReleaseDetalsPage from "@/app/(dashboard)/discography/single/new/steps/release-detals";
import { create } from "zustand";

export interface ReleaseDetailsForm {
  release_title: string;
  release_description: string;
  primary_genre: string;
  secondary_genre: string;
  version_title: string;
  producers: string;
  record_label: string;
  copyright_holder: string;
  production_copyright_year: string;
  copyright_year: string;
  language: string;
  barcode: string;
  original_release_date: string;
  artwork: File | null;
}

interface NewReleaseStoreProps {
  currentStep: number;
  form: ReleaseDetailsForm;
  setForm: (form: Partial<ReleaseDetailsForm>) => void;

  next: () => void;
  previous: () => void;
}

export const newReleaseStoreTitles = [
  {
    title: "Release Details (Single)",
    subtitle: "Add all the necessary information for this release",
    tab_title: "Release Details",
    icon: "info",
    Componenet: ReleaseDetalsPage,
  },
  {
    title: "Add Artist",
    subtitle: "Assigned and manage the release artist",
    tab_title: "Artist",
    icon: "star",
  },
  {
    title: "Release Tracks",
    subtitle: "Add release tracks and track meta data",
    tab_title: "Tracks",
    icon: "disc",
  },
  {
    title: "Choose platforms",
    subtitle: "Select the platforms you would like to distribute to.",
    tab_title: "Platforms",
    icon: "layers",
  },
  {
    title: "Split Royalty",
    subtitle: "Split revenue with collaborators and partners",
    tab_title: "Split Royalty",
    icon: "dollar",
  },
  {
    title: "Release Date",
    subtitle: "Set your release date",
    tab_title: "Release Date",
    icon: "calendar",
  },
  {
    title: "Review",
    subtitle:
      "Publish your release, fill all the necessary information, upload tracks, album art cover and more.",
    tab_title: "Review & Submit",
    icon: "align-left",
  },
];

const useNewReleaseStore = create<NewReleaseStoreProps>((set) => ({
  currentStep: 0,
  form: {
    release_title: "",
    release_description: "",
    primary_genre: "",
    secondary_genre: "",
    version_title: "Original Version",
    producers: "",
    record_label: "",
    copyright_holder: "",
    production_copyright_year: "2025",
    copyright_year: "2025",
    language: "",
    barcode: "",
    original_release_date: "",
    artwork: null,
  },
  setForm: (updatedFields) =>
    set((state) => ({
      form: { ...state.form, ...updatedFields },
    })),

  next: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  previous: () => set((state) => ({ currentStep: state.currentStep - 1 })),
}));

export default useNewReleaseStore;
