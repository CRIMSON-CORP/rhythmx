"use client";

import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { useRouter } from "next/navigation";

function SignOutAllDevices() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <Button
      onClick={() =>
        startTransition(async () => {
          await api.post(API_ROUTES.ME.DEVICE_SIGN_OUTS, {});
          router.refresh();
        })
      }
      disabled={isPending}
      variant="outline"
    >
      {isPending ? "Logging out devices..." : "Log out devices"}
    </Button>
  );
}

export default SignOutAllDevices;
