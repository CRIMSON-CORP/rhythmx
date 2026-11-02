"use client";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { useRouter } from "next/navigation";

function SignOutButton({ device_id }: { device_id: Device["id"] }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <Button
      variant="outline"
      size="xs"
      onClick={() =>
        startTransition(async () => {
          await api.delete(API_ROUTES.ME.DEVICES.DEVICE(device_id));
          router.refresh();
        })
      }
      disabled={isPending}
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log out"}
    </Button>
  );
}

export default SignOutButton;
