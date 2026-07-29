"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

function SessionUpdateListener() {
  const { update } = useSession();

  useEffect(() => {
    const handleUpdate = (event: CustomEvent) => {
      update(event.detail);
    };

    window.addEventListener("auth:update-session", handleUpdate as EventListener);

    return () => {
      window.removeEventListener("auth:update-session", handleUpdate as EventListener);
    };
  }, [update]);
  return null;
}

export default SessionUpdateListener;
