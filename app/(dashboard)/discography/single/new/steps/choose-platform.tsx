"use client";

import { Button } from "@/components/ui/button";
import { distributionPlatforms, socialMediaPlatforms } from "@/data/platforms";
import { cn } from "@/lib/utils";
import useNewReleaseStore from "@/store/new-release-store";
import { ArrowRight, Check, Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

function ChoosePlatform() {
  const { form, setForm, next } = useNewReleaseStore();
  const [searchQuery, setSearchQuery] = useState("");

  const selectedPlatforms = form.platforms || [];

  const filteredDistribution = distributionPlatforms.filter((p) =>
    p.id.toLowerCase().replace("-", " ").includes(searchQuery.toLowerCase().trim()),
  );
  const filteredSocial = socialMediaPlatforms.filter((p) =>
    p.id.toLowerCase().replace("-", " ").includes(searchQuery.toLowerCase().trim()),
  );

  const visiblePlatformIds = Array.from(
    new Set([...filteredDistribution.map((p) => p.id), ...filteredSocial.map((p) => p.id)]),
  );

  const isAllSelected =
    visiblePlatformIds.length > 0 &&
    visiblePlatformIds.every((id) => selectedPlatforms.includes(id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      setForm({
        platforms: selectedPlatforms.filter((id) => !visiblePlatformIds.includes(id)),
      });
    } else {
      setForm({
        platforms: Array.from(new Set([...selectedPlatforms, ...visiblePlatformIds])),
      });
    }
  };

  const togglePlatform = (platformId: string) => {
    const nextPlatforms = selectedPlatforms.includes(platformId)
      ? selectedPlatforms.filter((id) => id !== platformId)
      : [...selectedPlatforms, platformId];
    setForm({ platforms: nextPlatforms });
  };

  const isStepValid = selectedPlatforms.length > 0;

  const handleContinue = () => {
    if (isStepValid) {
      next();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[0.55fr_0.45fr] gap-8 items-stretch pb-10">
      {/* Left Column: Form Fields Card */}
      <div className="flex flex-col gap-4 p-6 bg-white rounded-30">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="font-medium leading-none text-border-default-secondary">
            Distribution Platforms
          </p>
          <div className="flex items-center grow gap-2.5 px-4 py-3 bg-page-background rounded-full max-w-89.25">
            <Search size={16} className="text-default-tertiary" />
            <input
              placeholder="Search Platform"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none w-full text-sm font-medium placeholder:text-border-default-secondary/75"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-2.5 group cursor-pointer bg-transparent border-0 outline-none"
          >
            <span className="font-medium text-border-default-secondary select-none">
              Select All
            </span>
            <div
              className={cn(
                "size-4.5 rounded-full outline outline-default-default flex items-center justify-center transition-colors",
                isAllSelected
                  ? "bg-brand-blue outline-brand-blue text-white"
                  : "bg-transparent text-transparent hover:bg-page-background/50",
              )}
            >
              <Check size={14} />
            </div>
          </button>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-1 flex flex-col gap-4 no-scrollbar">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-6">
              {filteredDistribution.length === 0 && searchQuery ? (
                <p className="text-sm font-medium text-border-default-secondary py-2">
                  No distribution platforms match your search.
                </p>
              ) : (
                filteredDistribution.map((platform) => (
                  <div
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={cn(
                      "relative flex items-center justify-between outline outline-default-default min-h-29.25 bg-white rounded-20 p-10 cursor-pointer transition-all hover:scale-[1.01]",
                      selectedPlatforms.includes(platform.id) && "outline-brand-blue",
                    )}
                  >
                    <Image src={platform.logo} alt={platform.id} width={100} height={25} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlatform(platform.id);
                      }}
                      className={cn(
                        "size-5 absolute top-3 right-3 rounded-full outline outline-default-default flex items-center justify-center transition-colors",
                        selectedPlatforms.includes(platform.id)
                          ? "bg-brand-blue outline-brand-blue text-white"
                          : "bg-transparent text-transparent hover:bg-page-background/50",
                      )}
                    >
                      <Check size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
            <p className="font-medium leading-none text-border-default-secondary">
              Social Media Platforms
            </p>
            <div className="flex flex-wrap gap-6">
              {filteredSocial.length === 0 && searchQuery ? (
                <p className="text-sm font-medium text-border-default-secondary py-2">
                  No social platforms match your search.
                </p>
              ) : (
                filteredSocial.map((platform) => (
                  <div
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={cn(
                      "relative flex items-center justify-between outline outline-default-default min-h-29.25 bg-white rounded-20 p-10 cursor-pointer transition-all hover:scale-[1.01]",
                      selectedPlatforms.includes(platform.id) && "outline-brand-blue",
                    )}
                  >
                    <Image src={platform.logo} alt={platform.id} width={100} height={25} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlatform(platform.id);
                      }}
                      className={cn(
                        "size-5 absolute top-3 right-3 rounded-full outline outline-default-default flex items-center justify-center transition-colors",
                        selectedPlatforms.includes(platform.id)
                          ? "bg-brand-blue outline-brand-blue text-white"
                          : "bg-transparent text-transparent hover:bg-page-background/50",
                      )}
                    >
                      <Check size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
          <p className="font-medium text-default text-center text-sm">
            Do review your release details before clicking “continue”
          </p>
          <Button
            variant="orange"
            onClick={handleContinue}
            disabled={!isStepValid}
            className="w-fit"
          >
            <span>Continue</span>
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>

      {/* Right Column: Track Edit Panel or Placeholder */}
      <div className="relative max-lg:row-start-1  isolate bg-white rounded-30 overflow-hidden flex flex-col gap-8 items-center justify-center p-6">
        <div className="absolute w-full top-0 left right-0 h-1/3 bg-linear-to-r from-[#9747FF]/50 to-[#0066FF]/50 -z-10 opacity-25 blur-3xl"></div>
        <div className="flex flex-col items-center justify-center gap-2.5 p-4 text-center">
          <p className="text-xl font-heading font-medium leading-none text-default">
            Selected Platforms
          </p>
          <p className="text-xs font-medium text-border-default-secondary leading-none max-w-93.25">
            Your release will be available on this platforms, please do review before submitting
            your new release.
          </p>
        </div>

        <div className="max-h-[60vh] overflow-y-auto no-scrollbar pb-6">
          <div className="flex flex-wrap gap-4 p-1">
            {selectedPlatforms.map((id) => {
              const platform =
                distributionPlatforms.find((p) => p.id === id) ||
                socialMediaPlatforms.find((p) => p.id === id);
              if (!platform) return null;

              return (
                <div
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className="relative flex items-center justify-center outline outline-brand-blue min-h-24 bg-white rounded-20 p-6 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <Image
                    src={platform.logo}
                    alt={platform.id}
                    width={80}
                    height={20}
                    className="object-contain"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlatform(platform.id);
                    }}
                    className="size-5 absolute top-2.5 right-2.5 rounded-full bg-brand-blue outline outline-brand-blue text-white flex items-center justify-center transition-colors"
                  >
                    <Check size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChoosePlatform;
