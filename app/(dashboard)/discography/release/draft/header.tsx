"use client";
import { cn } from "@/lib/utils";
import { newReleaseStoreTitles } from "@/store/new-release-store";
import { ArrowLeft, LucideIcon } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

function Header() {
  const { back } = useRouter();
  const pathname = usePathname();
  const splitPaths = useMemo(() => pathname.split("/"), [pathname]);

  const headerTitle = useMemo(() => {
    return newReleaseStoreTitles.find((storeTitle, index) => {
      return (
        splitPaths[5] === storeTitle.path ||
        (index === 0 && splitPaths.includes("new")) ||
        (splitPaths[5] == undefined && storeTitle.path === "")
      );
    });
  }, [splitPaths]);

  const handleBackClick = () => {
    return back();
  };
  return (
    <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full pt-4 pb-10">
      <div className="flex items-center gap-4">
        <div className="flex items-start gap-4">
          <button
            onClick={handleBackClick}
            className="size-[42] bg-brand-blue text-white rounded-full p-2 hover:bg-brand-blue/90 active:scale-95 transition-[colors,transform]"
          >
            <ArrowLeft size={27} />
          </button>
          <div className="flex flex-col gap-3 md:gap-6">
            <h1 className="font-heading text-3xl md:text-5xl font-semibold leading-[0.7]">
              {headerTitle?.title}
            </h1>
            <p className="font-medium text-sm md:text-base text-border-default-secondary leading-none">
              {headerTitle?.subtitle}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-stretch gap-2 md:gap-6 overflow-auto no-scrollbar mask-[linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)] snap-x snap-mandatory">
        {newReleaseStoreTitles.map((item, index) => (
          <StepTab
            key={item.path}
            index={index}
            title={item.tab_title}
            icon={item.icon}
            path={item.path}
          />
        ))}
      </div>
    </header>
  );
}

export default Header;

function StepTab({
  title,
  icon: IconComponent,
  path,
  index,
}: {
  title: string;
  icon: LucideIcon;
  path: string;
  index: number;
}) {
  const pathname = usePathname();
  const splitPaths = useMemo(() => pathname.split("/"), [pathname]);
  const isActive = useMemo(
    () =>
      splitPaths[5] === path ||
      (index === 0 && splitPaths.includes("new")) ||
      (splitPaths[5] == undefined && path === ""),
    [index, path, splitPaths],
  );
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const params: { release_id: string } = useParams();
  const release_id = params.release_id;
  useEffect(() => {
    if (isActive) {
      buttonRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [isActive]);

  return (
    <Link
      key={title}
      href={`/discography/release/draft/${release_id ? release_id : "new"}/${path}`}
      ref={buttonRef}
      className={cn(
        "p-4 bg-white rounded-full flex items-center gap-2 whitespace-nowrap transition-colors duration-300 snap-center",
        isActive ? "bg-[#EAF5FF] text-brand-blue" : "",
      )}
    >
      <IconComponent size={16} />
      <span>{title}</span>
    </Link>
  );
}
