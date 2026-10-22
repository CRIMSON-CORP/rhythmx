export function DashboardCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-white rounded-30 p-6 flex flex-col gap-6 animate-pulse min-h-65 ${className}`}
    >
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-default-secondary/40" />
        <div className="h-4 w-28 rounded bg-default-secondary/40" />
      </div>
      <div className="flex flex-col gap-2 py-4 border-b border-b-default/10">
        <div className="h-6 w-32 rounded bg-default-secondary/40" />
        <div className="h-3 w-16 rounded bg-default-secondary/20" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="h-5 w-24 rounded bg-default-secondary/40" />
        <div className="flex items-end justify-between h-12.5 gap-1">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="bg-default-secondary/30 rounded-full w-1.5"
              style={{ height: `${(i % 5) * 20 + 20}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardCardsSkeleton() {
  return (
    <>
      <DashboardCardSkeleton />
      <DashboardCardSkeleton />
      <DashboardCardSkeleton />
      <DashboardCardSkeleton />
    </>
  );
}
