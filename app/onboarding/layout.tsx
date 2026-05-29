import Image from "next/image";
import Header from "./header";
import Icon from "@/components/icon";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 grid grid-cols-[0.45fr_0.55fr]">
      <div className="flex flex-col justify-between items-stretch w-full px-5 py-16">
        <Header />
        <div className="w-full grow flex flex-col justify-center max-w-xl mx-auto">
          <form className="flex flex-col justify-center gap-y-8 max-w-129.5">
            <div className="space-y-8">
              <Icon name="logo" width={58} height={94} />
            </div>
            {children}
          </form>
        </div>
      </div>
      <div className="w-full h-full relative">
        <Image
          fill
          loading="eager"
          priority
          quality={100}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          src="/images/onboarding-banner.webp"
          alt="Rhythmx onboarding banner"
          className="object-cover"
        />
      </div>
    </div>
  );
}

export default Layout;
