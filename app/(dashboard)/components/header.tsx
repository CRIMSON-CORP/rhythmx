import Icon from "@/components/icon";
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "@/components/ui/popover";
import Image from "next/image";
import Link from "next/link";
import { mainOptions, managementOptions, profileOptions } from "@/data/nav-links";
import PageTitle from "./page-title";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "radix-ui";
import Search from "./search";
import LogoutButton from "./logout-button";
import {
  ChevronDown,
  ChevronRight,
  CircleQuestionMark,
  Disc,
  Ellipsis,
  Globe,
  Inbox,
  Music,
  Plus,
  Sidebar,
  Zap,
  Search as SearchIcon,
} from "lucide-react";
import { Suspense } from "react";
import HeaderWalletBalance from "./header-wallet-balance";
import HeaderNotifications from "./header-notifications";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function Header() {
  const session = await getServerSession(authOptions);
  return (
    <div className="@container container w-full mx-auto px-4 pt-4 md:pt-10">
      <header className="bg-white px-4 md:px-8 py-3 md:py-6 rounded-full flex items-center justify-between">
        <div className="flex items-center @max-md:gap-2 gap-4 lg:gap-8">
          <Icon name="logo" width={25} height={38} className="text-brand-orange" />
          <Popover>
            <PopoverTrigger className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-page-background">
              <Sidebar size={20} />
              <ChevronDown size={16} className="text-default-tertiary" />
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="p-2 rounded-20 outline-none shadow-2xl ring-0 gap-0 min-w-75.25"
            >
              <div className="flex flex-col font-medium p-0">
                <div className="flex flex-col">
                  {mainOptions.map((option) => (
                    <PopoverClose asChild key={option.href}>
                      <Link
                        href={option.href.trim()}
                        className="flex items-center gap-2 px-4 py-3 w-full rounded-xl hover:bg-page-background text-default transition-colors text-sm"
                      >
                        {typeof option.icon === "string" ? (
                          <Icon name={option.icon} size={20} className="text-brand-orange" />
                        ) : (
                          <option.icon size={20} className="text-brand-orange" />
                        )}
                        <span>{option.title}</span>
                        {option.command && (
                          <span className="ml-auto text-xs tracking-widest text-default-tertiary font-mono">
                            {option.command}
                          </span>
                        )}
                      </Link>
                    </PopoverClose>
                  ))}
                </div>
                <div className="my-1.5 h-px bg-border/50 -mx-1" />
                <div className="flex flex-col">
                  <span className="px-4 py-1.5 text-xs font-medium text-default-tertiary">
                    Management
                  </span>
                  {managementOptions.map((option) => (
                    <PopoverClose asChild key={option.href}>
                      <Link
                        href={option.href.trim()}
                        className="flex items-center gap-2 px-4 py-3 w-full rounded-xl hover:bg-page-background text-default transition-colors text-sm"
                      >
                        {typeof option.icon === "string" ? (
                          <Icon name={option.icon} size={20} className="text-brand-orange" />
                        ) : (
                          <option.icon size={20} className="text-brand-orange" />
                        )}
                        <span>{option.title}</span>
                        {option.command && (
                          <span className="ml-auto text-xs tracking-widest text-default-tertiary font-mono">
                            {option.command}
                          </span>
                        )}
                      </Link>
                    </PopoverClose>
                  ))}
                </div>
              </div>
              <footer className="text-brand-blue p-2 flex items-stretch justify-end gap-3.5">
                <Globe size={24} />
                <CircleQuestionMark size={24} />
              </footer>
            </PopoverContent>
          </Popover>
          <PageTitle />
        </div>
        <div className="flex items-center gap-4 lg:gap-8 text-default font-medium">
          <Dialog>
            <DialogTrigger className="@max-4xl:hidden">
              <SearchIcon size={24} />
            </DialogTrigger>
            <DialogContent className="overflow-hidden isolate gap-0" showCloseButton={false}>
              <VisuallyHidden.Root>
                <DialogTitle>Search Popup</DialogTitle>
                <DialogDescription>Search Popup</DialogDescription>
              </VisuallyHidden.Root>
              <div className="absolute w-full top-0 right-0 h-26 bg-linear-to-r from-[#9747FF] to-[#FFC107] -z-10 opacity-25 blur-3xl"></div>
              <Search />
            </DialogContent>
          </Dialog>
          <Suspense
            fallback={
              <Link
                href="/notifications"
                className="relative @max-2xl:hidden"
                aria-label="Notifications"
              >
                <Inbox size={24} />
              </Link>
            }
          >
            <HeaderNotifications />
          </Suspense>
          <Link
            href="/wallet"
            className="flex items-center gap-3 bg-brand-orange/10 rounded-full px-2.5 py-2 pl-4 @max-4xl:hidden"
          >
            <Suspense fallback={<div className="w-20 h-6 rounded bg-black/10 animate-pulse" />}>
              <HeaderWalletBalance />
            </Suspense>
            <span className="block p-1.5">
              <Zap size={20} className="text-brand-orange" />
            </span>
          </Link>
          <Popover>
            <PopoverTrigger className="bg-page-background px-2.5 py-2 rounded-40 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Image
                  src={session?.user?.avatar_url || "/images/avatar.png"}
                  width={32}
                  height={32}
                  alt={`${session?.user?.first_name} ${session?.user?.last_name}`}
                  className="bg-[#C7FFB3] rounded-lg w-8 h-8"
                />
                <span className="@max-3xl:hidden">Captain {session?.user?.first_name}</span>
              </div>
              <Ellipsis size={20} className="@max-lg:hidden" />
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="p-2 rounded-20 outline-none shadow-2xl ring-0 gap-0 min-w-75.25"
            >
              <div className="flex flex-col font-medium p-0">
                <div className="flex items-center gap-4 p-4">
                  <Image
                    src={session?.user?.avatar_url || "/images/avatar.png"}
                    width={32}
                    height={32}
                    alt={`${session?.user?.first_name} ${session?.user?.last_name}`}
                    className="bg-[#C7FFB3] rounded-lg w-8 h-8"
                  />
                  <div className="flex flex-col leading-tight">
                    <span className="font-semibold">Captain {session?.user?.first_name}</span>
                    <span className="text-border-default-secondary text-sm">Admin</span>
                  </div>
                </div>
                <div className="my-1 h-px bg-border/50 -mx-1" />
                <div className="flex flex-col">
                  {profileOptions.map((option) => (
                    <PopoverClose asChild key={option.href}>
                      <Link
                        href={option.href.trim()}
                        className="flex items-center gap-2 px-4 py-3 w-full rounded-xl hover:bg-page-background text-default transition-colors text-sm"
                      >
                        {typeof option.icon === "string" ? (
                          <Icon name={option.icon} size={20} className="text-brand-orange" />
                        ) : (
                          <option.icon size={20} className="text-brand-orange" />
                        )}
                        <span>{option.title}</span>
                        {option.command && (
                          <span className="ml-auto text-xs tracking-widest text-default-tertiary font-mono">
                            {option.command}
                          </span>
                        )}
                      </Link>
                    </PopoverClose>
                  ))}
                </div>
                <div className="my-1 h-px bg-border/50 -mx-1" />
                <div className="flex flex-col">
                  <PopoverClose asChild>
                    <Link
                      href="/privacy-policy"
                      className="flex items-center px-4 py-3 cursor-pointer w-full text-sm hover:bg-page-background rounded-xl transition-colors font-medium text-default"
                    >
                      <span>Privacy Policy</span>
                    </Link>
                  </PopoverClose>
                  <PopoverClose asChild>
                    <Link
                      href="/terms-of-use"
                      className="flex items-center px-4 py-3 cursor-pointer w-full text-sm hover:bg-page-background rounded-xl transition-colors font-medium text-default"
                    >
                      <span>Terms of Use</span>
                    </Link>
                  </PopoverClose>
                  <LogoutButton />
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger className="p-2 bg-brand-orange rounded-full @max-xl:hidden">
              <Plus size={20} className="text-white" />
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="p-0 outline-none shadow-2xl ring-0 gap-0 min-w-89"
            >
              <header className="px-6 py-5 border-b border-b-brand-orange/10">
                <span className="text-sm font-medium">What will you like to release?</span>
              </header>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-6">
                  <PopoverClose asChild>
                    <Link
                      href="/discography/release/draft/new?release_type=single"
                      className="flex items-center gap-3"
                    >
                      <span className="p-1.5 bg-brand-blue/10 rounded-full">
                        <Music name="music" size={20} className="text-brand-blue" />
                      </span>
                      <div className="flex flex-col grow">
                        <span className="font-medium text-sm">Single</span>
                        <span className="text-xs text-default-tertiary">
                          Add a single to your discography
                        </span>
                      </div>
                      <ChevronRight size={20} className="text-default-tertiary" />
                    </Link>
                  </PopoverClose>
                  <PopoverClose asChild>
                    <Link
                      href="/discography/release/draft/new?release_type=album"
                      className="flex items-center gap-3"
                    >
                      <span className="p-1.5 bg-brand-blue/10 rounded-full">
                        <Disc size={20} className="text-brand-blue" />
                      </span>
                      <div className="flex flex-col grow">
                        <span className="font-medium text-sm">Album</span>
                        <span className="text-xs text-default-tertiary">
                          Add an album to your discography
                        </span>
                      </div>
                      <ChevronRight size={20} className="text-default-tertiary" />
                    </Link>
                  </PopoverClose>
                </div>
                <p className="text-[11px]">
                  You&apos;re starting a pay per release distribution.{" "}
                  <Link href="/pricing" className="text-brand-orange underline">
                    View Pricing Here.
                  </Link>
                </p>
                <footer className="text-brand-blue flex items-stretch justify-end gap-3.5">
                  <Globe size={24} />
                  <CircleQuestionMark size={24} />
                </footer>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </header>
    </div>
  );
}

export default Header;
