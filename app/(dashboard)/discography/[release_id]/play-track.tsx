"use client";
import { Play, Pause } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function PlayTrack({ source }: { source: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Use useRef instead of useMemo for the Audio object.
  // useMemo does not guarantee persistence across re-renders.
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(source);

    const audioElement = audioRef.current;

    // Listen for when the audio naturally ends so the state resets
    const handleEnded = () => setIsPlaying(false);
    audioElement.addEventListener("ended", handleEnded);

    return () => {
      audioElement.removeEventListener("ended", handleEnded);
      audioElement.pause();
      audioRef.current = null;
    };
  }, [source]);

  const handlePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Playback failed:", error);
      setIsPlaying(false);
    }
  };

  return (
    <button type="button" className="rounded-full group/btn cursor-pointer" onClick={handlePlay}>
      {isPlaying ? (
        <Pause
          size={16}
          className="text-brand-orange group-hover/btn:scale-110 transition-transform"
        />
      ) : (
        <Play
          size={16}
          className="text-brand-orange group-hover/btn:scale-110 transition-transform"
        />
      )}
    </button>
  );
}

export default PlayTrack;
