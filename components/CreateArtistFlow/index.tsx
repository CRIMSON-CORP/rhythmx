import { ReactNode, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { VisuallyHidden } from "radix-ui";
import { X, Loader2, ChevronLeft } from "lucide-react";
import useCreateArtistStore, {
  type CreateArtistView,
  type CreatedArtistData,
} from "@/store/create-artist-store";
import Image from "next/image";
import Input from "../Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import PlatformLookup from "./PlatformLookup";
import UserSquare from "../icons/user-square";
import ImageIcon from "../icons/image";

export type { CreatedArtistData };

const viewTitleMap: Record<CreateArtistView, string> = {
  "new-artist": "New Artist",
  "new-artist-details": "New Artist",
  "new-artist-connect": "New Artist > Connect profile",
  "new-artist-success": "Created",
};

interface CreateArtistFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactNode;
  onArtistCreated?: (artist: CreatedArtistData) => void;
}

function CreateArtistFlow({ open, onOpenChange, trigger, onArtistCreated }: CreateArtistFlowProps) {
  const view = useCreateArtistStore((state) => state.view);
  const form = useCreateArtistStore((state) => state.form);
  const errors = useCreateArtistStore((state) => state.errors);
  const locations = useCreateArtistStore((state) => state.locations);
  const genres = useCreateArtistStore((state) => state.genres);
  const isSubmitting = useCreateArtistStore((state) => state.isSubmitting);
  const createdArtist = useCreateArtistStore((state) => state.createdArtist);
  const setForm = useCreateArtistStore((state) => state.setForm);
  const setView = useCreateArtistStore((state) => state.setView);
  const resetState = useCreateArtistStore((state) => state.resetState);
  const fetchMeta = useCreateArtistStore((state) => state.fetchMeta);
  const createArtist = useCreateArtistStore((state) => state.createArtist);

  useEffect(() => {
    if (open) {
      fetchMeta();
    }
  }, [open, fetchMeta]);

  const handleDone = () => {
    if (createdArtist) {
      onArtistCreated?.(createdArtist);
    }
    onOpenChange(false);
    resetState();
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      if (view === "new-artist-success" && createdArtist) {
        onArtistCreated?.(createdArtist);
      }
      resetState();
    }
    onOpenChange(isOpen);
  };

  const bioWordCount = form.bio ? form.bio.trim().split(/\s+/).filter(Boolean).length : 0;

  const age = useMemo(() => {
    if (!form.dob) return "";
    const today = new Date();
    const [y, m, d] = form.dob.split("-").map(Number);
    const birthDate = new Date(y, m - 1, d);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }, [form.dob]);

  const maxDobDate = useMemo(() => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 13);
    return today.toISOString().split("T")[0];
  }, []);

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
          {view === "new-artist-details" && (
            <button
              type="button"
              onClick={() => setView("new-artist")}
              className="p-1 -ml-1 rounded-full hover:bg-black/5 transition-colors cursor-pointer text-default"
              aria-label="Back"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          {view === "new-artist-connect" && (
            <button
              type="button"
              onClick={() => setView("new-artist-details")}
              className="p-1 -ml-1 rounded-full hover:bg-black/5 transition-colors cursor-pointer text-default"
              aria-label="Back"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <p className="text-sm font-medium grow">{viewTitleMap[view]}</p>
          <DialogClose className="p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer">
            <X size={20} />
          </DialogClose>
        </header>

        {/* View 1: Basic Info (new-artist) */}
        {view === "new-artist" && (
          <div className="flex items-center flex-col gap-6 py-6 px-8 overflow-auto max-h-[85vh] no-scrollbar">
            <div className="w-26 flex-none relative aspect-square flex items-center justify-center rounded-full bg-brand-orange/10 overflow-hidden">
              {form.avatar ? (
                <Image
                  className="rounded-full object-cover object-center"
                  src={form.avatar}
                  fill
                  alt="User avatar"
                />
              ) : (
                <UserSquare className="text-brand-orange" />
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
              <ImageIcon />
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
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter artist email address"
                value={form.email}
                onChange={(e) => setForm({ email: e.target.value })}
                error={errors.email}
              />
              <Input
                label="Date of Birth"
                name="dob"
                type="date"
                max={maxDobDate}
                placeholder="e.g. 2000-01-01"
                value={form.dob}
                onChange={(e) => setForm({ dob: e.target.value })}
                error={errors.dob}
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
              rounded={10}
              onClick={() => setView("new-artist-details")}
              className="self-center w-full max-w-63 bg-black hover:bg-black/90 text-white py-3 text-sm font-semibold cursor-pointer transition-all"
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
                <FieldLabel className="text-sm font-medium text-default">Select Country</FieldLabel>
                <Select value={form.country} onValueChange={(val) => setForm({ country: val })}>
                  <SelectTrigger className="w-full rounded-10 border border-default/10 p-4 text-default font-medium outline-none focus:border-brand-orange transition-all">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {locations.map((loc) => (
                      <SelectItem key={loc.value} value={loc.value}>
                        {loc.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && <FieldError>{errors.country}</FieldError>}
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
              rounded={10}
              onClick={() => setView("new-artist-connect")}
              className="self-center w-full max-w-63 bg-black hover:bg-black/90 text-white py-3 text-sm font-semibold cursor-pointer transition-all"
            >
              Continue
            </Button>
          </div>
        )}

        {/* View 3: Connect Profile (new-artist-connect) */}
        {view === "new-artist-connect" && (
          <div className="flex flex-col gap-6 py-6 px-8">
            <div className="flex flex-col gap-4 w-full">
              <PlatformLookup
                platform="spotify"
                label="Artist Spotify Id"
                helperText="Go to your artist page on Spotify and copy-paste the numeric part of the URL. e.g. 22bE4uQ6baNwSHPVcDxLCe"
                value={form.spotify_url}
                onChange={(val) => setForm({ spotify_url: val })}
                error={errors.spotify_url || errors.spotify_id}
              />

              <div className="w-full h-px bg-default-default" />

              <PlatformLookup
                platform="apple"
                label="Artist Apple Id"
                helperText="Go to your artist page on Apple Music and copy-paste the numeric part of the URL. e.g. 1249595"
                value={form.apple_music_url}
                onChange={(val) => setForm({ apple_music_url: val })}
                error={errors.apple_music_url || errors.apple_music_id}
              />
            </div>

            <Button
              type="button"
              rounded={10}
              onClick={() => createArtist()}
              disabled={isSubmitting}
              className="self-center w-full max-w-63 bg-black hover:bg-black/90 text-white py-3 text-sm font-semibold cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating artist...</span>
                </>
              ) : (
                "Create artist"
              )}
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
                <span>
                  {form.stage_name || "Artist"} {age ? `(${age})` : ""}
                  {form.country
                    ? `, ${locations.find((l) => l.value === form.country)?.label || form.country}`
                    : ""}
                </span>
              </p>
            </div>

            <Button
              type="button"
              onClick={handleDone}
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
