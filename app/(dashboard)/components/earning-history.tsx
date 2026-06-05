import { earnings } from "@/data/earnings";
import { Avatar, AvatarGroup, AvatarGroupCount, AvatarImage } from "../../../components/ui/avatar";
import { EarningItem } from "./earning-item";

const earningAvatars = [
  "earning-avatar-1.png",
  "earning-avatar-2.png",
  "earning-avatar-3.png",
  "earning-avatar-3.png",
];

function EarningHistory() {
  const shown = earningAvatars.slice(0, 3);
  const hidden = earningAvatars.length - shown.length;
  return (
    <div className="bg-white rounded-30 flex flex-col w-full md:basis-84.5">
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
