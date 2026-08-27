import { create } from "zustand";
import z from "zod";

export type CreateArtistView =
  | "new-artist"
  | "new-artist-details"
  | "new-artist-connect"
  | "new-artist-success";

export const createArtistSchema = z.object({
  avatar: z.string().optional(),
  avatar_file: z.custom<File | null>().nullable().optional(),
  legal_name: z.string().min(3, "Legal name must be at least 3 characters"),
  stage_name: z.string().min(3, "Stage name must be at least 3 characters"),
  age: z.string().min(1, "Age is required"),
  gender: z.string().min(1, "Please select a gender"),
  location: z.string().min(1, "Location is required"),
  genre: z.string().min(1, "Genre is required"),
  bio: z.string().optional(),
  spotify_id: z.string().optional(),
  applu_music_id: z.string().optional(),
});

export type CreateArtistFormData = z.infer<typeof createArtistSchema>;

// Step-specific schemas for multi-step dialog validation
export const newArtistBasicInfoSchema = createArtistSchema.pick({
  avatar: true,
  avatar_file: true,
  legal_name: true,
  stage_name: true,
  age: true,
  gender: true,
});

export const newArtistDetailsSchema = createArtistSchema.pick({
  location: true,
  genre: true,
  bio: true,
});

export const newArtistConnectSchema = createArtistSchema.pick({
  spotify_id: true,
  applu_music_id: true,
});

export const viewSchemaMap: Record<CreateArtistView, z.ZodSchema | null> = {
  "new-artist": newArtistBasicInfoSchema,
  "new-artist-details": newArtistDetailsSchema,
  "new-artist-connect": newArtistConnectSchema,
  "new-artist-success": null,
};

interface CreateArtistStore {
  view: CreateArtistView;
  setView: (view: CreateArtistView) => boolean;
  form: {
    avatar: string;
    avatar_file: File | null;
    legal_name: string;
    stage_name: string;
    age: string;
    gender: string;
    location: string;
    genre: string;
    bio: string;
    spotify_id: string;
    applu_music_id: string;
  };
  errors: Record<string, string>;
  setForm: (form: Partial<CreateArtistStore["form"]>) => void;
  setErrors: (errors: Record<string, string>) => void;
  clearErrors: () => void;
  resetState: () => void;
}

const EMPTY_STATE: CreateArtistStore["form"] = {
  avatar: "",
  avatar_file: null,
  legal_name: "",
  stage_name: "",
  age: "",
  gender: "",
  location: "",
  genre: "",
  bio: "",
  spotify_id: "",
  applu_music_id: "",
};

const useCreateArtistStore = create<CreateArtistStore>((set, get) => ({
  view: "new-artist",
  errors: {},
  form: EMPTY_STATE,
  setView: (nextView) => {
    const { view, form } = get();
    const currentSchema = viewSchemaMap[view];
    if (currentSchema) {
      const result = currentSchema.safeParse(form);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          const path = issue.path[0];
          if (path && typeof path === "string") {
            fieldErrors[path] = issue.message;
          }
        });
        set({ errors: fieldErrors });
        return false;
      }
    }
    set({ view: nextView, errors: {} });
    return true;
  },
  setForm: (form) =>
    set((state) => ({
      form: { ...state.form, ...form },
      errors: {},
    })),
  setErrors: (errors) => set({ errors }),
  clearErrors: () => set({ errors: {} }),
  resetState: () =>
    set({
      view: "new-artist",
      form: EMPTY_STATE,
      errors: {},
    }),
}));

export default useCreateArtistStore;

