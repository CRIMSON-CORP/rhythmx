"use client";

import * as React from "react";
import { Dialog as DialogPrimitive, VisuallyHidden } from "radix-ui";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Trash2,
  Search,
  X,
  User,
  Star,
  CreditCard,
  Inbox,
  Shield,
  HardDrive,
  Sidebar,
} from "lucide-react";
import Icon from "@/components/icon";

interface SettingsDialogLayoutProps {
  children: React.ReactNode;
}

export default function SettingsDialogLayout({ children }: SettingsDialogLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

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
        { id: "account", label: "Account", icon: User, href: "/settings/account" },
        {
          id: "record-label-details",
          label: "Record Label Bio",
          icon: Star,
          href: "/settings/record-label-details",
        },
        {
          id: "withdrawal-account",
          label: "Withdrawal Account",
          icon: "dollar",
          href: "/settings/withdrawal-account",
        },
        {
          id: "notification-settings",
          label: "Notification Settings",
          icon: Inbox,
          href: "/settings/notification-settings",
        },
        {
          id: "plan-billing",
          label: "Plan & Billing",
          icon: CreditCard,
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
          icon: Shield,
          href: "/settings/security-privacy",
        },
        { id: "devices", label: "Devices", icon: HardDrive, href: "/settings/devices" },
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
        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex w-full md:max-w-5xl h-full md:h-180 max-h-screen md:max-h-[90vh] rounded-none md:rounded-20 bg-white shadow-2xl duration-200 outline-none overflow-hidden data-open:animate-in data-open:zoom-in-95 data-closed:animate-out data-closed:zoom-out-95">
          <VisuallyHidden.Root>
            <DialogPrimitive.Title>Settings</DialogPrimitive.Title>
            <DialogPrimitive.Description>Settings</DialogPrimitive.Description>
          </VisuallyHidden.Root>

          {/* Mobile Sidebar Backdrop */}
          {isSidebarOpen && (
            <div
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
            />
          )}

          {/* Left Sidebar */}
          <div
            className={`bg-page-background border-r border-default/5 p-6 flex flex-col justify-between overflow-y-auto transition-transform duration-300 shrink-0 w-72 h-full
              max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50
              ${isSidebarOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"}
            `}
          >
            <div className="flex flex-col gap-6">
              {/* Search input */}
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-white/50 border border-default/5">
                <Search size={16} className="text-default-tertiary shrink-0" />
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
                    className="flex flex-col gap-3 not-last:border-b not-last:border-b-default-default pb-3"
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
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-md transition-all duration-200 font-medium ${
                              isActive
                                ? "bg-[#1E1E1E] text-[#F5F5F5] shadow-md shadow-black/10"
                                : "text-default hover:bg-black/5 hover:text-default"
                            }`}
                          >
                            {typeof item.icon === "string" ? (
                              <Icon size={20} name={item.icon} />
                            ) : (
                              <item.icon size={20} />
                            )}
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
          <div className="flex-1 flex flex-col min-w-0 bg-page-background relative h-full">
            <header className="flex items-center justify-between px-4 py-5 md:px-6 md:py-7 border-b border-default/5">
              <div className="flex items-center gap-3">
                {/* Mobile Toggle Sidebar button */}
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="md:hidden p-2 rounded-full hover:bg-black/5 text-default cursor-pointer shrink-0"
                >
                  <Sidebar size={20} />
                </button>
                <h2 className="font-medium text-lg md:text-xl">{getTitle()}</h2>
              </div>
              <DialogPrimitive.Close asChild>
                <button className="p-2 rounded-full hover:bg-black/5 transition-all cursor-pointer">
                  <X size={20} className="text-default" />
                </button>
              </DialogPrimitive.Close>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-6">{children}</div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
