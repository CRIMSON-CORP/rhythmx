import AddArtistPage from "@/app/(dashboard)/discography/single/new/steps/add-artist";
import ChoosePlatform from "@/app/(dashboard)/discography/single/new/steps/choose-platform";
import ReleaseDate from "@/app/(dashboard)/discography/single/new/steps/release-date";
import ReleaseDetalsPage from "@/app/(dashboard)/discography/single/new/steps/release-detals";
import ReleaseSummary from "@/app/(dashboard)/discography/single/new/steps/release-summary";
import ReleaseTracks from "@/app/(dashboard)/discography/single/new/steps/release-tracks";
import SplitRoyalty from "@/app/(dashboard)/discography/single/new/steps/split-royalty";
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

  next: () => void;
  previous: () => void;
  setStep: (step: number) => void;
}

export const newReleaseStoreTitles = [
  {
    title: "Release Details (Single)",
    subtitle: "Add all the necessary information for this release",
    tab_title: "Release Details",
    icon: "info",
    Component: ReleaseDetalsPage,
  },
  {
    title: "Add Artist",
    subtitle: "Assigned and manage the release artist",
    tab_title: "Artist",
    icon: "star",
    Component: AddArtistPage,
  },
  {
    title: "Release Tracks",
    subtitle: "Add release tracks and track meta data",
    tab_title: "Tracks",
    icon: "disc",
    Component: ReleaseTracks,
  },
  {
    title: "Choose platforms",
    subtitle: "Select the platforms you would like to distribute to.",
    tab_title: "Platforms",
    icon: "layers",
    Component: ChoosePlatform,
  },
  {
    title: "Split Royalty",
    subtitle: "Split revenue with collaborators and partners",
    tab_title: "Split Royalty",
    icon: "dollar",
    Component: SplitRoyalty,
  },
  {
    title: "Release Date",
    subtitle: "Set your release date",
    tab_title: "Release Date",
    icon: "calendar",
    Component: ReleaseDate,
  },
  {
    title: "Review",
    subtitle:
      "Publish your release, fill all the necessary information, upload tracks, album art cover and more.",
    tab_title: "Review & Submit",
    icon: "align-left",
    Component: ReleaseSummary,
  },
];

const useNewReleaseStore = create<NewReleaseStoreProps>((set) => ({
  currentStep: 2,
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
}));

export default useNewReleaseStore;
