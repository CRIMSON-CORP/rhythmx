export interface FlutterwaveCustomer {
  email: string;
  phone_number?: string;
  name?: string;
}

export interface FlutterwaveCustomizations {
  title?: string;
  description?: string;
  logo?: string;
}

export interface FlutterwaveCallbackData {
  amount: number;
  currency: string;
  customer?: FlutterwaveCustomer;
  flw_ref?: string;
  status: "successful" | "completed" | "failed" | string;
  transaction_id?: number | string;
  tx_ref: string;
  [key: string]: unknown;
}

export interface FlutterwaveCheckoutOptions {
  public_key: string;
  tx_ref: string;
  amount: number;
  currency: string;
  payment_options?: string;
  customer: FlutterwaveCustomer;
  callback: (response: FlutterwaveCallbackData) => void | Promise<void>;
  onclose?: (incomplete?: boolean) => void;
  customizations?: FlutterwaveCustomizations;
  meta?: Record<string, unknown>;
}

declare global {
  interface Window {
    FlutterwaveCheckout?: (options: FlutterwaveCheckoutOptions) => void;
  }
}

const FLUTTERWAVE_SCRIPT_URL = "https://checkout.flutterwave.com/v3.js";
const SCRIPT_ID = "flutterwave-checkout-v3";

/**
 * Dynamically loads the Flutterwave Checkout v3 script if not already present.
 */
export function loadFlutterwaveScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (typeof window.FlutterwaveCheckout === "function") {
      resolve(true);
      return;
    }

    const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      if (window.FlutterwaveCheckout) {
        resolve(true);
        return;
      }
      existingScript.addEventListener("load", () => resolve(true), { once: true });
      existingScript.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = FLUTTERWAVE_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.head.appendChild(script);
  });
}

/**
 * Opens Flutterwave inline checkout modal.
 */
export async function openFlutterwaveCheckout(
  options: FlutterwaveCheckoutOptions,
): Promise<{ success: boolean; error?: string }> {
  const loaded = await loadFlutterwaveScript();

  if (!loaded || typeof window.FlutterwaveCheckout !== "function") {
    return {
      success: false,
      error: "Failed to load Flutterwave checkout script. Please check your internet connection.",
    };
  }

  try {
    window.FlutterwaveCheckout(options);
    return { success: true };
  } catch (err) {
    console.error("Error opening Flutterwave checkout:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to open checkout modal",
    };
  }
}
