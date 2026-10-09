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

export interface ApiErrorObject {
  message?: string;
  errors?: Record<string, string | string[] | undefined | null>;
  [key: string]: unknown;
}

/**
 * Extracts and normalizes backend field errors into a single string per field.
 * Handles both string and string[] error values.
 */
export function getFieldErrors<T extends Record<string, any> = Record<string, string>>(
  error: unknown,
): Partial<T> {
  const errObj = error as ApiErrorObject | null | undefined;
  const result: Record<string, string> = {};

  if (errObj?.errors && typeof errObj.errors === "object" && !Array.isArray(errObj.errors)) {
    for (const [key, value] of Object.entries(errObj.errors)) {
      if (!value) continue;
      result[key] = Array.isArray(value) ? value[0] : String(value);
    }
  }

  return result as Partial<T>;
}

/**
 * Extracts the primary error message or combines field errors into a readable string.
 */
export function getErrorMessage(
  error: unknown,
  fallback = "An unexpected error occurred",
): string {
  const errObj = error as ApiErrorObject | null | undefined;
  if (!errObj) return fallback;

  if (errObj.message && typeof errObj.message === "string") {
    return errObj.message;
  }

  if (errObj.errors && typeof errObj.errors === "object" && !Array.isArray(errObj.errors)) {
    const messages = Object.values(errObj.errors)
      .flat()
      .filter(Boolean);
    if (messages.length > 0) {
      return messages.join(". ");
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}


