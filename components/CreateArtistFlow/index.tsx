"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { VisuallyHidden } from "radix-ui";
import { X } from "lucide-react";
import useCreateArtistStore, { type CreateArtistView } from "@/store/create-artist-store";
import Image from "next/image";
import Input from "../Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import PlatformLookup from "./PlatformLookup";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";

const viewTitleMap: Record<CreateArtistView, string> = {
  "new-artist": "New Artist",
  "new-artist-details": "New Artist",
  "new-artist-connect": "New Artist > Connect profile",
  "new-artist-success": "Created",
};

function CreateArtistFlow({
  open,
  onOpenChange,
  trigger,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactNode;
}) {
  const view = useCreateArtistStore((state) => state.view);
  const form = useCreateArtistStore((state) => state.form);
  const errors = useCreateArtistStore((state) => state.errors);
  const setForm = useCreateArtistStore((state) => state.setForm);
  const setView = useCreateArtistStore((state) => state.setView);
  const resetState = useCreateArtistStore((state) => state.resetState);

  const [locations, setLocations] = useState<Array<{ label: string; value: string }>>([]);
  const [genres, setGenres] = useState<Array<{ label: string; value: string }>>([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchMeta() {
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

        if (
          isMounted &&
          countriesRes?.countries &&
          Array.isArray(countriesRes.countries) &&
          countriesRes.countries.length > 0
        ) {
          setLocations(
            countriesRes.countries.map((c) => ({
              label: c.name,
              value: c.name,
            })),
          );
        }

        if (
          isMounted &&
          genresRes?.genres &&
          Array.isArray(genresRes.genres) &&
          genresRes.genres.length > 0
        ) {
          setGenres(
            genresRes.genres.map((genre) => ({
              label: genre.name,
              value: genre.name,
            })),
          );
        }
      } catch (err) {
        console.error("Failed to fetch meta options:", err);
      }
    }

    fetchMeta();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetState();
    }
    onOpenChange(isOpen);
  };

  const bioWordCount = form.bio ? form.bio.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="max-w-138 rounded-30 isolate gap-0 p-0 overflow-hidden"
      >
        <VisuallyHidden.Root>
          <DialogTitle>Artist Create Popup</DialogTitle>
          <DialogDescription>Artist Create Popup</DialogDescription>
        </VisuallyHidden.Root>
        <div className="absolute w-full top-0 right-0 h-26 bg-linear-to-r from-[#8A38F5] to-[#0066FF] -z-10 opacity-25 blur-3xl pointer-events-none" />

        <header className="px-6 py-5 flex items-center gap-2.5">
          <p className="text-sm font-medium grow">{viewTitleMap[view]}</p>
          <DialogClose className="p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer">
            <X size={20} />
          </DialogClose>
        </header>

        {/* View 1: Basic Info (new-artist) */}
        {view === "new-artist" && (
          <div className="flex items-center flex-col gap-6 py-6 px-8">
            <div className="w-26 relative aspect-square flex items-center justify-center rounded-full bg-brand-orange/10 overflow-hidden">
              <svg
                width={48}
                height={48}
                fill="none"
                viewBox="0 0 49 49"
                className="text-brand-orange"
              >
                <path
                  d="M5.104 24.5C5.104 15.3574 5.104 10.7841 7.94396 7.94415C10.7839 5.10419 15.3552 5.10419 24.4998 5.10419C33.6424 5.10419 38.2158 5.10419 41.0557 7.94415C43.8957 10.7841 43.8957 15.3554 43.8957 24.5C43.8957 33.6426 43.8957 38.2159 41.0557 41.0559C38.2158 43.8959 33.6445 43.8959 24.4998 43.8959C15.3573 43.8959 10.7839 43.8959 7.94396 41.0559C5.104 38.2159 5.104 33.6446 5.104 24.5Z"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.3125 34.7084C20.0737 29.7226 28.8753 29.4878 33.6875 34.7084M29.594 19.3959C29.594 22.2134 27.3073 24.5 24.4837 24.5C23.8127 24.5011 23.1481 24.3699 22.5279 24.1138C21.9077 23.8578 21.344 23.482 20.8692 23.0079C20.3944 22.5339 20.0177 21.9708 19.7606 21.351C19.5036 20.7312 19.3713 20.0668 19.3713 19.3959C19.3713 16.5784 21.658 14.2917 24.4837 14.2917C25.1545 14.2909 25.8189 14.4223 26.4388 14.6785C27.0588 14.9346 27.6222 15.3105 28.0968 15.7845C28.5714 16.2585 28.948 16.8215 29.2048 17.4412C29.4617 18.0608 29.594 18.7251 29.594 19.3959Z"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {form.avatar && (
                <Image
                  className="rounded-full object-cover object-center"
                  src={form.avatar}
                  fill
                  alt="User avatar"
                />
              )}
            </div>
            <label
              htmlFor="avatar"
              className="outline outline-neutral-default rounded-full p-1.5 px-3 flex items-center gap-2.5 font-medium text-xs cursor-pointer hover:bg-black/5 transition-colors"
            >
              <input
                type="file"
                name="avatar"
                id="avatar"
                className="hidden"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  if (!file.type.startsWith("image/")) return;
                  setForm({ avatar: URL.createObjectURL(file), avatar_file: file });
                }}
              />
              <svg width={20} height={20} id="image" fill="none" viewBox="0 0 20 20">
                <path
                  d="M2.0835 9.99998C2.0835 6.26831 2.0835 4.40165 3.24266 3.24248C4.40183 2.08331 6.26766 2.08331 10.0002 2.08331C13.7318 2.08331 15.5985 2.08331 16.7577 3.24248C17.9168 4.40165 17.9168 6.26748 17.9168 9.99998C17.9168 13.7316 17.9168 15.5983 16.7577 16.7575C15.5985 17.9166 13.7327 17.9166 10.0002 17.9166C6.2685 17.9166 4.40183 17.9166 3.24266 16.7575C2.0835 15.5983 2.0835 13.7325 2.0835 9.99998Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.75 7.5C14.4404 7.5 15 6.94036 15 6.25C15 5.55964 14.4404 5 13.75 5C13.0596 5 12.5 5.55964 12.5 6.25C12.5 6.94036 13.0596 7.5 13.75 7.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.3333 18.3333C12.8167 16.4792 11.6125 14.8183 9.8975 13.6117C8.0475 12.3108 5.72667 11.6225 3.34667 11.6692C3.06333 11.6686 2.78111 11.6775 2.5 11.6958"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.8335 15C12.251 13.8941 13.7793 13.3275 15.3218 13.3333C16.2156 13.3368 17.099 13.5246 17.9168 13.885"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-default">{form.avatar ? "Change" : "Add"} Photo</span>
            </label>

            <div className="flex flex-col gap-6 w-full">
              <Input
                label="Legal Name"
                name="legal_name"
                type="text"
                placeholder="Enter artist legal name"
                value={form.legal_name}
                onChange={(e) => setForm({ legal_name: e.target.value })}
                error={errors.legal_name}
              />
              <Input
                label="Stage Name"
                name="stage_name"
                type="text"
                placeholder="Enter artist stage name"
                value={form.stage_name}
                onChange={(e) => setForm({ stage_name: e.target.value })}
                error={errors.stage_name}
              />
              <Input
                label="Age"
                name="age"
                type="text"
                inputMode="numeric"
                placeholder="e.g. 24"
                value={form.age}
                onChange={(e) => setForm({ age: e.target.value })}
                error={errors.age}
              />
              <Field className="flex flex-col gap-2">
                <FieldLabel>Gender</FieldLabel>
                <Select value={form.gender} onValueChange={(val) => setForm({ gender: val })}>
                  <SelectTrigger className="w-full rounded-10 border border-default/10 p-4 text-default font-medium outline-none focus:border-brand-orange transition-all">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other / Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <FieldError>{errors.gender}</FieldError>}
              </Field>
            </div>

            <Button
              type="button"
              onClick={() => setView("new-artist-details")}
              className="self-center rounded-full w-full max-w-63 bg-black hover:bg-black/90 text-white py-3 text-sm font-semibold cursor-pointer transition-all"
            >
              Continue
            </Button>
          </div>
        )}

        {/* View 2: Details (new-artist-details) */}
        {view === "new-artist-details" && (
          <div className="flex flex-col gap-6 py-6 px-8">
            <div className="flex flex-col gap-5 w-full">
              <Field className="flex flex-col gap-2">
                <FieldLabel className="text-sm font-medium text-default">
                  Select location
                </FieldLabel>
                <Select value={form.location} onValueChange={(val) => setForm({ location: val })}>
                  <SelectTrigger className="w-full rounded-10 border border-default/10 p-4 text-default font-medium outline-none focus:border-brand-orange transition-all">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {locations.map((loc) => (
                      <SelectItem key={loc.value} value={loc.value}>
                        {loc.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.location && <FieldError>{errors.location}</FieldError>}
              </Field>

              <Field className="flex flex-col gap-2">
                <FieldLabel className="text-sm font-medium text-default">Genre</FieldLabel>
                <Select value={form.genre} onValueChange={(val) => setForm({ genre: val })}>
                  <SelectTrigger className="w-full rounded-10 border border-default/10 p-4 text-default font-medium outline-none focus:border-brand-orange transition-all">
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {genres.map((g) => (
                      <SelectItem key={g.value} value={g.value}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.genre && <FieldError>{errors.genre}</FieldError>}
              </Field>

              <Field className="flex flex-col gap-2">
                <FieldLabel className="text-sm font-medium text-default">
                  Artist Bio (Optional)
                </FieldLabel>
                <div className="w-full rounded-10 border border-default/10 p-4 flex flex-col justify-between min-h-35 focus-within:border-brand-orange transition-all bg-white">
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ bio: e.target.value })}
                    placeholder="Write about this artist"
                    rows={4}
                    className="w-full outline-none text-sm text-default placeholder:text-black/35 resize-none"
                  />
                  <div className="w-full pt-2 border-t border-default/10 flex justify-end">
                    <span className="text-xs text-black/40 font-normal">
                      {bioWordCount} {bioWordCount === 1 ? "word" : "words"}
                    </span>
                  </div>
                </div>
                {errors.bio && <FieldError>{errors.bio}</FieldError>}
              </Field>
            </div>

            <Button
              type="button"
              onClick={() => setView("new-artist-connect")}
              className="self-center rounded-full w-full max-w-63 bg-black hover:bg-black/90 text-white py-3 text-sm font-semibold cursor-pointer transition-all"
            >
              Continue
            </Button>
          </div>
        )}

        {/* View 3: Connect Profile (new-artist-connect) */}
        {view === "new-artist-connect" && (
          <div className="flex flex-col gap-6 py-6 px-8">
            <div className="flex flex-col gap-6 w-full">
              <PlatformLookup
                platform="spotify"
                label="Artist Spotify Id"
                placeholder="Paste here - e.g. 22bE4uQ6baNwSHPVcDxLCe"
                helperText="Go to your artist page on Spotify and copy-paste the numeric part of the URL. e.g. 22bE4uQ6baNwSHPVcDxLCe"
                value={form.spotify_id}
                fallbackArtistName={form.stage_name}
                fallbackAvatar={form.avatar}
                onChange={(val) => setForm({ spotify_id: val })}
                error={errors.spotify_id}
              />

              <div className="w-full h-px bg-default-default my-1" />

              <PlatformLookup
                platform="apple"
                label="Artist Apple Id"
                placeholder="Paste here - e.g. 1249595"
                helperText="Go to your artist page on Apple Music and copy-paste the numeric part of the URL. e.g. 1249595"
                value={form.applu_music_id}
                fallbackArtistName={form.stage_name}
                fallbackAvatar={form.avatar}
                onChange={(val) => setForm({ applu_music_id: val })}
                error={errors.applu_music_id}
              />
            </div>

            <Button
              type="button"
              onClick={() => setView("new-artist-success")}
              className="self-center rounded-full w-full max-w-63 bg-black hover:bg-black/90 text-white py-3 text-sm font-semibold cursor-pointer transition-all"
            >
              Create artist
            </Button>
          </div>
        )}

        {/* View 4: Success Screen (new-artist-success) */}
        {view === "new-artist-success" && (
          <div className="flex flex-col items-center justify-center gap-6 py-10 px-8 text-center bg-white rounded-30">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <Image
                src="/images/checkmark.png"
                alt="Artist created"
                width={112}
                height={112}
                className="object-contain"
                priority
              />
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-medium">New artist added</h2>
              <p className="text-black/50 max-w-xs leading-relaxed">
                You have successfully added a new artist{" "}
                <span className="font-medium text-default">
                  {form.stage_name || "Artist"} {form.age}
                  {form.location ? `, ${form.location}` : ""}
                </span>
              </p>
            </div>

            <Button
              type="button"
              onClick={() => {
                onOpenChange(false);
                resetState();
              }}
              className="self-center rounded-full px-12 py-2.5 bg-white border border-black/80 text-black hover:bg-black hover:text-white text-sm font-medium transition-colors cursor-pointer"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default CreateArtistFlow;
