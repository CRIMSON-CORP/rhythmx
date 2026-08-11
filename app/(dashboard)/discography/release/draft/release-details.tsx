"use client";
import { Button } from "@/components/ui/button";
import React, {
  memo,
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { goeyToast } from "goey-toast";
import { ArrowRight, Folder, Loader2 } from "lucide-react";
import { FieldError } from "@/components/ui/field";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { useRouter } from "next/navigation";

const SELECT_TRIGGER_CLASS =
  "w-full h-auto rounded-xl border border-default-default px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange bg-transparent transition-colors";

const release_types: { slug: ReleaseType; name: string }[] = [
  { slug: "single", name: "Single" },
  { slug: "album", name: "Album" },
  { slug: "ep", name: "EP" },
  { slug: "compilation", name: "Compilation" },
];

interface ReleaseDetailsProps {
  /**
   * This component is used for both new draft and existing draft, so it accepts initial data so it can be used in both instances
   */
  initialData: {
    reference?: string;
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
    artwork: string | null;
    cover_url: string | null;
  };
  /**
   * the meta data for the release
   */
  meta: {
    /**
     * list of languages available for the release
     */
    languages: Language[];
    /**
     * list of genres available for the release
     */
    genres: GenresResponse["genres"];
  };
}

interface State {
  message: string;
  status: "error" | "success" | "pending";
  error?: Record<keyof ReleaseDetailsProps["initialData"], string>;
  reference?: string;
  redirectUrl?: string;
}

const initialState: State = { message: "", status: "pending" };

async function submitDraftRelease(previousState: State, formData: FormData): Promise<State> {
  const release_id = formData.get("reference");
  let reference = release_id?.toString() || undefined;

  const payload: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (key === "artwork" || key === "reference") {
      continue;
    }
    payload[key] = value.toString();
  }

  try {
    const data = await api[release_id ? "patch" : "post"]<{ reference: string }>(
      API_ROUTES.RELEASES.CREATE_DRAFT + (release_id ? `/${release_id}` : ""),
      payload,
    );
    reference = data.reference;
  } catch (error) {
    console.log(error);
    return {
      message: error instanceof Error ? error.message : "Failed to create draft",
      status: "error",
      reference,
      error: (error as { errors: Record<string, string> }).errors,
    };
  }

  try {
    const artwork = formData.get("artwork");
    if (artwork instanceof File && artwork.size > 0) {
      const artworkFormData = new FormData();
      artworkFormData.append("artwork", artwork);
      await api.postFormData({
        url: API_ROUTES.RELEASES.UPLOAD_ARTWORK(reference),
        formData: artworkFormData,
      });
    }

    return {
      message: "Draft saved successfully",
      status: "success",
      reference,
      redirectUrl: `/discography/release/draft/${reference}/add-artists?from=${release_id ? "old" : "new"}`,
    };
  } catch (error) {
    console.log(error);
    const artworkError = (error as { artwork: string })?.artwork;
    return {
      message: artworkError || "Draft saved, but artwork upload failed. Please try again.",
      status: "error",
      reference,
    };
  }
}

