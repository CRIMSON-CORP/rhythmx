import AccountType from "@/app/onboarding/steps/account-type";
import LabelName from "@/app/onboarding/steps/label-name";
import Logo from "@/app/onboarding/steps/logo";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
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
  submitForm: () => Promise<void>;
  isSubmitting: boolean;
}

const useOnBoardingStore = create<OnBoardingStore>((set, get) => ({
  currentStep: 0,
  form: {
    selected_account: "",
    name: "",
    country: "",
    avatar: null,
  },
  isSubmitting: false,
  next: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  previous: () => set((state) => ({ currentStep: state.currentStep - 1 })),
  setForm: (form) => set((state) => ({ form: { ...state.form, ...form } })),
  submitForm: async () => {
    const { form } = get();
    set({ isSubmitting: true });

    try {
      // 1. Map selected_account to backend account_type string
      let accountTypeStr = "artist";
      if (form.selected_account === "record-label") {
        accountTypeStr = "label";
      } else if (form.selected_account === "contributor") {
        accountTypeStr = "collaborator";
      } else if (form.selected_account === "artist") {
        accountTypeStr = "artist";
      }

      // 2. Determine details endpoint and payload structure
      let detailsEndpoint = API_ROUTES.ONBOARDING.ACCOUNT_TYPE.ARTIST.INDEX;
      let detailsPayload: Record<string, unknown> = {
        artist_name: form.name,
        country: form.country,
      };

      if (form.selected_account === "record-label") {
        detailsEndpoint = API_ROUTES.ONBOARDING.ACCOUNT_TYPE.LABEL.INDEX;
        detailsPayload = {
          label_name: form.name,
          region: form.country,
        };
      } else if (form.selected_account === "contributor") {
        detailsEndpoint = API_ROUTES.ONBOARDING.ACCOUNT_TYPE.COLLABORATOR.INDEX;
        detailsPayload = {
          artist_name: form.name,
          country: form.country,
        };
      }

      // 3. Determine photo endpoint
      let photoEndpoint = API_ROUTES.ONBOARDING.ACCOUNT_TYPE.ARTIST.PHOTO;
      if (form.selected_account === "record-label") {
        photoEndpoint = API_ROUTES.ONBOARDING.ACCOUNT_TYPE.LABEL.PHOTO;
      } else if (form.selected_account === "contributor") {
        photoEndpoint = API_ROUTES.ONBOARDING.ACCOUNT_TYPE.COLLABORATOR.PHOTO;
      }

      await api.post(API_ROUTES.ONBOARDING.ACCOUNT_TYPE.INDEX, {
        account_type: accountTypeStr,
      });

      await api.patch(detailsEndpoint, detailsPayload);

      // Photo upload request (if photo file selected)
      if (form.avatar) {
        const photoFormData = new FormData();
        photoFormData.append("photo", form.avatar);
        await api.postFormData({
          url: photoEndpoint,
          formData: photoFormData,
        });
      }

      // On success, redirect to dashboard /
      window.location.href = `/terms-and-agreement/${form.selected_account}`;
    } catch (error: unknown) {
      console.error("Onboarding submission error:", error);
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },
}));

export default useOnBoardingStore;
