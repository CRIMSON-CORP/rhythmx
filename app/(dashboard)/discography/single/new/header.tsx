"use client";
import Icon from "@/components/icon";
import { cn } from "@/lib/utils";
import useNewReleaseStore, { newReleaseStoreTitles } from "@/store/new-release-store";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

function Header() {
  const { back } = useRouter();
  const previous = useNewReleaseStore((state) => state.previous);
  const currentStep = useNewReleaseStore((state) => state.currentStep);

  const handleBackClick = () => {
    if (currentStep === 0) {
      return back();
    }
    previous();
  };
  return (
    <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full pt-4 pb-10">
      <div className="flex items-center gap-4">
        <div className="flex items-start gap-4">
          <button
            onClick={handleBackClick}
            className="size-[42] bg-brand-blue text-white rounded-full p-2 hover:bg-brand-blue/90 active:scale-95 transition-[colors,transform]"
          >
            <Icon name="arrow-left" size={27} />
          </button>
          <div className="flex flex-col gap-3 md:gap-6">
            <h1 className="font-heading text-3xl md:text-5xl font-semibold leading-[0.7]">
              {newReleaseStoreTitles[currentStep].title}
            </h1>
            <p className="font-medium text-sm md:text-base text-border-default-secondary leading-none">
              {newReleaseStoreTitles[currentStep].subtitle}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-stretch gap-2 md:gap-6 overflow-auto no-scrollbar mask-[linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)] snap-x snap-mandatory">
        {newReleaseStoreTitles.map((item, index) => (
          <StepTab
            key={item.tab_title}
            title={item.tab_title}
            icon={item.icon}
            index={index}
            currentStep={currentStep}
          />
        ))}
      </div>
    </header>
  );
}

export default Header;

function StepTab({
  title,
  icon,
  index,
  currentStep,
}: {
  title: string;
  icon: string;
  index: number;
  currentStep: number;
}) {
  const isActive = index === currentStep;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const setSetp = useNewReleaseStore((state) => state.setStep);
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
    <button
      key={title}
      ref={buttonRef}
      onClick={() => setSetp(index)}
      className={cn(
        "p-4 bg-white rounded-full flex items-center gap-2 whitespace-nowrap transition-colors duration-300 snap-center",
        isActive ? "bg-[#EAF5FF] text-brand-blue" : "",
      )}
    >
      <Icon name={icon} size={16} />
      <span>{title}</span>
    </button>
  );
}
