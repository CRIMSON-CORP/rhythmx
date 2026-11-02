import { create } from "zustand";
import z from "zod";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { goeyToast } from "goey-toast";
import { CONSTANTS } from "@/lib/constants";

export type CreateArtistView =
  | "new-artist"
  | "new-artist-details"
  | "new-artist-connect"
  | "new-artist-success";

export interface CreatedArtistData {
  reference: string;
  first_name: string;
  last_name: string;
  stage_name: string;
  email: string;
  phone?: string | null;
  gender?: string | null;
  dob?: string | null;
  genre?: string | null;
  bio?: string | null;
  avatar_url?: string;
  portrait_url?: string | null;
  spotify_url?: string | null;
  apple_music_url?: string | null;
  spotify_linked?: boolean;
  apple_music_linked?: boolean;
  is_verified?: boolean;
  status?: string;
  access_status?: string;
  joined_at?: string;
  registered_at?: string;
}

export const isAtLeast13YearsOld = (dobString: string): boolean => {
  if (!dobString) return false;
  const parts = dobString.split("-");
  if (parts.length !== 3) return false;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const birthDate = new Date(year, month, day);
  if (isNaN(birthDate.getTime())) return false;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 13;
};

export const STEP_1_FIELDS = [
  "avatar",
  "avatar_file",
  "legal_name",
  "stage_name",
  "email",
  "dob",
  "gender",
];
export const STEP_2_FIELDS = ["country", "genre", "bio"];
export const STEP_3_FIELDS = ["spotify_url", "apple_music_url", "spotify_id", "apple_music_id"];

export const createArtistSchema = z.object({
  avatar: z.string().optional(),
  avatar_file: z.custom<File | null>().nullable().optional(),
  legal_name: z.string().min(3, "Legal name must be at least 3 characters"),
  stage_name: z.string().min(3, "Stage name must be at least 3 characters"),
  email: z.email("Invalid email"),
  dob: z
    .string()
    .min(1, "Date of Birth is required")
    .refine(isAtLeast13YearsOld, {
      message: "The artist must be at least 13 years old.",
    }),
  gender: z.string().min(1, "Please select a gender"),
  country: z.string().min(1, "Country is required"),
  genre: z.string().min(1, "Genre is required"),
  bio: z.string().optional(),
  spotify_url: z.string().optional(),
  apple_music_url: z.string().optional(),
});

export type CreateArtistFormData = z.infer<typeof createArtistSchema>;

// Step-specific schemas for multi-step dialog validation
export const newArtistBasicInfoSchema = createArtistSchema.pick({
  avatar: true,
  avatar_file: true,
  legal_name: true,
  stage_name: true,
  email: true,
  dob: true,
  gender: true,
});

export const newArtistDetailsSchema = createArtistSchema.pick({
  country: true,
  genre: true,
  bio: true,
});

export const newArtistConnectSchema = createArtistSchema.pick({
  spotify_url: true,
  apple_music_url: true,
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
    email: string;
    stage_name: string;
    dob: string;
    gender: string;
    country: string;
    genre: string;
    bio: string;
    spotify_url: string;
    apple_music_url: string;
  };
  errors: Record<string, string>;
  locations: Array<{ label: string; value: string }>;
  genres: Array<{ label: string; value: string }>;
  isLoadingMeta: boolean;
  isSubmitting: boolean;
  createdArtist: CreatedArtistData | null;
  setForm: (form: Partial<CreateArtistStore["form"]>) => void;
  setErrors: (errors: Record<string, string>) => void;
  clearErrors: () => void;
  fetchMeta: () => Promise<void>;
  createArtist: () => Promise<CreatedArtistData | null>;
  resetState: () => void;
}

const EMPTY_STATE: CreateArtistStore["form"] = {
  avatar: "",
  avatar_file: null,
  legal_name: "",
  stage_name: "",
  gender: "",
  email: "",
  dob: "",
  country: "",
  genre: "",
  bio: "",
  spotify_url: "",
  apple_music_url: "",
};

const VIEW_STEPS: CreateArtistView[] = [
  "new-artist",
  "new-artist-details",
  "new-artist-connect",
  "new-artist-success",
];