function ReleaseDetalsPageComponent(params: ReleaseDetailsProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(submitDraftRelease, initialState);
  const [pending, startTransition] = useTransition();

  const [selectedGenreSlug, setSelectedGenreSlug] = useState(params.initialData.genre || "");
  const [selectedSubGenreSlug, setSelectedSubGenreSlug] = useState(
    params.initialData.sub_genre || "",
  );

  const activeMainGenre = useMemo(
    () => params.meta.genres.find((g) => g.slug === selectedGenreSlug),
    [params.meta.genres, selectedGenreSlug],
  );

  const handleGenreChange = (newSlug: string) => {
    setSelectedGenreSlug(newSlug);
    setSelectedSubGenreSlug("");
  };

  useEffect(() => {
    if (state.status === "error") {
      goeyToast.error(state.message);
    } else if (state.status === "success") {
      goeyToast.success(state.message);
      if (state.redirectUrl) {
        router.push(state.redirectUrl);
      }
    }
  }, [state, router]);

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(() => formAction(new FormData(e.currentTarget)));
      }}
      className="group/form grid grid-cols-1 lg:grid-cols-[0.55fr_0.45fr] gap-8 pb-10 items-stretch"
    >
      {/* Left Column: Form Fields Card */}
      <div className="bg-white rounded-30 p-4 md:p-10.5 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sub-column A (Left) */}
          <div className="flex flex-col gap-5">
            {/* Release Title */}
            <input
              type="hidden"
              name="reference"
              value={state.reference || params.initialData.reference || ""}
            />
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default">Release Title</label>
              <span className="text-sm text-border-default-secondary font-medium leading-normal">
                NOTE: Version information such as Remix or Uncut should not be included in tha main
                Title field. Use the Version box instead.
              </span>
              <input
                required
                type="text"
                name="title"
                title="Use 3-255 characters for the title"
                defaultValue={params.initialData.title}
                placeholder="What's the title of this Single"
                className="w-full rounded-xl border border-default-default px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-colors"
              />
              {state.error?.title && <FieldError>{state.error.title}</FieldError>}
            </div>

            {/* Release Description (Optional) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default">
                Release Description (Optional)
              </label>
              <div className="flex flex-col gap-2.5 w-full rounded-xl border border-default-default p-4 text-sm text-default font-medium">
                <textarea
                  rows={4}
                  name="release_description"
                  defaultValue={params.initialData.release_description}
                  placeholder="Write about this release (Optional)"
                  className="w-full resize-none text-sm text-default border-b border-default-default/20 focus:border-brand-orange transition-colors font-medium outline-none pb-2 placeholder:text-[#8E8E93]"
                />
                <div className="flex items-center gap-2 text-xs text-[#8E8E93]">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M9 6.75H9.0075M8.25 9H9V12H9.75M9 2.25C14.4 2.25 15.75 3.6 15.75 9C15.75 14.4 14.4 15.75 9 15.75C3.6 15.75 2.25 14.4 2.25 9C2.25 3.6 3.6 2.25 9 2.25Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-default-tertiary">Keep it detailed</span>
                </div>
              </div>
            </div>

            {/* Release Type */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default">Release Type</label>
              <Select required name="type" defaultValue={params.initialData.type}>
                <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                  <SelectValue placeholder="Select release type" />
                </SelectTrigger>
                <SelectContent>
                  {release_types.map((l) => (
                    <SelectItem key={l.slug} value={l.slug}>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.error?.type && <FieldError>{state.error.type}</FieldError>}
            </div>

            {/* Primary Genre */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default">Primary Genre</label>
              <Select
                required
                name="genre"
                value={selectedGenreSlug}
                onValueChange={handleGenreChange}
              >
                <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                  <SelectValue placeholder="Select a Primary Genre (Pop, Rock, Country etc.)" />
                </SelectTrigger>
                <SelectContent>
                  {params.meta.genres.map((g) => (
                    <SelectItem key={g.slug} value={g.slug}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.error?.genre && <FieldError>{state.error.genre}</FieldError>}
            </div>

            {/* Secondary Genre (Optional) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default">Secondary Genre (Optional)</label>
              <Select
                name="sub_genre"
                value={selectedSubGenreSlug}
                onValueChange={setSelectedSubGenreSlug}
                disabled={!activeMainGenre || activeMainGenre.sub_genres.length === 0}
              >
                <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                  <SelectValue
                    placeholder={
                      activeMainGenre ? "Select a Secondary Genre" : "Select a Primary Genre first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {activeMainGenre?.sub_genres.map((subGenre) => (
                    <SelectItem key={subGenre.slug} value={subGenre.slug}>
                      {subGenre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.error?.sub_genre && <FieldError>{state.error.sub_genre}</FieldError>}
            </div>

            {/* Version Title */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default">Version Title</label>
              <input
                required
                type="text"
                name="version"
                placeholder="Enter version title"
                defaultValue={params.initialData.version}
                title="Use 3-255 characters for the version title"
                className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-colors"
              />
              {state.error?.version && <FieldError>{state.error.version}</FieldError>}
            </div>

            {/* Producer (s) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default">Producer(s)</label>
              <input
                required
                type="text"
                name="producers"
                placeholder="i.e Young John"
                defaultValue={params.initialData.producers}
                title="Use 3-255 characters for the producer name"
                className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-colors"
              />
              {state.error?.producers && <FieldError>{state.error.producers}</FieldError>}
            </div>
          </div>

          {/* Sub-column B (Right) */}
          <div className="flex flex-col gap-5">
            {/* Record Label (Optional) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default">Record Label (Optional)</label>
              <input
                required
                type="text"
                name="record_label"
                placeholder="i.e Sony Music"
                defaultValue={params.initialData.record_label}
                title="Use 3-255 characters for the record label name"
                className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-colors"
              />
              {state.error?.record_label && <FieldError>{state.error.record_label}</FieldError>}
            </div>

            {/* Copyright Holder */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default">Copyright Holder</label>
              <input
                required
                type="text"
                name="copyright_holder"
                placeholder="i.e Sony Music"
                defaultValue={params.initialData.copyright_holder}
                title="Use 3-255 characters for the copyright holder name"
                className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-colors"
              />
              {state.error?.copyright_holder && (
                <FieldError>{state.error.copyright_holder}</FieldError>
              )}
            </div>

            {/* Production Copyright Year */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default">Production Copyright Year</label>
              <input
                required
                min={1900}
                type="number"
                inputMode="numeric"
                max={currentYear + 2}
                placeholder="Select Year"
                name="production_copyright_year"
                defaultValue={params.initialData.production_copyright_year}
                className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-colors"
              />
              {state.error?.production_copyright_year && (
                <FieldError>{state.error.production_copyright_year}</FieldError>
              )}
            </div>

            {/* Copyright Year */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default">Copyright Year</label>
              <input
                required
                min={1900}
                type="number"
                inputMode="numeric"
                max={currentYear + 2}
                placeholder="Select Year"
                name="copyright_year"
                defaultValue={params.initialData.copyright_year}
                className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-colors"
              />
              {state.error?.copyright_year && <FieldError>{state.error.copyright_year}</FieldError>}
            </div>

            {/* Language */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default">Language</label>
              <LanguageSelect
                name="language"
                defaultValue={params.initialData.language}
                languages={params.meta.languages}
              />
              {state.error?.language && <FieldError>{state.error.language}</FieldError>}
            </div>

            {/* 13 digits BarCode */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default">
                13 digits BarCode (UPC/EAN)
              </label>
              <input
                required
                name="upc"
                type="text"
                maxLength={13}
                minLength={13}
                inputMode="numeric"
                placeholder="i.e 123456789012"
                pattern="[\d]{13}"
                defaultValue={params.initialData.upc}
                title="Use 13 digits for the UPC/EAN"
                className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-all"
              />
              {state.error?.upc && <FieldError>{state.error.upc}</FieldError>}
            </div>

            {/* Original Release Date */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default">Original Release Date</label>
              <input
                required
                type="date"
                min="1900-01-01"
                name="original_release_date"
                title="Select a valid release date"
                defaultValue={params.initialData.original_release_date}
                className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-all"
              />
              {state.error?.original_release_date && (
                <FieldError>{state.error.original_release_date}</FieldError>
              )}
            </div>
          </div>
        </div>

        {/* Form Footer / Action bar */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
          <p className="font-medium text-default text-center">
            Please review your release details before clicking &quot;continue&quot;
          </p>
          <Button
            variant="orange"
            type="submit"
            disabled={pending}
            className="group-has-invalid/form:opacity-50 group-not-has-invalid/form:opacity-100"
          >
            {pending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight size={16} />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Right Column: Add Release Artwork Card */}
      <ArtWorkUpload existingArtwork={params.initialData.cover_url} error={state.error?.artwork} />
    </form>
  );
}

export default ReleaseDetalsPageComponent;

const LanguageSelect = memo(function LanguageSelect({
  name,
  defaultValue,
  languages,
}: {
  name: string;
  defaultValue: string;
  languages: Language[];
}) {
  return (
    <Select name={name} defaultValue={defaultValue} required>
      <SelectTrigger className={SELECT_TRIGGER_CLASS}>
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((l) => (
          <SelectItem key={l.slug} value={l.slug}>
            {l.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});

function ArtWorkUpload({
  existingArtwork,
  error,
}: {
  existingArtwork: string | null;
  error?: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingArtwork);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleUploadArtwork = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleUploadArtwork(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUploadArtwork(files[0]);
    }
  };
  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`bg-white max-lg:row-start-1 overflow-hidden relative isolate rounded-30 p-6 md:p-8 flex flex-col text-center ${
        isDragging ? "" : ""
      }`}
    >
      <div className="absolute w-full top-0 left right-0 h-1/3 bg-linear-to-r from-[#FF7247] to-[#FFC107] -z-10 opacity-25 blur-3xl"></div>
      <div className="flex items-center flex-col gap-2.5 text-center pt-20 pb-15 max-w-118.75 mx-auto">
        <h2 className="text-xl font-medium">Add Release Artwork</h2>
        <p className="text-xs font-medium text-border-default-secondary">
          To ensure your music looks its best on platforms like Apple Music, Spotify, and others,
          release artwork is required across all streaming services. Your cover art should be
          square, less than 10MB in size, and at least 1400 x 1400 pixels.
        </p>
        <Dialog>
          <DialogTrigger className="text-xs font-medium px-3 py-2 text-brand-blue hover:underline">
            Learn More about our Art Cover Policy
          </DialogTrigger>
          <DialogContent className="p-5 max-w-116.5 w-full">
            <DialogTitle>Artwork Policy</DialogTitle>
            <ol className="list-decimal pl-5 text-border-default-secondary font-medium">
              <li>Sexually explicit imagery.</li>
              <li>Streaming platforms only accept cover art files in JPG or PNG formats.</li>
              <li>Any text other than the release title and/or artist name.</li>
              <li>WebURLs social media handle or contact information</li>
              <li>
                Third-Party logos on trademarks without express written consent from the trademark
              </li>
            </ol>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grow flex flex-col gap-6 items-center justify-center p-5">
        {previewUrl ? (
          <Image
            width={230}
            height={230}
            src={previewUrl}
            unoptimized={previewUrl.startsWith("blob:")}
            alt="release artwork preview"
            className="rounded-20 w-57 h-57 object-cover"
          />
        ) : (
          <div className="relative isolate flex justify-end items-end *:origin-[bottom_right] *:rounded-20 *:aspect-square *:object-cover *:outline-4  *:outline-white">
            <Image
              width={167}
              height={167}
              src="/images/new-release-1.jpg"
              alt="release artwork preview"
              className="-rotate-12"
            />
            <Image
              width={124}
              height={124}
              src="/images/new-release-2.jpg"
              alt="release artwork preview"
              className="absolute -z-10"
            />
            <Image
              width={142}
              height={142}
              src="/images/new-release-3.jpg"
              alt="release artwork preview"
              className="absolute -z-20 rotate-12"
            />
          </div>
        )}
        {previewUrl ? null : (
          <p className="text-xl font-medium font-heading mt-10">Drag your Cover Artwork here</p>
        )}
        <label
          htmlFor="artwork-input"
          className={cn(
            "relative w-fit p-4 rounded-full outline outline-black bg-white hover:bg-default/5 text-default font-semibold flex items-center gap-2 transition-colors",
            isDragging && "bg-brand-orange text-white border-transparent",
          )}
        >
          {isDragging ? (
            <span>Drop</span>
          ) : (
            <>
              {previewUrl ? <span>Change Artwork</span> : <span>Browse Files</span>}
              <Folder size={16} />
            </>
          )}
          <input
            type="file"
            name="artwork"
            id="artwork-input"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="absolute inset-0 opacity-0 pointer-events-none"
          />
        </label>
        {error && <FieldError>{error}</FieldError>}
      </div>
    </div>
  );
}
