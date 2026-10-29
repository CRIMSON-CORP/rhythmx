import { cn } from "@/lib/utils";

interface BarItem {
  date: string;
  value: number;
}

interface MiniBarChartProps {
  bars?: BarItem[];
  className?: string;
  barColor?: string;
  dimColor?: string;
}

export default function MiniBarChart({
  bars = [],
  className = "",
  barColor = "bg-default-tertiary",
  dimColor = "bg-default-tertiary/20",
}: MiniBarChartProps) {
  const dataMax = Math.max(...bars.map((b) => b.value), 1);

  if (!bars || bars.length === 0) {
    return (
      <div className={cn("flex items-end justify-between h-12.5 gap-0.5", className)}>
        {Array.from({ length: 14 }).map((_, index) => (
          <div
            key={index}
            style={{ height: "8%" }}
            className={cn("rounded-full w-1.5", dimColor)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-end justify-between h-12.5 gap-0.5", className)}>
      {bars.map((bar, index) => {
        const heightPercent = bar.value > 0 ? Math.max((bar.value / dataMax) * 100, 8) : 8;
        return (
          <div
            key={bar.date || index}
            title={`${bar.date}: ${bar.value.toLocaleString()}`}
            style={{ height: `${heightPercent}%` }}
            className={cn(
              "rounded-full w-1.5 transition-all",
              bar.value > 0 ? barColor : dimColor
            )}
          />
        );
      })}
    </div>
  );
}

