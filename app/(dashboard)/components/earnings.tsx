import { ListFilter } from "lucide-react";
import { cn } from "@/lib/utils";

interface EarningsProps {
  data?: DashboardEarningsData;
  rangeLabel?: string;
}

export default function Earnings({
  data,
  rangeLabel = "30 Days",
}: EarningsProps) {
  const bars = data?.bars ?? [];
  const dataMax = Math.max(...bars.map((b) => b.value), 1);
  const total = data?.range ?? 0;
  const formatted = total.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const [dollars, cents] = formatted.split(".");

  return (
    <div className="@container min-w-80 bg-white rounded-30 grow-2 flex flex-col gap-6">
      <header className="flex items-center justify-between gap-1 text-default-tertiary px-4 py-5">
        <h2 className="font-medium leading-tight">Earnings</h2>
        <ListFilter size={24} />
      </header>
      <div className="flex @max-md:flex-col-reverse grow gap-6 items-end px-6 pb-6">
        <div className="flex @max-md:self-stretch items-end justify-between grow h-full min-h-27 gap-1.5">
          {bars.length > 0
            ? bars.map((bar, index) => {
                const heightPercent =
                  bar.value > 0 ? Math.max((bar.value / dataMax) * 100, 8) : 8;
                return (
                  <div key={bar.date || index} className="h-full flex items-end grow group">
                    <div
                      title={`${bar.date}: $${bar.value.toLocaleString()}`}
                      style={{ height: `${heightPercent}%` }}
                      className={cn(
                        "rounded-full grow transition-colors",
                        bar.value > 0
                          ? "bg-brand-orange/60 group-hover:bg-brand-orange"
                          : "bg-brand-orange/10 group-hover:bg-brand-orange/20"
                      )}
                    />
                  </div>
                );
              })
            : Array.from({ length: 14 }).map((_, index) => (
                <div key={index} className="h-full flex items-end grow group">
                  <div
                    style={{ height: "12%" }}
                    className="bg-brand-orange/10 rounded-full grow transition-colors"
                  />
                </div>
              ))}
        </div>
        <div className="flex flex-col py-6 gap-3 shrink-0">
          <span className="text-default/40 font-medium leading-tight">
            Total earning ({rangeLabel})
          </span>
          <span className="text-[32px] font-medium leading-tight">
            ${dollars}
            <span className="text-default-tertiary">.{cents}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
