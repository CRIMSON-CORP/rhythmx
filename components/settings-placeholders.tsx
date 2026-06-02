"use client";

import * as React from "react";
import { Bell, CreditCard, Globe2, ShieldCheck, Laptop } from "lucide-react";

interface PlaceholderProps {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

export function SettingsPlaceholder({ title, desc, icon }: PlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6 bg-default-secondary/10 rounded-20 border border-dashed border-default/10 gap-4">
      <div className="p-4 bg-default-secondary/50 text-default-tertiary rounded-full">{icon}</div>
      <div className="flex flex-col gap-1">
        <span className="text-base font-bold text-default">{title}</span>
        <span className="text-sm text-default-tertiary max-w-sm">{desc}</span>
      </div>
    </div>
  );
}

export function NotificationSettings() {
  return (
    <SettingsPlaceholder
      title="Notification Settings"
      desc="Manage how and when you receive notifications from Rhythmx regarding streams, balances, and releases."
      icon={<Bell size={32} />}
    />
  );
}

export function PlanBilling() {
  return (
    <SettingsPlaceholder
      title="Plan & Billing"
      desc="View invoices, change your subscription tier, or add payment methods for distribution."
      icon={<CreditCard size={32} />}
    />
  );
}

export function LanguageSettings() {
  return (
    <SettingsPlaceholder
      title="Language & Region"
      desc="Change your preferred language, display currency, and localization settings."
      icon={<Globe2 size={32} />}
    />
  );
}

export function SecurityPrivacy() {
  return (
    <SettingsPlaceholder
      title="Security & Privacy"
      desc="Set up two-factor authentication, view privacy settings, and secure your account credentials."
      icon={<ShieldCheck size={32} />}
    />
  );
}

export function DevicesSettings() {
  return (
    <SettingsPlaceholder
      title="Connected Devices"
      desc="Monitor devices currently logged into your Rhythmx account and revoke access to unknown devices."
      icon={<Laptop size={32} />}
    />
  );
}
