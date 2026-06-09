"use client";
import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import useNewReleaseStore from "@/store/new-release-store";
import React, { useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { releaseGenre } from "@/data/release-genre";
import { releaseLanguage } from "@/data/release-language-dropdown";
import { cn } from "@/lib/utils";
import { goeyToast } from "goey-toast";
import { ArrowRight, Calendar as CalendarIcon, Folder } from "lucide-react";

function ReleaseDetalsPage() {
  const { form, setForm, next } = useNewReleaseStore();
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(form.artwork_url || null);
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
    goeyToast.success("Uploading Cover Artwork...", {
      description: "Please wait while we upload your cover art",
      duration: 1500,
    });

    setTimeout(() => {
      const url = URL.createObjectURL(file);
      setForm({ artwork: file, artwork_url: url });
      setPreviewUrl(url);
      goeyToast.success("Artwork Uploaded", {
        description: "Cover artwork has been uploaded successfully",
        duration: 1000,
      });
    }, 1500);
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

  const handleInputChange = (key: keyof typeof form, value: string | boolean) => {
    setForm({ [key]: value });
  };

  const isFormValid = !!(
    form.release_title?.trim() &&
    form.primary_genre &&
    form.version_title?.trim() &&
    form.producers?.trim() &&
    form.copyright_holder?.trim() &&
    form.production_copyright_year &&
    form.copyright_year &&
    form.language &&
    form.original_release_date &&
    form.artwork
  );

  const handleContinue = () => {
    if (isFormValid) {
      next();
    } else {
      goeyToast.error("All Fields are required", {
        description: "Please fill in all fields to continue",
      });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[0.55fr_0.45fr] gap-8 items-stretch">
      {/* Left Column: Form Fields Card */}
      <div className="bg-white rounded-30 p-4 md:p-10.5 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sub-column A (Left) */}
          <div className="flex flex-col gap-5">
            {/* Release Title */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default">Release Title</label>
              <span className="text-sm text-border-default-secondary font-medium leading-normal">
                NOTE: Version information such as Remix or Uncut should not be included in tha main
                Title field. Use the Version box instead.
              </span>
              <input
                type="text"
                value={form.release_title}
                onChange={(e) => handleInputChange("release_title", e.target.value)}
                placeholder="What's the title of this Single"
                className="w-full rounded-xl border border-default-default px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-colors"
              />
            </div>

            {/* Release Description (Optional) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default">
                Release Description (Optional)
              </label>
              <div className="flex flex-col gap-2.5 w-full rounded-xl border border-default-default p-4 text-sm text-default font-medium">
                <textarea
                  value={form.release_description}
                  rows={4}
                  placeholder="Write about this release (Optional)"
                  onChange={(e) => handleInputChange("release_description", e.target.value)}
                  className="w-full resize-none text-sm text-default border-b border-default-default/20 focus:border-brand-orange transition-colors font-medium outline-none pb-2 placeholder:text-[#8E8E93]"
                />
                <div className="flex items-center gap-2 text-xs text-[#8E8E93]">
                  <Icon name="info-square" size={18} />
                  <span className="text-default-tertiary">Keep it detailed</span>
                </div>
              </div>
            </div>

            {/* Primary Genre */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default">Primary Genre</label>
              <Select
                value={form.primary_genre}
                onValueChange={(value) => handleInputChange("primary_genre", value)}
              >
                <SelectTrigger className="w-full h-auto rounded-xl border border-default-default px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange bg-transparent transition-colors">
                  <SelectValue placeholder="Select a genre (Pop, Rock, Country etc.)" />
                </SelectTrigger>
                <SelectContent>
                  {releaseGenre.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Secondary Genre (Optional) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default">Secondary Genre (Optional)</label>
              <Select
                value={form.secondary_genre}
                onValueChange={(value) => handleInputChange("secondary_genre", value)}
              >
                <SelectTrigger className="w-full h-auto rounded-xl border border-default-default px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange bg-transparent transition-colors">
                  <SelectValue placeholder="Select a genre (Pop, Rock, Country etc.)" />
                </SelectTrigger>
                <SelectContent>
                  {releaseGenre.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Version Title */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default">Version Title</label>
              <input
                type="text"
                value={form.version_title}
                onChange={(e) => handleInputChange("version_title", e.target.value)}
                placeholder="Enter version title"
                className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-colors"
              />
            </div>

            {/* Producer (s) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default">Producer(s)</label>
              <input
                type="text"
                value={form.producers}
                onChange={(e) => handleInputChange("producers", e.target.value)}
                placeholder="i.e Young John"
                className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-colors"
              />
            </div>
          </div>

          {/* Sub-column B (Right) */}
          <div className="flex flex-col gap-5">
            {/* Record Label (Optional) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default">Record Label (Optional)</label>
              <input
                type="text"
                value={form.record_label}
                onChange={(e) => handleInputChange("record_label", e.target.value)}
                placeholder="i.e Sony Music"
                className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-colors"
              />
            </div>

            {/* Copyright Holder */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default">Copyright Holder</label>
              <input
                type="text"
                value={form.copyright_holder}
                onChange={(e) => handleInputChange("copyright_holder", e.target.value)}
                placeholder="i.e Sony Music"
                className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-colors"
              />
            </div>

            {/* Production Copyright Year */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default">Production Copyright Year</label>
              <input
                type="number"
                min={1900}
                max={currentYear + 2}
                value={form.production_copyright_year}
                onChange={(e) => handleInputChange("production_copyright_year", e.target.value)}
                placeholder="Select Year"
                className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-colors"
              />
            </div>

            {/* Copyright Year */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default">Copyright Year</label>
              <input
                type="number"
                min={1900}
                max={currentYear + 2}
                value={form.copyright_year}
                onChange={(e) => handleInputChange("copyright_year", e.target.value)}
                placeholder="Select Year"
                className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-colors"
              />
            </div>

            {/* Language */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default">Language</label>
              <Select
                value={form.language}
                onValueChange={(value) => handleInputChange("language", value)}
              >
                <SelectTrigger className="w-full h-auto rounded-xl border border-default-default px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange bg-transparent transition-colors">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {releaseLanguage.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 13 digits BarCode */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default">
                13 digits BarCode (UPC/EAN)
              </label>
              <input
                type="text"
                value={form.barcode}
                onChange={(e) => handleInputChange("barcode", e.target.value)}
                placeholder="i.e 123456789012"
                className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-all"
              />
            </div>

            {/* Original Release Date */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default">Original Release Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-colors flex items-center justify-between text-left"
                  >
                    <span
                      className={form.original_release_date ? "text-default" : "text-[#8E8E93]"}
                    >
                      {form.original_release_date
                        ? format(new Date(form.original_release_date), "PPP")
                        : "Pick a date"}
                    </span>
                    <CalendarIcon size={16} className="text-default/50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      form.original_release_date ? new Date(form.original_release_date) : undefined
                    }
                    onSelect={(date) => {
                      if (date) {
                        const formatted = format(date, "yyyy-MM-dd");
                        handleInputChange("original_release_date", formatted);
                      } else {
                        handleInputChange("original_release_date", "");
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Form Footer / Action bar */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
          <p className="font-medium text-default text-center">
            Please review your release details before clicking &quot;continue&quot;
          </p>
          <Button variant="orange" onClick={handleContinue} disabled={!isFormValid}>
            <span>Continue</span>
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>

      {/* Right Column: Add Release Artwork Card */}
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
              alt="release artwork preview"
              className="rounded-20"
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
              "w-fit p-4 rounded-full outline outline-black bg-white hover:bg-default/5 text-default font-semibold flex items-center gap-2 transition-colors",
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
          </label>
        </div>

        <input
          type="file"
          id="artwork-input"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );
}

export default ReleaseDetalsPage;
