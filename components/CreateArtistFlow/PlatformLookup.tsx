"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

export interface MatchedPlatformArtist {
  id: string;
  name: string;
  avatar: string;
  platform: "spotify" | "apple";
}

interface PlatformLookupProps {
  platform: "spotify" | "apple";
  label: string;
  placeholder: string;
  helperText: string;
  value: string;
  fallbackArtistName?: string;
  fallbackAvatar?: string;
  onChange: (value: string) => void;
  error?: string;
}

// Dummy lookup service simulating async platform API
async function mockFetchPlatformMatches(
  query: string,
  platform: "spotify" | "apple",
  fallbackName?: string,
  fallbackAvatar?: string,
): Promise<MatchedPlatformArtist[]> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (!query.trim()) return [];

  return [
    {
      id: query.trim(),
      name: fallbackName && fallbackName.trim().length > 0 ? fallbackName : "Taylor Swift",
      avatar:
        fallbackAvatar && fallbackAvatar.trim().length > 0 ? fallbackAvatar : "/images/avatar.png",
      platform,
    },
  ];
}

export function PlatformLookup({
  platform,
  label,
  placeholder,
  helperText,
  value,
  fallbackArtistName,
  fallbackAvatar,
  onChange,
  error,
}: PlatformLookupProps) {
  const [inputValue, setInputValue] = useState(value);
  const [matches, setMatches] = useState<MatchedPlatformArtist[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchedPlatformArtist | null>(
    value
      ? {
          id: value,
          name: fallbackArtistName || "Taylor Swift",
          avatar: fallbackAvatar || "/images/avatar.png",
          platform,
        }
      : null,
  );
  const [isLoading, setIsLoading] = useState(false);

  // Sync internal input when external value changes
  useEffect(() => {
    setInputValue(value);
    if (!value) {
      setSelectedMatch(null);
      setMatches([]);
    }
  }, [value]);

  // Debounced search
  useEffect(() => {
    if (!inputValue.trim()) {
      setMatches([]);
      setIsLoading(false);
      return;
    }

    // If already selected this exact ID, keep selection and don't re-query
    if (selectedMatch && selectedMatch.id === inputValue.trim()) {
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const results = await mockFetchPlatformMatches(
          inputValue,
          platform,
          fallbackArtistName,
          fallbackAvatar,
        );
        setMatches(results);
      } catch (err) {
        console.error("Platform lookup error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue, platform, fallbackArtistName, fallbackAvatar, selectedMatch]);

  const handleAdd = (artist: MatchedPlatformArtist) => {
    setSelectedMatch(artist);
    onChange(artist.id);
  };

  const handleRemove = () => {
    setSelectedMatch(null);
    setMatches([]);
    setInputValue("");
    onChange("");
  };

  return (
    <Field className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {platform === "spotify" ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 0C3.58175 0 0 3.58181 0 8C0 12.4185 3.58181 16 8 16C12.4186 16 16 12.4185 16 8C16 3.58213 12.4186 0.0004375 7.99988 0.0004375L8 0ZM11.6687 11.5384C11.5254 11.7734 11.2177 11.8479 10.9827 11.7036C9.10444 10.5563 6.73994 10.2964 3.95525 10.9327C3.8263 10.962 3.69096 10.939 3.57901 10.8686C3.46706 10.7982 3.38765 10.6862 3.35825 10.5573C3.34361 10.4934 3.3417 10.4273 3.35263 10.3628C3.36356 10.2982 3.38711 10.2364 3.42194 10.181C3.45677 10.1255 3.5022 10.0775 3.55562 10.0396C3.60903 10.0017 3.6694 9.97472 3.73325 9.96019C6.78075 9.26394 9.39469 9.56369 11.5034 10.8524C11.7384 10.9967 11.8129 11.3034 11.6687 11.5384ZM12.6479 9.36006C12.4672 9.6535 12.0833 9.74619 11.79 9.56563C9.63963 8.24388 6.36169 7.86106 3.81825 8.63313C3.48837 8.73275 3.14 8.54688 3.03988 8.21756C2.9405 7.88769 3.1265 7.53994 3.45581 7.43969C6.36112 6.55806 9.973 6.98513 12.4425 8.50263C12.7358 8.68325 12.8284 9.06719 12.6479 9.36006ZM12.7319 7.09175C10.1536 5.56025 5.89962 5.41937 3.43794 6.16663C3.04262 6.2865 2.62456 6.06331 2.50481 5.668C2.385 5.2725 2.60794 4.85475 3.00356 4.73456C5.82938 3.87669 10.5271 4.0425 13.4956 5.80475C13.8519 6.01575 13.9684 6.475 13.7573 6.83006C13.5472 7.18569 13.0867 7.30288 12.7323 7.09175H12.7319Z"
              fill="#1ED760"
            />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.9557 4.99103C15.9557 4.80044 15.9557 4.60986 15.9548 4.41928C15.9539 4.25884 15.9521 4.09839 15.9477 3.93795C15.9384 3.58825 15.9176 3.2359 15.8555 2.89019C15.7926 2.53917 15.6893 2.21252 15.5271 1.89341C15.2056 1.26265 14.6927 0.749876 14.0618 0.428587C13.7432 0.266371 13.4165 0.163546 13.0659 0.100166C12.7202 0.0381163 12.3674 0.0172853 12.0177 0.00797784C11.8573 0.00354571 11.6968 0.00177285 11.5364 0.000886427C11.3458 0 11.1552 0 10.9647 0H4.99102C4.80044 0 4.60986 0 4.41928 0.000886427C4.25884 0.00177285 4.09839 0.00354571 3.93795 0.00797784C3.58825 0.0177285 3.23546 0.0381163 2.88975 0.100609C2.53873 0.163546 2.21252 0.266814 1.89385 0.429031C1.263 0.750319 0.750066 1.26309 0.428587 1.89385C0.266371 2.21296 0.163102 2.53961 0.100166 2.89064C0.0381163 3.23634 0.0172853 3.58914 0.00797784 3.93839C0.00354571 4.09884 0.00177285 4.25928 0.000886427 4.41972C0 4.60986 0 4.80044 0 4.99103V10.9642C0 11.1548 0 11.3454 0.000886427 11.536C0.00177285 11.6964 0.00354571 11.8568 0.00797784 12.0173C0.0172853 12.367 0.0381163 12.7193 0.100166 13.065C0.163102 13.4161 0.266371 13.7427 0.428587 14.0618C0.750066 14.6926 1.263 15.2054 1.89385 15.5266C2.21252 15.6889 2.53917 15.7917 2.88975 15.8551C3.23546 15.9171 3.58825 15.938 3.93795 15.9473C4.09839 15.9517 4.25884 15.9535 4.41928 15.9543C4.60986 15.9557 4.80044 15.9552 4.99102 15.9552H10.9642C11.1548 15.9552 11.3454 15.9552 11.536 15.9543C11.6964 15.9535 11.8568 15.9517 12.0173 15.9473C12.367 15.938 12.7198 15.9171 13.0655 15.8551C13.4165 15.7921 13.7427 15.6889 14.0614 15.5266C14.6922 15.2054 15.2052 14.6926 15.5266 14.0618C15.6889 13.7427 15.7921 13.4161 15.8551 13.065C15.9171 12.7193 15.9379 12.3665 15.9473 12.0173C15.9517 11.8568 15.9535 11.6964 15.9543 11.536C15.9557 11.3454 15.9552 11.1548 15.9552 10.9642V4.99103H15.9557Z"
              fill="url(#paint0_linear_5119_49760)"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.2797 2.4375C11.2412 2.44104 10.8986 2.50176 10.8573 2.51018L6.11496 3.46708L6.11319 3.46752C5.98953 3.49367 5.89247 3.53755 5.81756 3.60049C5.72715 3.67628 5.67707 3.78354 5.65801 3.90852C5.65402 3.93511 5.64737 3.98919 5.64737 4.06896V10.0045C5.64737 10.1432 5.63629 10.2779 5.54233 10.3927C5.44837 10.5075 5.33225 10.5421 5.19618 10.5696L4.88637 10.6321C4.49457 10.711 4.23973 10.7646 4.00881 10.8541C3.78809 10.9397 3.62277 11.0487 3.49114 11.187C3.23009 11.4604 3.12416 11.8314 3.1605 12.1789C3.19153 12.4754 3.32493 12.759 3.55407 12.9687C3.70876 13.1105 3.902 13.2182 4.12981 13.2639C4.36604 13.3113 4.61779 13.2949 4.98565 13.2204C5.18155 13.181 5.36504 13.1194 5.53967 13.0161C5.71252 12.9142 5.86056 12.7781 5.97623 12.6123C6.09236 12.4461 6.16726 12.2613 6.20848 12.065C6.25103 11.8624 6.26122 11.6794 6.26122 11.4773V6.32935C6.26122 6.05367 6.33923 5.98099 6.56172 5.92691C6.56172 5.92691 10.5037 5.13179 10.6876 5.09589C10.9442 5.04669 11.0652 5.11982 11.0652 5.38885V8.90309C11.0652 9.04226 11.0639 9.1832 10.969 9.29844C10.8751 9.41323 10.7589 9.4478 10.6229 9.47528L10.3131 9.53777C9.92128 9.61666 9.66643 9.67029 9.43551 9.75982C9.21479 9.84536 9.04948 9.95439 8.91784 10.0927C8.65679 10.3661 8.54155 10.7371 8.5779 11.0846C8.60892 11.3811 8.75164 11.6648 8.98078 11.8744C9.13546 12.0162 9.3287 12.1208 9.55651 12.1669C9.79274 12.2143 10.0445 12.1975 10.4124 12.1235C10.6083 12.084 10.7917 12.0251 10.9664 11.9218C11.1392 11.8199 11.2873 11.6838 11.4029 11.5181C11.5191 11.3518 11.594 11.167 11.6352 10.9707C11.6777 10.7681 11.6795 10.5851 11.6795 10.383V2.85678C11.6804 2.58376 11.5363 2.41534 11.2797 2.4375Z"
              fill="white"
            />
            <defs>
              <linearGradient
                id="paint0_linear_5119_49760"
                x1="7.97784"
                y1="15.8939"
                x2="7.97784"
                y2="0.343889"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FA233B" />
                <stop offset="1" stopColor="#FB5C74" />
              </linearGradient>
            </defs>
          </svg>
        )}
        <FieldLabel className="font-medium text-sm text-default">{label}</FieldLabel>
      </div>

      <input
        type="text"
        value={inputValue}
        placeholder={placeholder}
        onChange={(e) => {
          setInputValue(e.target.value);
          if (!e.target.value.trim()) {
            onChange("");
            setSelectedMatch(null);
          }
        }}
        className="w-full bg-white outline outline-default-default p-3.5 px-5 rounded-full text-sm text-default font-normal placeholder:text-black/35 focus:outline-brand-orange transition-all"
      />
      <p className="text-xs text-black/40 px-1">{helperText}</p>

      {/* Selected match or active lookup results */}
      {selectedMatch ? (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-default/10 mt-1">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 relative rounded-full overflow-hidden shrink-0 bg-neutral-100">
              <Image
                src={selectedMatch.avatar}
                alt={selectedMatch.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-default truncate">{selectedMatch.name}</p>
              <p className="text-xs text-black/50 truncate">{selectedMatch.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {platform === "spotify" ? (
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white">
                <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.348-1.435-5.304-1.76-8.785-.963-.335.077-.67-.133-.746-.468-.077-.334.132-.67.467-.746 3.808-.87 7.076-.496 9.714 1.115.294.18.386.562.207.855zm1.225-2.723c-.226.367-.708.483-1.075.257-2.688-1.652-6.785-2.131-9.965-1.166-.413.127-.849-.106-.976-.519-.127-.413.106-.849.519-.976 3.632-1.102 8.147-.568 11.24 1.329.367.226.483.708.257 1.075zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.494.15-1.018-.13-1.168-.624-.15-.494.13-1.018.624-1.168 3.532-1.073 9.404-.866 13.2 1.388.444.264.59.838.327 1.282-.264.443-.838.59-1.282.327z" />
                </svg>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#FA243C] flex items-center justify-center text-white">
                <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.65 6.33l-5 1.5c-.37.11-.65.45-.65.84v5.66c-.46-.2-.98-.33-1.5-.33-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V11.8l4-1.2v3.73c-.46-.2-.98-.33-1.5-.33-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8.83c0-.49-.36-.92-.85-1z" />
                </svg>
              </div>
            )}
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-full border border-black px-5 py-1.5 text-xs font-medium text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      ) : matches.length > 0 ? (
        <div className="flex flex-col gap-2 mt-1">
          {matches.map((artist) => (
            <div
              key={artist.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-white border border-default/10"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 relative rounded-full overflow-hidden shrink-0 bg-neutral-100">
                  <Image src={artist.avatar} alt={artist.name} fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-default truncate">{artist.name}</p>
                  <p className="text-xs text-black/50 truncate">{artist.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {platform === "spotify" ? (
                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white">
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.348-1.435-5.304-1.76-8.785-.963-.335.077-.67-.133-.746-.468-.077-.334.132-.67.467-.746 3.808-.87 7.076-.496 9.714 1.115.294.18.386.562.207.855zm1.225-2.723c-.226.367-.708.483-1.075.257-2.688-1.652-6.785-2.131-9.965-1.166-.413.127-.849-.106-.976-.519-.127-.413.106-.849.519-.976 3.632-1.102 8.147-.568 11.24 1.329.367.226.483.708.257 1.075zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.494.15-1.018-.13-1.168-.624-.15-.494.13-1.018.624-1.168 3.532-1.073 9.404-.866 13.2 1.388.444.264.59.838.327 1.282-.264.443-.838.59-1.282.327z" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#FA243C] flex items-center justify-center text-white">
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.65 6.33l-5 1.5c-.37.11-.65.45-.65.84v5.66c-.46-.2-.98-.33-1.5-.33-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V11.8l4-1.2v3.73c-.46-.2-.98-.33-1.5-.33-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8.83c0-.49-.36-.92-.85-1z" />
                    </svg>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleAdd(artist)}
                  className="rounded-full border border-black px-5 py-1.5 text-xs font-medium text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : isLoading ? (
        <p className="text-xs text-black/40 italic px-1">Searching platform...</p>
      ) : null}

      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
export default PlatformLookup;
