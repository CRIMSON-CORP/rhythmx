"use client";

import { cn } from "@/lib/utils";
import { Check, Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { goeyToast } from "goey-toast";
import ContinueButton from "../../ContinueButton";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";

function ChoosePlatforms({
  release_id,
  releasePlatforms,
  initialSelectedPlatformIds,
}: {
  release_id: string;
  releasePlatforms: Platform[];
  initialSelectedPlatformIds: number[];
}) {
  const [selectedPlatformIds, setSelectedPlatformIds] = useState<number[]>(
    initialSelectedPlatformIds,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  const filteredDistribution = releasePlatforms.filter((p) =>
    p.name.toLowerCase().replace("-", " ").includes(searchQuery.toLowerCase().trim()),
  );

  const visiblePlatformIds = Array.from(new Set([...filteredDistribution.map((p) => p.id)]));

  const isAllSelected =
    visiblePlatformIds.length > 0 &&
    visiblePlatformIds.every((id) => selectedPlatformIds.includes(id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedPlatformIds([]);
    } else {
      setSelectedPlatformIds(visiblePlatformIds);
    }
  };

  const togglePlatform = (platformId: number) => {
    const nextPlatforms = selectedPlatformIds.includes(platformId)
      ? selectedPlatformIds.filter((id) => id !== platformId)
      : [...selectedPlatformIds, platformId];
    setSelectedPlatformIds(nextPlatforms);
  };

  const isStepValid = selectedPlatformIds.length > 0;

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      await api.put(API_ROUTES.RELEASES.DRAFT.PLATFORMS(release_id), {
        platform_ids: selectedPlatformIds,
      });
      goeyToast.success("Platforms selected successfully");
      router.push(`/discography/release/draft/${release_id}/split-royalty`);
    } catch (error) {
      goeyToast.error((error as Error).message);
    } finally {
      setIsLoading(false);
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
              <AnimatePresence initial={false}>
                {filteredDistribution.length === 0 && searchQuery ? (
                  <p className="text-sm font-medium text-border-default-secondary py-2">
                    No distribution platforms match your search.
                  </p>
                ) : (
                  filteredDistribution.map((platform) => (
                    <motion.div
                      key={platform.id + "-filter"}
                      layout="position"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", damping: 20, stiffness: 200 }}
                      layoutId={`platform-${platform.id}-filter`}
                      onClick={() => togglePlatform(platform.id)}
                      className={cn(
                        "relative flex items-center justify-between outline outline-default-default min-h-29.25 bg-white rounded-20 p-10 cursor-pointer",
                        selectedPlatformIds.includes(platform.id) && "outline-brand-blue",
                      )}
                    >
                      {platform.logo_url ? (
                        <Image
                          src={platform.logo_url}
                          alt={platform.name}
                          width={100}
                          height={100}
                          className="w-25 h-auto object-contain"
                        />
                      ) : (
                        <span className="text-center font-bold text-default text-2xl">
                          {platform.name}
                        </span>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlatform(platform.id);
                        }}
                        className={cn(
                          "size-5 absolute top-3 right-3 rounded-full outline outline-default-default flex items-center justify-center transition-colors",
                          selectedPlatformIds.includes(platform.id)
                            ? "bg-brand-blue outline-brand-blue text-white"
                            : "bg-transparent text-transparent hover:bg-page-background/50",
                        )}
                      >
                        <Check size={14} />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
          <p className="font-medium text-default text-center text-sm">
            Do review your release details before clicking “continue”
          </p>
          <ContinueButton disabled={!isStepValid} pending={isLoading} onClick={handleContinue} />
        </div>
      </div>

      {/* Right Column: Track Edit Panel or Placeholder */}
      <div className="relative max-lg:row-start-1  isolate bg-white rounded-30 overflow-hidden flex flex-col gap-8 items-center justify-center p-6">
        <div className="absolute w-full top-0 left right-0 h-1/3 bg-linear-to-r from-[#9747FF]/50 to-[#0066FF]/50 -z-10 opacity-25 blur-3xl"></div>
        <motion.div
          layout="position"
          className="flex flex-col items-center justify-center gap-2.5 p-4 text-center"
        >
          <p className="text-xl font-heading font-medium leading-none text-default">
            Selected Platforms
          </p>
          <p className="text-xs font-medium text-border-default-secondary leading-none max-w-93.25">
            Your release will be available on this platforms, please do review before submitting
            your new release.
          </p>
        </motion.div>

        <div className="w-full max-h-[60vh] overflow-y-auto no-scrollbar pb-6">
          <div className="flex flex-wrap gap-4 p-1 w-full">
            <AnimatePresence mode="popLayout">
              {selectedPlatformIds.map((id) => {
                const platform = releasePlatforms.find((p) => p.id === id);
                if (!platform) return null;

                return (
                  <motion.div
                    key={platform.id + "-selected"}
                    layout="position"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", damping: 20, stiffness: 200 }}
                    layoutId={`platform-${platform.id}-selected`}
                    onClick={() => togglePlatform(platform.id)}
                    className="relative flex items-center justify-center min-h-24 bg-white rounded-20 p-6 cursor-pointer"
                  >
                    {platform.logo_url ? (
                      <Image
                        src={platform.logo_url}
                        alt={platform.name}
                        width={80}
                        height={20}
                        className="w-20 h-auto object-contain"
                      />
                    ) : (
                      <span className="text-center font-bold text-default text-4xl">
                        {platform.name}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChoosePlatforms;
