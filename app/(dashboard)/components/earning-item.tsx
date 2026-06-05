import Icon from "@/components/icon";
import { earnings } from "@/data/earnings";
import { formatCurrency } from "@/lib/money-formatter";

export function EarningItem({ source, type, title, amount }: (typeof earnings)[number]) {
  return (
    <li className="p-4 flex items-center gap-3">
      <div className="bg-brand-purple/12 rounded-full p-1.5">
        <Icon name="dollar" size={20} className="text-brand-purple" />
      </div>
      <div className="flex grow flex-col gap-0 5">
        <h4 className="font-medium text-sm">{source}</h4>
        <p className="text-xs text-[#454545]">
          {type}:{title}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Icon name="arrow-down" size={12} className="text-positive-tertiary" />
        <span className="font-medium text-sm">+{formatCurrency(amount)}</span>
      </div>
    </li>
  );
}
