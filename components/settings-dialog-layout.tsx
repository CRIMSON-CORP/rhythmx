"use client";

import * as React from "react";
import { Dialog as DialogPrimitive, VisuallyHidden } from "radix-ui";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Trash2, Search, X } from "lucide-react";
import Icon from "./icon";

interface SettingsDialogLayoutProps {
  children: React.ReactNode;
}

export default function SettingsDialogLayout({ children }: SettingsDialogLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      router.back();
    }
  };

  const getActiveTab = () => {
    if (pathname.includes("/settings/account")) return "account";
    if (pathname.includes("/settings/record-label-details")) return "record-label-details";
    if (pathname.includes("/settings/withdrawal-account")) return "withdrawal-account";
    if (pathname.includes("/settings/notification-settings")) return "notification-settings";
    if (pathname.includes("/settings/plan-billing")) return "plan-billing";
    if (pathname.includes("/settings/language-region")) return "language-region";
    if (pathname.includes("/settings/security-privacy")) return "security-privacy";
    if (pathname.includes("/settings/devices")) return "devices";
    return "account";
  };

  const activeTab = getActiveTab();

  const menuGroups = [
    {
      title: "Account",
      items: [
        { id: "account", label: "Account", icon: "user", href: "/settings/account" },
        {
          id: "record-label-details",
          label: "Record Label Bio",
          icon: "star",
          href: "/settings/record-label-details",
        },
        {
          id: "withdrawal-account",
          label: "Withdrawal Account",
          icon: "credit-card",
          href: "/settings/withdrawal-account",
        },
        {
          id: "notification-settings",
          label: "Notification Settings",
          icon: "inbox",
          href: "/settings/notification-settings",
        },
        {
          id: "plan-billing",
          label: "Plan & Billing",
          icon: "credit-card",
          href: "/settings/plan-billing",
        },
        {
          id: "language-region",
          label: "Language & Region",
          icon: "language-circle",
          href: "/settings/language-region",
        },
      ],
    },
    {
      title: "Security",
      items: [
        {
          id: "security-privacy",
          label: "Security & Privacy",
          icon: "shield",
          href: "/settings/security-privacy",
        },
        { id: "devices", label: "Devices", icon: "hard-drive", href: "/settings/devices" },
      ],
    },
  ];

  // Filter items based on search query
  const filteredGroups = menuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((group) => group.items.length > 0);

  const getTitle = () => {
    switch (activeTab) {
      case "account":
        return "Account Details";
      case "record-label-details":
        return "Record Label Bio";
      case "withdrawal-account":
        return "Withdrawal Account";
      case "notification-settings":
        return "Notification Settings";
      case "plan-billing":
        return "Plan & Billing";
      case "language-region":
        return "Language & Region";
      case "security-privacy":
        return "Security & Privacy";
      case "devices":
        return "Manage Devices";
      default:
        return "Settings";
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        {/* Overlay with subtle blur */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/10 backdrop-blur-xs duration-200 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />

        {/* Main Dialog Container */}
        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex w-full max-w-5xl h-180 max-h-[90vh] rounded-20 bg-white shadow-2xl duration-200 outline-none overflow-hidden data-open:animate-in data-open:zoom-in-95 data-closed:animate-out data-closed:zoom-out-95">
          <VisuallyHidden.Root>
            <DialogPrimitive.Title>Settings</DialogPrimitive.Title>
            <DialogPrimitive.Description>Settings</DialogPrimitive.Description>
          </VisuallyHidden.Root>
          {/* Left Sidebar */}
          <div className="w-72 bg-page-background border-r border-default/5 p-6 flex flex-col justify-between overflow-y-auto">
            <div className="flex flex-col gap-6">
              {/* Search input */}
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-full">
                <Search size={16} className="text-default-tertiary" />
                <input
                  type="text"
                  placeholder="Search settings"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none w-full text-sm text-border-default-secondary font-medium"
                />
              </div>

              {/* Sidebar Tabs */}
              <div className="flex flex-col gap-5">
                {filteredGroups.map((group) => (
                  <div
                    key={group.title}
                    className="flex flex-col gap-3 not-last:border-b not-last:border-b-default-default"
                  >
                    <span className="text-xs font-medium tracking-wider text-border-default-secondary capitalize">
                      {group.title}
                    </span>
                    <nav className="flex flex-col gap-1">
                      {group.items.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                          <Link
                            key={item.id}
                            href={item.href}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-md transition-all duration-200 font-medium ${
                              isActive
                                ? "bg-[#1E1E1E] text-[#F5F5F5] shadow-md shadow-black/10"
                                : "text-default hover:bg-black/5 hover:text-default"
                            }`}
                          >
                            <Icon size={20} name={item.icon} />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </nav>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions - Delete Account */}
            <div className="mt-8 pt-4 border-t border-default/5">
              <button className="flex items-center gap-3.5 px-4 py-3 w-full rounded-xl transition-all duration-200 text-sm font-medium text-danger-default hover:bg-danger-default/10">
                <Trash2 size={18} />
                <span>Delete Account</span>
              </button>
            </div>
          </div>

          {/* Right Form Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-page-background relative">
            <header className="flex items-center justify-between px-6 py-7">
              <h2 className="font-medium">{getTitle()}</h2>
              <DialogPrimitive.Close asChild>
                <button className="p-2 rounded-full hover:bg-black/5 transition-all">
                  <X size={20} className="text-default" />
                </button>
              </DialogPrimitive.Close>
            </header>

            <div className="flex-1 overflow-y-auto">{children}</div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
