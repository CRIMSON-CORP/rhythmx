"use client";

import { DialogClose } from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Funnel, X, Search as SearchIcon } from "lucide-react";

type SearchResult = {
  id: string;
  title: string;
  type: string;
  platforms: string;
  image: string;
};

const DUMMY_RECENT_SEARCHES: SearchResult[] = [
  {
    id: "1",
    title: "Standing B4 Him",
    type: "Single",
    platforms: "Apple Music. Spotify. Deezer",
    image: "/images/release-1.png",
  },
  {
    id: "2",
    title: "Dancing in the Rain",
    type: "Duet",
    platforms: "Amazon Music. YouTube Music. Tidal",
    image: "/images/release-2.png",
  },
  {
    id: "3",
    title: "Lost in the Echo",
    type: "Cover",
    platforms: "SoundCloud. Pandora. iHeartRadio",
    image: "/images/release-3.png",
  },
];

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) {
      return JSON.parse(stored) as SearchResult[];
    }
    return DUMMY_RECENT_SEARCHES;
  });

  const removeSearch = (id: string) => {
    const updated = recentSearches.filter((s) => s.id !== id);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  return (
    <>
      <header className="px-6 pt-6 flex gap-6 items-center">
        <div className="flex items-center grow gap-2.5 px-4 py-3 bg-white/20 rounded-full">
          <SearchIcon size={16} className="text-default-tertiary" />
          <input
            placeholder="Search anything"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none w-full text-border-default-secondary"
          />
        </div>
        <button>
          <Funnel size={24} className="text-brand-orange" />
        </button>
        <DialogClose>
          <X size={24} className="text-default" />
        </DialogClose>
      </header>
      <div className="p-6 flex flex-col gap-4">
        {recentSearches.length > 0 && !searchQuery && (
          <div className="flex flex-col gap-4">
            <span className="text-default text-sm font-medium">Recent Search</span>
            <div className="flex flex-col gap-6 mt-2">
              <AnimatePresence mode="popLayout">
                {recentSearches.map((search) => (
                  <motion.div
                    key={search.id}
                    exit={{ opacity: 0, scale: 0.5 }}
                    layout="y"
                    className="flex items-center gap-4 group"
                  >
                    <Image
                      src={search.image}
                      alt={search.title}
                      width={56}
                      height={56}
                      className="rounded-full size-14 object-cover"
                    />
                    <div className="flex flex-col grow">
                      <span className="font-medium text-lg">{search.title}</span>
                      <div className="flex items-center gap-2 text-sm mt-0.5">
                        <span className="text-default-tertiary font-medium text-xs">
                          {search.type}
                        </span>
                        <span className="text-border-default-secondary text-xs">
                          {search.platforms}
                        </span>
                      </div>
                    </div>
                    <button className="self-start" onClick={() => removeSearch(search.id)}>
                      <X size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Search;
