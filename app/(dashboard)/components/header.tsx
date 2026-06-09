import { ChevronDown, ChevronRight, Disc, Globe, Plus, Search as SearchIcon, Zap } from "lucide-react";
import Icon from "@/components/icon";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
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

async function Header() {
  return (
    <div className="@container container w-full mx-auto px-4 pt-10">
      <header className="bg-white px-8 py-6 rounded-full flex items-center justify-between">
        <div className="flex items-center @max-md:gap-2 gap-4 lg:gap-8">
          <Icon name="logo" width={25} height={38} className="text-brand-orange" />
          <Popover>
            <PopoverTrigger className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-page-background">
              <Icon name="side-bar" size={20} />
              <ChevronDown size={16} className="text-default-tertiary" />
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="p-2 rounded-20 outline-none shadow-2xl ring-0 gap-0 min-w-75.25"
            >
              <Command className="p-0">
                <CommandList className="max-h-none font-medium">
                  <CommandGroup className="p-0">
                    {mainOptions.map((option) => (
                      <CommandItem className="p-0 cursor-pointer" key={option.href}>
                        <PopoverClose asChild>
                          <Link
                            href={option.href.trim()}
                            className="flex items-center gap-2 px-4 py-3 w-full h-full"
                          >
                            <Icon name={option.icon} size={20} className="text-brand-orange" />
                            <span>{option.title}</span>
                            <CommandShortcut>{option.command}</CommandShortcut>
                          </Link>
                        </PopoverClose>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandGroup className="p-0" heading="Management">
                    {managementOptions.map((option) => (
                      <CommandItem key={option.href} className="p-0 cursor-pointer">
                        <PopoverClose asChild>
                          <Link
                            href={option.href.trim()}
                            className="flex items-center gap-2 px-4 py-3 w-full h-full"
                          >
                            <Icon name={option.icon} size={20} className="text-brand-orange" />
                            <span>{option.title}</span>
                            <CommandShortcut>{option.command}</CommandShortcut>
                          </Link>
                        </PopoverClose>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
              <footer className="text-brand-blue p-2 flex items-stretch justify-end gap-3.5">
                <Globe size={24} />
                <Icon name="question" size={24} />
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
          <Link href="/notifications" className="relative @max-2xl:hidden">
            <Icon name="inbox" size={24} />
            <span className="absolute size-2.5 bg-danger-default rounded-full top-0 right-0 block" />
          </Link>
          <Link
            href="/wallet"
            className="flex items-center gap-3 bg-brand-orange/10 rounded-full px-2.5 py-2 pl-4 @max-4xl:hidden"
          >
            <span>$394,000.00</span>
            <span className="block p-1.5">
              <Zap size={20} className="text-brand-orange" />
            </span>
          </Link>
          <Popover>
            <PopoverTrigger className="bg-page-background px-2.5 py-2 rounded-40 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/avatar.png"
                  width={32}
                  height={32}
                  alt="Captain RL"
                  className="bg-[#C7FFB3] rounded-lg"
                />
                <span className="@max-3xl:hidden">Captain RL</span>
              </div>
              <Icon name="elipses-h" size={20} className="@max-lg:hidden" />
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
                      <CommandItem key={option.href} className="p-0 cursor-pointer">
                        <PopoverClose asChild>
                          <Link
                            href={option.href.trim()}
                            className="flex items-center gap-2 px-4 py-3 w-full h-full"
                          >
                            <Icon name={option.icon} size={20} />
                            <span>{option.title}</span>
                            <CommandShortcut>{option.command}</CommandShortcut>
                          </Link>
                        </PopoverClose>
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
                    <Link href="/discography/single/new" className="flex items-center gap-3">
                      <span className="p-1.5 bg-brand-blue/10 rounded-full">
                        <Icon name="music" size={20} className="text-brand-blue" />
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
                    <Link href="/releases" className="flex items-center gap-3">
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
                  <Icon name="question" size={24} />
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
