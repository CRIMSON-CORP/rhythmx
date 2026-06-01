"use client";
import Icon from "@/components/icon";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mainOptions = [
  {
    href: "/",
    title: "Home",
    icon: "home",
    command: "⇧I",
  },
  {
    href: "/discography",
    title: "Discography",
    icon: "disc",
    command: "⇧C",
  },
  {
    href: "/artist",
    title: "Artist",
    icon: "star",
    command: "⇧A",
  },
  {
    href: "/trend-analytics",
    title: "Trends & Analytics",
    icon: "bar-chart",
    command: "⇧T",
  },
  {
    href: "/earning",
    title: "Earning",
    icon: "dollar",
    command: "⇧E",
  },
  {
    href: "/wallet",
    title: "Wallet",
    icon: "inbox",
    command: "⇧W",
  },
  {
    href: "/subscription",
    title: "Subscription",
    icon: "zap",
    command: "⇧S",
  },
];

const managementOptions = [
  {
    href: "/team ",
    title: "Team",
    icon: "users",
    command: "",
  },
  {
    href: "/roles-permission ",
    title: "Roles & Permission",
    icon: "command",
    command: "",
  },
];

const profileOptions = [
  {
    href: "/invite ",
    title: "Invite",
    icon: "user-plus",
    command: "⇧I",
  },
  {
    href: "/view-as-artist",
    title: "View As Artist",
    icon: "command",
    command: "⇧I",
  },
  {
    href: "/view-as-record-label ",
    title: "View As Record Label",
    icon: "command",
    command: "⇧I",
  },
  {
    href: "/view-as-royalty",
    title: "View As Royalty",
    icon: "command",
    command: "⇧I",
  },
  {
    href: "/settings",
    title: "Settings",
    icon: "settings",
    command: "⇧S",
  },
];

function Header() {
  return (
    <div className="max-w-442.5 w-full mx-auto px-4 pt-10">
      <header className="bg-white px-8 py-6 rounded-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Icon name="logo" width={25} height={38} className="text-brand-orange" />
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-page-background">
                <Icon name="side-bar" size={20} />
                <Icon name="chevron-down" size={16} className="text-default-tertiary" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="p-2 rounded-20 outline-none shadow-2xl ring-0 gap-0 min-w-75.25"
            >
              <Command className="p-0">
                <CommandList className="max-h-none font-medium">
                  <CommandGroup className="p-0">
                    {mainOptions.map((option) => (
                      <CommandItem key={option.href} className="px-4 py-3 cursor-pointer">
                        <Icon name={option.icon} size={20} className="text-brand-orange" />
                        <span>{option.title}</span>
                        <CommandShortcut>{option.command}</CommandShortcut>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandGroup className="p-0" heading="Management">
                    {managementOptions.map((option) => (
                      <CommandItem key={option.href} className="px-4 py-3 cursor-pointer">
                        <Icon name={option.icon} size={20} className="text-brand-orange" />
                        <span>{option.title}</span>
                        <CommandShortcut>{option.command}</CommandShortcut>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
              <footer className="text-brand-blue p-2 flex items-stretch justify-end gap-3.5">
                <Icon name="globe" size={24} />
                <Icon name="question" size={24} />
              </footer>
            </PopoverContent>
          </Popover>
          <PageTitle />
        </div>
        <div className="flex items-center gap-8 text-default font-medium">
          <button>
            <Icon name="search" size={24} />
          </button>
          <button className="relative">
            <Icon name="inbox" size={24} />
            <span className="absolute size-2.5 bg-danger-default rounded-full top-0 right-0 block" />
          </button>
          <Link
            href="/wallet"
            className="flex items-center gap-3 bg-brand-orange/10 rounded-full px-2.5 py-2 pl-4"
          >
            <span>$394,000.00</span>
            <span className="block p-1.5">
              <Icon name="zap" size={20} className="text-brand-orange" />
            </span>
          </Link>
          <div className="bg-page-background px-2.5 py-2 rounded-40 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Image
                src="/images/avatar.png"
                width={32}
                height={32}
                alt="Captain RL"
                className="bg-[#C7FFB3] rounded-lg"
              />
              <span>Captain RL</span>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-page-background">
                  <Icon name="elipses-h" size={20} />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="p-2 rounded-20 outline-none shadow-2xl ring-0 gap-0 min-w-75.25"
              >
                <Command className="p-0">
                  <div className="flex items-center gap-4 p-4">
                    <Image
                      src="/images/avatar.png"
                      width={32}
                      height={32}
                      alt="Captain RL"
                      className="bg-[#C7FFB3] rounded-lg"
                    />
                    <div className="flex flex-col leading-tight">
                      <span className="font-semibold">Captain RL</span>
                      <span className="text-border-default-secondary text-sm">Admin</span>
                    </div>
                  </div>
                  <CommandSeparator className="my-1" />
                  <CommandList className="max-h-none font-medium">
                    <CommandGroup className="p-0">
                      {profileOptions.map((option) => (
                        <CommandItem key={option.href} className="px-4 py-3 cursor-pointer">
                          <Icon name={option.icon} size={20} />
                          <span>{option.title}</span>
                          <CommandShortcut>{option.command}</CommandShortcut>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandSeparator className="my-1" />
                    <CommandGroup className="p-0">
                      <CommandItem key="privacy-policy" className="px-4 py-3 cursor-pointer">
                        <span>Privacy Policy</span>
                      </CommandItem>
                      <CommandItem key="terms-of-use" className="px-4 py-3 cursor-pointer">
                        <span>Terms of Use</span>
                      </CommandItem>
                      <CommandItem key="logout" className="px-4 py-3 cursor-pointer">
                        <span>Logout</span>
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <Link href="/" className="p-2 bg-brand-orange rounded-full">
            <Icon name="plus" size={20} className="text-white" />
          </Link>
        </div>
      </header>
    </div>
  );
}

export default Header;

function PageTitle() {
  const pathname = usePathname();
  const currentPath = [...mainOptions, ...managementOptions].find(
    (option) => option.href === pathname,
  );

  if (!currentPath) {
    return null;
  }

  return (
    <>
      <Icon name={currentPath.icon} size={20} className="text-default-tertiary" />
      <span className="text-sm font-medium">{currentPath.title}</span>
    </>
  );
}
