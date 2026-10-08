import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculates a dynamic toast duration based on content length.
 * Base duration of 4s + ~50ms per character, capped between minMs and maxMs.
 */
export function calculateReadingDuration(
  text: string | null | undefined,
  minMs: number = 4000,
  maxMs: number = 15000,
): number {
  if (!text) return minMs;
  const calculated = minMs + text.trim().length * 50;
  return Math.min(maxMs, Math.max(minMs, calculated));
}

