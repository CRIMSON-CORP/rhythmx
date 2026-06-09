import { X } from "lucide-react";
import Icon from "@/components/icon";
import Image from "next/image";
import Link from "next/link";

export default function SubmitSuccessPage() {
  return (
    <div className="flex items-center justify-center grow px-4 py-12 bg-linear-to-br from-[#FF7247]/50 to-[#FFC107]/50">
      <div className="max-w-204.25 relative isolate overflow-hidden w-full rounded-30 bg-white">
        <div className="absolute w-full top-0 left-0 right-0 h-40 bg-linear-to-br from-[#FF7247] to-[#FFC107] -z-10 opacity-30 blur-3xl pointer-events-none"></div>

        <header className="flex flex-row items-center justify-between px-6 py-5">
          <p className="font-medium text-sm">Release Submission</p>
          <Link href="/discography" className="p-2">
            <X size={20} />
          </Link>
        </header>

        <div className="flex flex-col items-center gap-6 px-5 py-10.5">
          <div className="relative">
            <Image
              src="/images/back-view-of-old-computers-with-stickers.png"
              width={231}
              height={231}
              alt="Back view of old computer with stickers"
              className="object-contain object-center size-57.75"
            />
            <div className="bg-brand-blue p-2.5 rounded-full absolute right-0 top-1/2 text-white">
              <Icon name="clock-02" size={33} />
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-1 max-w-113.25">
            <h1 className="font-semibold text-[32px] font-heading">Wonderful!</h1>
            <p className="font-semibold text-2xl font-heading">Release submitted</p>
            <p className="font-medium text-black/50">
              Your release has been submitted and undergoing review by our Quality Assurance team
              and once passed our guideline, and policy it will be published to your selected
              release platforms
            </p>
          </div>
          <Link
            href="/discography"
            className="rounded-full w-full text-center max-w-42.75 p-4 outline-black outline"
          >
            Done
          </Link>
        </div>
      </div>
    </div>
  );
}
