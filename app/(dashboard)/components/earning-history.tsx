import { formatCurrency } from "@/lib/money-formatter";
import Icon from "../../../components/icon";
import { Avatar, AvatarGroup, AvatarGroupCount, AvatarImage } from "../../../components/ui/avatar";

const earningAvatars = [
  "earning-avatar-1.png",
  "earning-avatar-2.png",
  "earning-avatar-3.png",
  "earning-avatar-3.png",
];

const earnings = [
  {
    id: "1",
    source: "Apple Music",
    type: "Single",
    title: "Sugar",
    amount: 0.32,
  },
  {
    id: "2",
    source: "Spotify",
    type: "Album",
    title: "Waves",
    amount: 0.45,
  },
  {
    id: "3",
    source: "Audiomack",
    type: "Album",
    title: "Good Ol Days",
    amount: 0.82,
  },
  {
    id: "4",
    source: "Tidal",
    type: "Single",
    title: "Tides",
    amount: 0.52,
  },
  {
    id: "5",
    source: "Apple Music",
    type: "Album",
    title: "New Waves",
    amount: 0.91,
  },
  {
    id: "6",
    source: "Spotify",
    type: "Album",
    title: "Summer Vibez",
    amount: 0.64,
  },
];

function EarningHistory() {
  const shown = earningAvatars.slice(0, 3);
  const hidden = earningAvatars.length - shown.length;
  return (
    <div className="bg-white rounded-30 flex flex-col basis-84.5">
      <header className="flex items-center justify-between gap-1 text-default-tertiary px-4 py-5">
        <h2 className="font-medium leading-tight">Earning History</h2>
        <div>
          <AvatarGroup>
            {shown.map((avatar, index) => (
              <Avatar key={index}>
                <AvatarImage src={`/images/${avatar}`} alt="avatar" />
              </Avatar>
            ))}
            <AvatarGroupCount>+{hidden}</AvatarGroupCount>
          </AvatarGroup>
        </div>
      </header>
      <ul>
        {earnings.slice(0, 4).map((earning) => (
          <EarningItem key={earning.id} {...earning} />
        ))}
      </ul>
    </div>
  );
}

export default EarningHistory;

function EarningItem({ source, type, title, amount }: (typeof earnings)[number]) {
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
