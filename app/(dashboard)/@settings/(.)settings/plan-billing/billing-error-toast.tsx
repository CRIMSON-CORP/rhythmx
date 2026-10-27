"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { goeyToast } from "goey-toast";

export default function BillingErrorToast({ initialError }: { initialError?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const shownRef = useRef(false);

  useEffect(() => {
    const errorMsg = initialError || searchParams?.get("error");
    if (errorMsg && !shownRef.current) {
      shownRef.current = true;
      goeyToast.error(errorMsg);

      if (searchParams?.has("error")) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("error");
        const newQuery = params.toString() ? `?${params.toString()}` : "";
        router.replace(`${pathname}${newQuery}`, { scroll: false });
      }
    }
  }, [initialError, searchParams, pathname, router]);

  return null;
}
