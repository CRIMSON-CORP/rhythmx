"use client";

import { X } from "lucide-react";
import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useRouter } from "next/navigation";

export default function NotificationsPanel({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(true);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      router.back();
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        {/* Overlay */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/20 backdrop-blur-xs duration-200 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        {/* Sliding Panel Content */}
        <DialogPrimitive.Content className="fixed top-4 right-4 bottom-4 z-50 flex w-full max-w-md rounded-20 flex-col gap-6 bg-white shadow-2xl duration-200 outline-none border-l border-default/10 data-open:animate-in data-open:slide-in-from-right data-closed:animate-out data-closed:slide-out-to-right">
          <header className="flex items-center justify-between border-b border-default/5 p-6">
            <DialogPrimitive.Title className="font-medium">Notifications</DialogPrimitive.Title>
            <DialogPrimitive.Close asChild>
              <button>
                <X size={24} className="text-default-tertiary" />
              </button>
            </DialogPrimitive.Close>
          </header>
          <div className="h-full overflow-y-auto pl-6 pr-3">
            <div className="pr-3 pb-6 overflow-auto h-full">{children}</div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
