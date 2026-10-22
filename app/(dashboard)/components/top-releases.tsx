import Link from "next/link";
import { Disc } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopReleasesProps {
  data?: DashboardMetricData;
  rangeLabel?: string;
}

export default function TopReleasesCard({
  data,
  rangeLabel = "30 Days",
}: TopReleasesProps) {
  const bars = data?.bars ?? [];
  const dataMax = Math.max(...bars.map((b) => b.value), 1);
  const lifetime = data?.lifetime ?? 0;
  const rangeTotal = data?.range ?? 0;

  return (
    <div className="bg-white rounded-30">
      <header className="flex items-center gap-1 text-default-tertiary px-4 py-5">
        <Disc size={16} />
        <h2 className="font-medium leading-tight">Top Releases</h2>
      </header>
      <div className="flex flex-col px-6 pb-6 gap-6">
        <div className="flex flex-col gap-2 py-4 border-b border-b-default/10">
          <span className="font-heading text-xl font-medium leading-tight">
            {lifetime.toLocaleString()}
          </span>
          <span className="text-default/40 font-medium leading-tight">Releases</span>
          <Link
            href="/discography"
            className="text-default/40 font-medium px-9 py-2.5 rounded-full bg-default/5 leading-tight self-start hover:bg-default/10 transition-colors"
          >
            See releases
          </Link>
        </div>
        <div className="flex flex-col gap-2 self-stretch">
          <span className="font-heading text-xl font-medium leading-tight">
            {rangeTotal.toLocaleString()}
          </span>
          <span className="text-default/40 font-medium leading-tight">
            Total Releases Last {rangeLabel}
          </span>
          <div className="flex items-end justify-between h-12.5 gap-0.5">
            {bars.map((bar, index) => {
              const heightPercent = bar.value > 0 ? Math.max((bar.value / dataMax) * 100, 8) : 8;
              return (
                <div
                  key={bar.date || index}
                  title={`${bar.date}: ${bar.value.toLocaleString()}`}
                  style={{ height: `${heightPercent}%` }}
                  className={cn(
                    "rounded-full w-1.5 transition-all",
                    bar.value > 0 ? "bg-brand-purple-2" : "bg-brand-purple-2/20"
                  )}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
