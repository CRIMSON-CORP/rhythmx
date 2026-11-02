"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { goeyToast } from "goey-toast";
import { Check, CircleMinus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ToggleArtistAccessButtonProps {
  reference: string;
  initialStatus?: string | null;
}

export function ToggleArtistAccessButton({
  reference,
  initialStatus,
}: ToggleArtistAccessButtonProps) {
  const [status, setStatus] = useState<string>(initialStatus || "active");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isDisabled = status === "disabled" || status === "inactive";

  const handleToggle = async () => {
    if (loading) return;
    const nextAccessStatus = isDisabled ? "active" : "disabled";

    setLoading(true);
    try {
      const res = await api.patch<UpdateArtistAccessResponse>(
        API_ROUTES.LABEL.ARTISTS.ARTIST(reference),
        { access_status: nextAccessStatus },
      );

      const updatedStatus = res?.artist?.access_status || nextAccessStatus;
      setStatus(updatedStatus);
      goeyToast.success(
        updatedStatus === "disabled"
          ? "Artist access disabled"
          : "Artist access reactivated",
      );
      router.refresh();
    } catch (error) {
      console.error("Failed to toggle artist access status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="white"
      onClick={handleToggle}
      disabled={loading}
      className="gap-2 cursor-pointer"
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : isDisabled ? (
        <Check size={16} />
      ) : (
        <CircleMinus size={16} />
      )}
      <span>{isDisabled ? "Reactivate Artist" : "Disable Artist"}</span>
    </Button>
  );
}