const useCreateArtistStore = create<CreateArtistStore>((set, get) => ({
  view: "new-artist",
  errors: {},
  form: EMPTY_STATE,
  locations: [],
  genres: [],
  isLoadingMeta: false,
  isSubmitting: false,
  createdArtist: null,
  setView: (nextView) => {
    const { view, form, errors } = get();
    const isForward = VIEW_STEPS.indexOf(nextView) > VIEW_STEPS.indexOf(view);
    if (isForward) {
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
          set({ errors: { ...errors, ...fieldErrors } });
          return false;
        }
      }
    }
    set({ view: nextView });
    return true;
  },
  setForm: (formUpdate) =>
    set((state) => {
      const updatedErrors = { ...state.errors };
      for (const key of Object.keys(formUpdate)) {
        delete updatedErrors[key];
      }
      return {
        form: { ...state.form, ...formUpdate },
        errors: updatedErrors,
      };
    }),
  setErrors: (errors) => set({ errors }),
  clearErrors: () => set({ errors: {} }),
  fetchMeta: async () => {
    const { locations, genres } = get();
    // Cache check: if already loaded, don't refetch
    if (locations.length > 0 && genres.length > 0) return;

    set({ isLoadingMeta: true });
    try {
      const [countriesRes, genresRes] = await Promise.all([
        api
          .get<{
            countries?: Array<{ code: string; name: string; currency?: string; dial?: string }>;
          }>(API_ROUTES.META.COUNTRIES)
          .catch(() => null),
        api
          .get<{
            genres?: Array<{
              slug: string;
              name: string;
              sub_genres?: Array<{ slug: string; name: string }>;
            }>;
          }>(API_ROUTES.META.GENRES)
          .catch(() => null),
      ]);

      const newLocations =
        countriesRes?.countries && Array.isArray(countriesRes.countries)
          ? countriesRes.countries.map((c) => ({
              label: c.name,
              value: c.code,
            }))
          : get().locations;

      const newGenres =
        genresRes?.genres && Array.isArray(genresRes.genres)
          ? genresRes.genres.map((genre) => ({
              label: genre.name,
              value: genre.name,
            }))
          : get().genres;

      set({
        locations: newLocations,
        genres: newGenres,
      });
    } catch (err) {
      console.error("Failed to fetch meta options:", err);
    } finally {
      set({ isLoadingMeta: false });
    }
  },
  createArtist: async () => {
    const { isSubmitting, form } = get();
    if (isSubmitting) return null;

    set({ isSubmitting: true, errors: {} });

    try {
      const payload: Record<string, unknown> = {
        legal_name: form.legal_name.trim(),
        email: form.email.trim(),
        stage_name: form.stage_name.trim(),
        dob: form.dob,
        gender: form.gender,
        country: form.country,
        genre: form.genre,
      };

      if (form.bio?.trim()) {
        payload.bio = form.bio.trim();
      }
      if (form.spotify_url?.trim()) {
        payload.spotify_url = form.spotify_url.trim();
      }
      if (form.apple_music_url?.trim()) {
        payload.apple_music_url = form.apple_music_url.trim();
      }

      const res = await api.post<{
        artist: CreatedArtistData;
      }>(API_ROUTES.LABEL.ARTISTS.INDEX, payload);

      const artist = (res as any)?.artist || (res as any)?.data?.artist;

      if (!artist || !artist.reference) {
        throw new Error("No artist record returned from server");
      }

      // If avatar photo was selected, upload it
      if (form.avatar_file) {
        try {
          const photoData = new FormData();
          photoData.append("photo", form.avatar_file);
          const photoRes = await api.post<{
            avatar_url?: string;
            portrait_url?: string;
          }>(API_ROUTES.LABEL.ARTISTS.PHOTO(artist.reference), photoData);

          const photoUrl =
            photoRes?.avatar_url || (photoRes as any)?.data?.avatar_url || (photoRes as any)?.url;
          if (photoUrl) {
            artist.avatar_url = photoUrl;
          }
        } catch (photoErr) {
          console.warn("Artist photo upload failed:", photoErr);
          goeyToast.error("Photo upload failed", {
            description: "Artist was created, but their photo could not be uploaded.",
          });
        }
      }

      set({
        createdArtist: artist,
        view: "new-artist-success",
      });
      goeyToast.success("Artist created successfully!");
      return artist;
    } catch (err: any) {
      console.error("Create artist failed:", err);
      const errorsObj = (err?.errors && typeof err.errors === "object"
        ? err.errors
        : {}) as Record<string, string>;
      const errorKeys = Object.keys(errorsObj);
      const firstFieldError = errorKeys.length > 0 ? errorsObj[errorKeys[0]] : null;

      // lib/api.ts already showed the generic message toast ("Validation failed.").
      // Show the first specific field error toast alongside it if available.
      if (firstFieldError) {
        goeyToast.error(firstFieldError);
      }

      if (errorKeys.length > 0) {
        set({ errors: errorsObj });
      }
      return null;
    } finally {
      set({ isSubmitting: false });
    }
  },
  resetState: () =>
    set({
      view: "new-artist",
      form: EMPTY_STATE,
      errors: {},
      createdArtist: null,
      isSubmitting: false,
    }),
}));

export default useCreateArtistStore;
