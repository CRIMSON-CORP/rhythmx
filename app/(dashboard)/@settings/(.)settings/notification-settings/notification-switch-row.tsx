"use client";

import { Switch } from "@/components/ui/switch";
import { useState, useTransition } from "react";
import { updateNotificationPreferences } from "./actions";

interface NotificationSwitchRowProps {
  label: string;
  category: "new_releases" | "updates_announcements";
  channel: "email" | "push";
  defaultChecked?: boolean;
  className?: string;
}

export function NotificationSwitchRow({
  label,
  category,
  channel,
  defaultChecked = false,
  className = "",
}: NotificationSwitchRowProps) {
  const [checked, setChecked] = useState(defaultChecked);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (newChecked: boolean) => {
    setChecked(newChecked);
    startTransition(async () => {
      await updateNotificationPreferences({
        [category]: {
          [channel]: newChecked,
        },
      });
    });
  };

  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <span className="text-sm text-default font-medium">{label}</span>
      <Switch checked={checked} onCheckedChange={handleToggle} disabled={isPending} />
    </div>
  );
}
