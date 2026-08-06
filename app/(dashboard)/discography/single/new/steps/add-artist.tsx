"use client";

import { useState, Suspense, use } from "react";
import Image from "next/image";
import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import useNewReleaseStore from "@/store/new-release-store";
import { goeyToast } from "goey-toast";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "radix-ui";
import { artists } from "@/data/artists";
import { ArrowRight, ArrowUpRight, ChevronRight, List, Plus, Search, Star, X } from "lucide-react";

// Simple query cache to store the delay promises so React Suspense does not loop infinitely
const promiseCache = new Map<string, Promise<Artist[]>>();

function getArtistsPromise(query: string) {
  const cacheKey = query.trim().toLowerCase();
  if (!promiseCache.has(cacheKey)) {
    const promise = new Promise<Artist[]>((resolve) => {
      setTimeout(() => {
        const filtered = artists.filter(
          (a) =>
            a.name.toLowerCase().includes(cacheKey) || a.location.toLowerCase().includes(cacheKey),
        );
        resolve(filtered);
      }, 1500);
    });
    promiseCache.set(cacheKey, promise);
  }
  return promiseCache.get(cacheKey)!;
}

function AddArtistPage() {
  const { form, setForm, next } = useNewReleaseStore();
  const [activeSection, setActiveSection] = useState<"main" | "featured" | "producer">("main");

  const canContinue = form.main_artists && form.main_artists.length > 0;

  const handleContinue = () => {
    if (canContinue) {
      next();
    } else {
      goeyToast.error("Main Artist Required", {
        description: "Please add at least one main artist to continue",
      });
    }
  };

  const handleRemoveArtist = (artistId: string, type: "main" | "featured" | "producer") => {
    if (type === "main") {
      setForm({ main_artists: form.main_artists.filter((a) => a.id !== artistId) });
    } else if (type === "featured") {
      setForm({ featured_artists: form.featured_artists.filter((a) => a.id !== artistId) });
    } else {
      setForm({ producer_credits: form.producer_credits.filter((a) => a.id !== artistId) });
    }
    goeyToast.success("Artist removed successfully");
  };

  const totalAdded =
    (form.main_artists?.length || 0) +
    (form.featured_artists?.length || 0) +
    (form.producer_credits?.length || 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[0.55fr_0.45fr] gap-8 items-stretch pb-10">
      {/* Left Column: Accordion Form Card */}
      <div className="bg-white rounded-30 p-4 md:p-10 flex flex-col gap-8">
        <div className="flex flex-col gap-6 divide-y divide-default-default">
          {/* Main Artists Section */}
          <div className="flex flex-col gap-4 border-b pb-6">
            <div className="flex flex-col gap-4 items-start w-full">
              <div className="flex flex-col items-start gap-3">
                <p className="font-medium text-border-default-secondary">Main Artist</p>
                {activeSection !== "main" && (
                  <Button
                    variant="outline"
                    onClick={() => setActiveSection("main")}
                    className="px-5 py-2.5 rounded-full w-fit"
                  >
                    <span className="font-medium text-sm text-default">Add</span>
                    <Plus size={16} />
                  </Button>
                )}
              </div>
              {activeSection === "main" && <ArtistAdder sectionType="main" />}
            </div>
          </div>

          {/* Featured Artists Section */}
          <div className="flex flex-col gap-4 border-b pb-6">
            <div className="flex flex-col gap-4 items-start w-full">
              <div className="flex flex-col items-start gap-3">
                <p className="font-medium text-border-default-secondary">Feature Artist</p>
                {activeSection !== "featured" && (
                  <Button size="sm" variant="outline" onClick={() => setActiveSection("featured")}>
                    <span className="font-medium text-sm text-default">Add</span>
                    <Plus size={16} />
                  </Button>
                )}
              </div>
              {activeSection === "featured" && <ArtistAdder sectionType="featured" />}
            </div>
          </div>

          {/* Producer & Engineer Credit Section */}
          <div className="flex flex-col gap-4 pb-6">
            <div className="flex flex-col gap-4 items-start w-full">
              <div className="flex flex-col items-start gap-3">
                <p className="font-medium text-border-default-secondary">
                  Producer & Engineer Credit
                </p>
                {activeSection !== "producer" && (
                  <Button size="sm" variant="outline" onClick={() => setActiveSection("producer")}>
                    <span className="font-medium text-sm text-default">Add</span>
                    <Plus size={16} />
                  </Button>
                )}
              </div>
              {activeSection === "producer" && <ArtistAdder sectionType="producer" />}
            </div>
          </div>
        </div>

        {/* Form Footer / Action bar */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-auto pt-6 border-t border-default-default/10">
          <p className="font-medium text-default text-sm text-center">
            Please review your release details before clicking &quot;continue&quot;
          </p>
          <Button
            variant="orange"
            onClick={handleContinue}
            disabled={!canContinue}
            className="w-fit"
          >
            <span>Continue</span>
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>

      {/* Right Column: Added Artists Summary Card */}
      <div className="bg-white overflow-hidden relative isolate rounded-30 p-6 md:p-8 flex flex-col">
        <div className="absolute w-full top-0 left right-0 h-1/3 bg-linear-to-r from-[#00F2EA]/50 to-[#8A38F5]/50 -z-10 opacity-25 blur-3xl pointer-events-none"></div>

        {totalAdded === 0 ? (
          <div className="grow flex flex-col items-center justify-center gap-2.5 p-4 text-center">
            <p className="text-xl font-heading font-medium leading-none text-default">
              Artist & Credits
            </p>
            <p className="text-xs font-medium text-border-default-secondary leading-none">
              No artist added yet
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 w-full h-full">
            <div className="flex flex-col gap-2 p-2 border-b border-default-default/10">
              <p className="text-xl font-heading font-medium leading-none text-default">
                Artist & Credits
              </p>
              <p className="text-xs font-medium text-border-default-secondary leading-normal">
                Manage all added artist, producers and Engineers credits. Review, remove or keep.
              </p>
            </div>

            <div className="flex flex-col gap-6 overflow-y-auto max-h-137.5 no-scrollbar">
              {/* Main Artists List */}
              {form.main_artists && form.main_artists.length > 0 && (
                <div className="flex flex-col gap-2">
                  <header className="flex items-center justify-between gap-4 font-medium text-border-default-secondary text-xs px-2">
                    <span>Main Artists</span>
                    <span>{form.main_artists.length} Added</span>
                  </header>
                  <ul className="flex flex-col divide-y divide-default-default/5 bg-page-background/20 rounded-20">
                    {form.main_artists.map((artist) => (
                      <li key={artist.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {artist.image ? (
                            <Image
                              src={artist.image || "/images/avatar.png"}
                              alt={artist.name}
                              width={42}
                              height={42}
                              className="rounded-full object-cover border border-default-default/10"
                            />
                          ) : (
                            <div className="size-10.5 rounded-full flex items-center justify-center bg-page-background">
                              <Icon name="user-sharing" size={27} />
                            </div>
                          )}
                          <div className="flex flex-col items-start gap-0.5">
                            <span className="font-medium text-sm text-default">{artist.name}</span>
                            <span className="text-border-default-secondary text-xs">
                              Main Artist
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {!artist.id.startsWith("custom_") && <SpotifyLogo className="size-7" />}
                          <Button
                            variant="outline"
                            onClick={() => handleRemoveArtist(artist.id, "main")}
                            className="w-fit rounded-full bg-transparent px-4 py-1.5 h-auto text-xs border-default-default/20 hover:bg-default-default/5"
                          >
                            Remove
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Featured Artists List */}
              {form.featured_artists && form.featured_artists.length > 0 && (
                <div className="flex flex-col gap-2">
                  <header className="flex items-center justify-between gap-4 font-medium text-border-default-secondary text-xs px-2">
                    <span>Featured Artists</span>
                    <span>{form.featured_artists.length} Added</span>
                  </header>
                  <ul className="flex flex-col divide-y divide-default-default/5 bg-page-background/20 rounded-20">
                    {form.featured_artists.map((artist) => (
                      <li key={artist.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {artist.image ? (
                            <Image
                              src={artist.image || "/images/avatar.png"}
                              alt={artist.name}
                              width={42}
                              height={42}
                              className="rounded-full object-cover border border-default-default/10"
                            />
                          ) : (
                            <div className="size-10.5 rounded-full flex items-center justify-center bg-page-background">
                              <Icon name="user-sharing" size={27} />
                            </div>
                          )}
                          <div className="flex flex-col items-start gap-0.5">
                            <span className="font-medium text-sm text-default">{artist.name}</span>
                            <span className="text-border-default-secondary text-xs">
                              Featured Artist
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {!artist.id.startsWith("custom_") && <SpotifyLogo className="size-7" />}
                          <Button
                            variant="outline"
                            onClick={() => handleRemoveArtist(artist.id, "featured")}
                            className="w-fit rounded-full bg-transparent px-4 py-1.5 h-auto text-xs border-default-default/20 hover:bg-default-default/5"
                          >
                            Remove
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Producer & Engineer Credits List */}
              {form.producer_credits && form.producer_credits.length > 0 && (
                <div className="flex flex-col gap-2">
                  <header className="flex items-center justify-between gap-4 font-medium text-border-default-secondary text-xs px-2">
                    <span>Producers & Engineers</span>
                    <span>{form.producer_credits.length} Added</span>
                  </header>
                  <ul className="flex flex-col divide-y divide-default-default/5 bg-page-background/20 rounded-20">
                    {form.producer_credits.map((artist) => (
                      <li key={artist.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {artist.image ? (
                            <Image
                              src={artist.image || "/images/avatar.png"}
                              alt={artist.name}
                              width={42}
                              height={42}
                              className="rounded-full object-cover border border-default-default/10"
                            />
                          ) : (
                            <div className="size-10.5 rounded-full flex items-center justify-center bg-page-background">
                              <Icon name="user-sharing" size={27} />
                            </div>
                          )}
                          <div className="flex flex-col items-start gap-0.5">
                            <span className="font-medium text-sm text-default">{artist.name}</span>
                            <span className="text-border-default-secondary text-xs">
                              Producer/Engineer
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {!artist.id.startsWith("custom_") && <SpotifyLogo className="size-7" />}
                          <Button
                            variant="outline"
                            onClick={() => handleRemoveArtist(artist.id, "producer")}
                            className="w-fit rounded-full bg-transparent px-4 py-1.5 h-auto text-xs"
                          >
                            Remove
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddArtistPage;

const SpotifyLogo = ({ className }: { className?: string }) => (
  <svg
    width="42"
    height="42"
    viewBox="0 0 42 42"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="42" height="42" rx="20" fill="black" />
    <g clipPath="url(#clip0_2513_10151)">
      <path
        d="M21 7.875C13.7513 7.875 7.875 13.7514 7.875 21C7.875 28.2491 13.7514 34.125 21 34.125C28.2492 34.125 34.125 28.2491 34.125 21C34.125 13.7519 28.2492 7.87572 20.9998 7.87572L21 7.875ZM27.0189 26.8051C26.7838 27.1907 26.2791 27.3129 25.8936 27.0763C22.812 25.194 18.9327 24.7676 14.3641 25.8114C14.1525 25.8596 13.9305 25.8218 13.7468 25.7063C13.5631 25.5908 13.4329 25.407 13.3846 25.1955C13.3606 25.0908 13.3575 24.9823 13.3754 24.8764C13.3933 24.7705 13.432 24.6691 13.4891 24.5781C13.5463 24.4872 13.6208 24.4083 13.7084 24.3462C13.7961 24.284 13.8951 24.2398 13.9999 24.2159C18.9997 23.0736 23.2882 23.5654 26.7478 25.6798C27.1334 25.9164 27.2556 26.4196 27.0189 26.8051ZM28.6254 23.2314C28.3291 23.7128 27.6991 23.8648 27.218 23.5686C23.69 21.4001 18.3121 20.7721 14.1393 22.0387C13.5981 22.2022 13.0266 21.8972 12.8623 21.3569C12.6993 20.8157 13.0044 20.2452 13.5447 20.0807C18.3112 18.6343 24.237 19.335 28.2885 21.8246C28.7696 22.121 28.9217 22.7509 28.6254 23.2314ZM28.7633 19.5099C24.5332 16.9973 17.5541 16.7662 13.5154 17.9921C12.8668 18.1888 12.1809 17.8226 11.9845 17.1741C11.7879 16.5252 12.1536 15.8398 12.8027 15.6426C17.4388 14.2352 25.1461 14.5072 30.0162 17.3984C30.6008 17.7446 30.792 18.498 30.4456 19.0806C30.1009 19.664 29.3453 19.8563 28.764 19.5099H28.7633Z"
        fill="#1ED760"
      />
    </g>
    <defs>
      <clipPath id="clip0_2513_10151">
        <rect width="26.25" height="26.25" fill="white" transform="translate(7.875 7.875)" />
      </clipPath>
    </defs>
  </svg>
);

const AppleMusicLogo = ({ className }: { className?: string }) => (
  <svg
    width="42"
    className={className}
    height="42"
    viewBox="0 0 42 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="42" height="42" rx="20" fill="#FF0044" />
    <path
      d="M29.7076 10.5092C29.6094 10.4326 29.4949 10.3794 29.3731 10.3537C29.2512 10.3279 29.125 10.3302 29.0042 10.3605L15.8792 13.6417C15.7017 13.6861 15.5442 13.7885 15.4316 13.9327C15.319 14.0769 15.2578 14.2545 15.2578 14.4375V25.7249C14.5735 25.2677 13.756 25.0523 12.9353 25.1129C12.1145 25.1735 11.3375 25.5066 10.7278 26.0594C10.118 26.6121 9.71046 27.3528 9.56988 28.1637C9.4293 28.9746 9.56374 29.8093 9.95184 30.535C10.3399 31.2608 10.9594 31.836 11.7119 32.1694C12.4644 32.5027 13.3067 32.575 14.105 32.3748C14.9033 32.1746 15.6118 31.7134 16.1179 31.0644C16.624 30.4154 16.8987 29.6159 16.8984 28.7929V15.0783L28.3828 12.2072V22.4437C27.6985 21.9865 26.881 21.771 26.0603 21.8316C25.2395 21.8922 24.4625 22.2254 23.8528 22.7781C23.243 23.3309 22.8355 24.0716 22.6949 24.8825C22.5543 25.6934 22.6887 26.528 23.0768 27.2538C23.4649 27.9795 24.0844 28.5548 24.8369 28.8881C25.5894 29.2214 26.4317 29.2938 27.23 29.0936C28.0283 28.8934 28.7368 28.4321 29.2429 27.7832C29.749 27.1342 30.0237 26.3347 30.0234 25.5117V11.1562C30.0235 11.0314 29.995 10.9083 29.9403 10.7962C29.8856 10.6841 29.806 10.5859 29.7076 10.5092Z"
      fill="white"
    />
  </svg>
);

const ArtistAdder = ({ sectionType }: { sectionType: "main" | "featured" | "producer" }) => {
  const { form, setForm } = useNewReleaseStore();
  const [artistName, setArtistName] = useState("");
  const [customInputEnabled, setCustomInputEnabled] = useState(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [spotifyLinked, setSpotifyLinked] = useState(false);
  const [appleLinked, setAppleLinked] = useState(false);

  const handleSaveCustom = () => {
    if (!artistName.trim()) {
      goeyToast.error("Artist Name Required", {
        description: "Please enter a valid legal name",
      });
      return;
    }

    const newArtist: Artist = {
      id: "custom_" + Date.now(),
      name: artistName.trim(),
      location: "Custom Artist",
      image: "",
    };

    const currentList =
      sectionType === "main"
        ? form.main_artists
        : sectionType === "featured"
          ? form.featured_artists
          : form.producer_credits;

    const updated = [...(currentList || []), newArtist];

    if (sectionType === "main") {
      setForm({ main_artists: updated });
    } else if (sectionType === "featured") {
      setForm({ featured_artists: updated });
    } else {
      setForm({ producer_credits: updated });
    }

    // Reset fields
    setArtistName("");
    setCustomInputEnabled(false);
    setSpotifyLinked(false);
    setAppleLinked(false);
    goeyToast.success("Custom artist saved successfully");
  };

  const handleSelectArtist = (artist: Artist) => {
    const currentList =
      sectionType === "main"
        ? form.main_artists
        : sectionType === "featured"
          ? form.featured_artists
          : form.producer_credits;

    const updated = [...(currentList || []), artist];

    if (sectionType === "main") {
      setForm({ main_artists: updated });
    } else if (sectionType === "featured") {
      setForm({ featured_artists: updated });
    } else {
      setForm({ producer_credits: updated });
    }

    setIsSelectModalOpen(false);
    goeyToast.success(`${artist.name} selected successfully`);
  };

  const labelText =
    sectionType === "main"
      ? "Add Custom Main Artist (if not your label artist)"
      : sectionType === "featured"
        ? "Add Custom Featured Artist"
        : "Add Custom Producer & Engineer";

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="bg-page-background/70 p-4 gap-4 rounded-20 flex flex-col md:flex-row md:items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <div className="size-10.5 flex-none rounded-10 bg-brand-purple-2/12 flex items-center justify-center">
            <Star size={27} className="text-brand-purple-2" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-medium text-sm leading-none text-default">
              {sectionType === "main"
                ? "Record Label Main Artist"
                : sectionType === "featured"
                  ? "Record Label Featured Artist"
                  : "Record Label Producer/Engineer"}
            </p>
            <p className="font-medium text-xs text-border-default-secondary leading-none">
              This is the name your music appears under on Spotify, Apple Music and other stores.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 shrink-0 grow">
          <Image
            src="/images/avatar.png"
            alt="avatar"
            width={24}
            height={24}
            className="bg-[#C7FFB3] rounded-10"
          />
          <SelectArtist
            open={isSelectModalOpen}
            onOpenChange={setIsSelectModalOpen}
            onSelectArtist={handleSelectArtist}
            onAddArtistOutside={() => {
              setIsSelectModalOpen(false);
              setCustomInputEnabled(true);
            }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-default">{labelText}</label>
        <span className="text-xs text-default-tertiary font-medium leading-normal">
          NOTE: Version information such as Remix or Uncut should not be included in tha main Title
          field. Use the Version box instead.
        </span>
        <input
          type="text"
          disabled={!customInputEnabled}
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          placeholder="Enter main artist Legal Name"
          className="w-full rounded-xl disabled:bg-default-secondary border border-default-default disabled:text-default-tertiary px-4 py-4.5 text-sm font-medium outline-none focus:border-brand-orange transition-colors"
        />
      </div>
      <div className="bg-[#FFFBEB] flex flex-col gap-2.5 rounded-20 p-4">
        <p className="font-medium text-sm text-brand-orange leading-none">Quick One</p>
        <p className="font-medium text-sm text-default leading-normal">
          Once an artist&apos;s name and ID have been submitted, Apple does not permit revisions.
          Before saving, confirm that these are accurate.
        </p>
      </div>
      <div className="flex flex-col gap-6 p-4">
        <div className="flex gap-2.5 items-center justify-between max-w-105.5 w-full">
          <div className="flex gap-2.5 items-center">
            <SpotifyLogo className="size-8" />
            <div className="flex flex-col">
              <span className="font-medium text-sm text-default">Existing artist on Spotify?</span>
              <p className="text-xs text-border-default-secondary font-medium">
                Does this artist have existing music on Spotify? *
              </p>
            </div>
          </div>
          <Switch
            checked={spotifyLinked}
            onCheckedChange={setSpotifyLinked}
            disabled={!customInputEnabled}
          />
        </div>
        <div className="flex gap-2.5 items-center justify-between max-w-105.5 w-full">
          <div className="flex gap-2.5 items-center">
            <AppleMusicLogo className="size-8" />
            <div className="flex flex-col">
              <span className="font-medium text-sm text-default">
                Existing artist on Apple Music?
              </span>
              <p className="text-xs text-border-default-secondary font-medium">
                Does this artist have existing music on Apple Music? *
              </p>
            </div>
          </div>
          <Switch
            checked={appleLinked}
            onCheckedChange={setAppleLinked}
            disabled={!customInputEnabled}
          />
        </div>
      </div>
      <div className="flex justify-end py-4">
        <button
          onClick={handleSaveCustom}
          disabled={!customInputEnabled}
          className="px-5 py-2.5 rounded-full bg-[#EBFFEE] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2.5 transition-opacity"
        >
          <span className="font-medium text-sm text-default">Save</span>
          <ChevronRight size={24} className="text-[#009951]" />
        </button>
      </div>
    </div>
  );
};

function GridSkeleton() {
  return (
    <div className="grid grid-cols-5 gap-y-8 gap-x-6 px-8 py-6">
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-3 animate-pulse">
          <div className="size-20 bg-default-default/10 rounded-full" />
          <div className="h-4 w-16 bg-default-default/10 rounded-sm" />
          <div className="h-3.5 w-12 bg-default-default/10 rounded-sm" />
        </div>
      ))}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-12 gap-y-8 px-8 py-6">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="size-16 bg-default-default/10 rounded-full" />
          <div className="flex flex-col gap-2">
            <div className="h-4 w-24 bg-default-default/10 rounded-sm" />
            <div className="h-3.5 w-16 bg-default-default/10 rounded-sm" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ArtistList({
  viewMode,
  searchQuery,
  onSelectArtist,
}: {
  viewMode: string;
  searchQuery: string;
  onSelectArtist: (artist: Artist) => void;
}) {
  const { form } = useNewReleaseStore();
  const allArtists = use(getArtistsPromise(searchQuery));

  const allAdded = [
    ...(form.main_artists || []),
    ...(form.featured_artists || []),
    ...(form.producer_credits || []),
  ];

  const filtered = allArtists.filter(
    (a) =>
      !allAdded.some((added) => added.id === a.id) &&
      (a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.location.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(95px,1fr))] gap-4 p-6">
        {filtered.map((artist) => (
          <div
            key={artist.id}
            onClick={() => onSelectArtist(artist)}
            className="w-fit flex flex-col items-center text-center gap-1.5 group cursor-pointer"
          >
            <div className="relative size-20 rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-105 border border-default-default/10">
              <Image
                src={artist.image}
                alt={artist.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <p className="font-semibold text-sm text-default mt-1.5 leading-none">{artist.name}</p>
            <p className="text-xs text-border-default-secondary font-medium leading-none">
              {artist.location}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-12 gap-y-8 px-8 py-6">
      {filtered.map((artist) => (
        <div
          key={artist.id}
          onClick={() => onSelectArtist(artist)}
          className="flex items-center gap-4 group cursor-pointer"
        >
          <div className="relative size-16 rounded-full overflow-hidden shrink-0 transition-transform duration-300 group-hover:scale-105 border border-default-default/10">
            <Image
              src={artist.image}
              alt={artist.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-sm text-default leading-none">{artist.name}</p>
            <p className="text-xs text-border-default-secondary font-medium leading-none">
              {artist.location}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

const SelectArtist = ({
  open,
  onOpenChange,
  onSelectArtist,
  onAddArtistOutside,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectArtist: (artist: Artist) => void;
  onAddArtistOutside: () => void;
}) => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button className="rounded-10 px-3 py-2 bg-brand-purple-2 text-white font-medium text-xs whitespace-nowrap flex items-center gap-2">
          <span>Select Artist</span>
          <ArrowUpRight size={24} />
        </button>
      </DialogTrigger>
      <DialogContent className="gap-0 max-w-150 w-full p-0 overflow-hidden" showCloseButton={false}>
        <VisuallyHidden.Root>
          <DialogHeader>
            <DialogTitle>Select Artist</DialogTitle>
            <DialogDescription>Select an artist from the list below.</DialogDescription>
          </DialogHeader>
        </VisuallyHidden.Root>

        <div className="absolute w-full top-0 left-0 right-0 h-40 bg-linear-to-r from-[#9747FF] to-[#FFC107] -z-10 opacity-20 blur-3xl pointer-events-none"></div>

        <header className="px-6 pt-6 pb-2 flex gap-6 items-center">
          <div className="flex items-center grow gap-2.5 px-4 py-3 bg-white/20 rounded-full border border-default-default/10">
            <Search size={16} className="text-default-tertiary" />
            <input
              placeholder="Search Artist"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none w-full text-sm font-medium placeholder:text-border-default-secondary/75"
            />
          </div>
          <div className="flex items-center px-4 py-3 gap-2 bg-white rounded-full">
            <button
              onClick={() => setViewMode("grid")}
              className={`${viewMode === "grid" ? "text-default" : "text-border-default-secondary"}`}
            >
              <Icon name="circles-four" size={18} />
            </button>
            <span className="w-px h-4 bg-default-default/20" />
            <button
              onClick={() => setViewMode("list")}
              className={`${viewMode === "list" ? "text-default" : "text-border-default-secondary"}`}
            >
              <List size={18} />
            </button>
          </div>
          <DialogClose className="p-2 rounded-full hover:bg-default-default/10 transition-colors">
            <X size={16} className="text-default" />
          </DialogClose>
        </header>

        <header className="px-8 py-3 border-b border-default-default/5">
          <span className="text-default text-sm font-semibold">Select Artist</span>
        </header>

        <div className="relative">
          <div className="max-h-120 min-h-87.5 overflow-y-auto relative pb-20 no-scrollbar">
            <Suspense fallback={viewMode === "grid" ? <GridSkeleton /> : <ListSkeleton />}>
              <ArtistList
                viewMode={viewMode}
                searchQuery={searchQuery}
                onSelectArtist={onSelectArtist}
              />
            </Suspense>
          </div>
          {/* Floating Add artist outside button */}
          <div className="absolute bottom-6 right-6 flex justify-end">
            <Button variant="outline" onClick={onAddArtistOutside} className="bg-white">
              Add artist outside
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
