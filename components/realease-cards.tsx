import { cn } from "@/lib/utils";

function ReleaseCards({
  children,
  scrollable,
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid gap-6",
        scrollable
          ? "grid-flow-col auto-cols-[300px] sm:auto-cols-[330px] overflow-x-auto scrollbar-none snap-x snap-mandatory container-full-bleed mask-[linear-gradient(to_right,black_0%,black_80%,transparent_99%)]"
          : "container grid-cols-[repeat(auto-fill,minmax(280px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(320px,1fr))]",
      )}
    >
      {children}
    </div>
  );
}

export default ReleaseCards;
