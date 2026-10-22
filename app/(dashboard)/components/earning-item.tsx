import Icon from "@/components/icon";
import { formatCurrency } from "@/lib/money-formatter";
import { ArrowDown } from "lucide-react";

interface EarningItemProps {
  source?: string;
  platform?: string;
  type?: string;
  title?: string;
  track?: string;
  amount: number;
}

export function EarningItem({
  source,
  platform,
  type,
  title,
  track,
  amount,
}: EarningItemProps) {
  const platformName = source || platform || "Streaming";
  const itemTitle = title || track;
  const subtitle = type && itemTitle ? `${type}: ${itemTitle}` : itemTitle || type || "Revenue";

  return (
    <li className="p-4 flex items-center gap-3">
      <div className="bg-brand-purple/12 rounded-full p-1.5">
        <Icon name="dollar" size={20} className="text-brand-purple" />
      </div>
      <div className="flex grow flex-col gap-0.5 min-w-0">
        <h4 className="font-medium text-sm truncate">{platformName}</h4>
        <p className="text-xs text-[#454545] truncate">{subtitle}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <ArrowDown size={12} className="text-positive-tertiary" />
        <span className="font-medium text-sm">+{formatCurrency(amount)}</span>
      </div>
    </li>
  );
}
