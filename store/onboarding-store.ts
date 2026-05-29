import AccountType from "@/app/onboarding/steps/account-type";
import LabelName from "@/app/onboarding/steps/label-name";
import Logo from "@/app/onboarding/steps/logo";
import { create } from "zustand";

export type AccountType = "record-label" | "artist" | "contributor" | "";

export const stepsComponent = [AccountType, LabelName, Logo];

export const accountTypeIconMap: Record<AccountType, string> = {
  "": "",
  "record-label": "record-label",
  artist: "artist",
  contributor: "contributor",
};

export const accountTypeTitle: Record<AccountType, string> = {
  "record-label": "Record Label",
  artist: "Stage",
  contributor: "Stage",
  "": "Account",
};

export const accountTypeOptionContentMap: Record<AccountType, { title: string; subtitle: string }> =
  {
    "": {
      title: "Account",
      subtitle: "",
    },
    "record-label": {
      title: "Record Label",
      subtitle: "Manage your roster of artists, and their releases",
    },
    artist: {
      title: "Artist",
      subtitle: "This helps customize your experience",
    },
    contributor: {
      title: "Contributor (Royal)",
      subtitle: "Receive royalties for your work",
    },
  };

interface OnBoardingStore {
  currentStep: number;
  next: () => void;
  previous: () => void;
  form: {
    selected_account: AccountType;
    name: string;
    country: string;
    avatar: File | null;
  };
  setForm: (form: Partial<OnBoardingStore["form"]>) => void;
}

const useOnBoardingStore = create<OnBoardingStore>((set) => ({
  currentStep: 0,
  form: {
    selected_account: "",
    name: "",
    country: "",
    avatar: null,
  },
  next: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  previous: () => set((state) => ({ currentStep: state.currentStep - 1 })),
  setForm: (form) => set((state) => ({ form: { ...state.form, ...form } })),
}));

export default useOnBoardingStore;
