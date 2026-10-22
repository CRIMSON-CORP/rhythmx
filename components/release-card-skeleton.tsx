import { cn } from "@/lib/utils";
import ReleaseCards from "@/components/realease-cards";

interface ReleaseCardSkeletonProps {
  className?: string;
}

export function ReleaseCardSkeleton({ className }: ReleaseCardSkeletonProps) {
  return (
    <div
      className={cn(
        "w-full aspect-square rounded-30 overflow-hidden relative flex flex-col justify-between p-4 isolate snap-center bg-black/5 animate-pulse",
        className,
      )}
    >
      {/* Top right streams badge */}
      <div className="flex justify-end">
        <div className="w-16 h-6 rounded-full bg-black/10" />
      </div>

      {/* Bottom title & metadata */}
      <div className="flex flex-col gap-3">
        <div className="w-3/4 h-7 rounded-lg bg-black/10" />
        <div className="flex items-center gap-2">
          <div className="w-16 h-5 rounded-full bg-black/10" />
          <div className="w-20 h-5 rounded-full bg-black/10" />
        </div>
      </div>
    </div>
  );
}

interface ReleaseCardsSkeletonProps {
  count?: number;
  scrollable?: boolean;
  className?: string;
}

export function ReleaseCardsSkeleton({
  count = 4,
  scrollable = false,
  className,
}: ReleaseCardsSkeletonProps) {
  return (
    <ReleaseCards scrollable={scrollable}>
      {Array.from({ length: count }).map((_, index) => (
        <ReleaseCardSkeleton key={index} className={className} />
      ))}
    </ReleaseCards>
  );
}

export default ReleaseCardSkeleton;
