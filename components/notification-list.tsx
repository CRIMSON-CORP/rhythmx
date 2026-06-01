import Image from "next/image";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  image?: string;
  type: string;
}

const mockNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "New Stream Milestone!",
    description:
      "Your album 'Album Title' has surpassed 500,000 streams today. Keep up the great work!",
    time: "2 hours ago",
    image: "/images/notification.png",
    type: "milestone",
  },
  {
    id: "2",
    title: "Payout Completed",
    description:
      "A transfer of $12,450.00 has been successfully processed and deposited to your bank account.",
    time: "5 hours ago",
    type: "earning",
  },
  {
    id: "3",
    title: "New Fan Engagement",
    description:
      "You have received 3,450 new listener saves on Apple Music and Spotify since yesterday.",
    time: "1 day ago",
    type: "engagement",
  },
  {
    id: "4",
    title: "Profile Verified Status",
    description:
      "Your artist profile has been verified successfully. Your verified badge is now active.",
    time: "2 days ago",
    type: "system",
  },
  {
    id: "5",
    title: "New Album Release",
    description:
      "Your new album has been released and is now available on all streaming platforms.",
    time: "1 week ago",
    type: "system",
  },
  {
    id: "6",
    title: "New Single Release",
    description:
      "Your new single has been released and is now available on all streaming platforms.",
    time: "1 week ago",
    type: "system",
  },
  {
    id: "7",
    title: "New Single Release",
    description:
      "Your new single has been released and is now available on all streaming platforms.",
    time: "1 week ago",
    type: "system",
  },
  {
    id: "8",
    title: "New Single Release",
    description:
      "Your new single has been released and is now available on all streaming platforms.",
    time: "1 week ago",
    type: "system",
  },
  {
    id: "9",
    title: "New Single Release",
    description:
      "Your new single has been released and is now available on all streaming platforms.",
    time: "1 week ago",
    type: "system",
  },
  {
    id: "10",
    title: "New Single Release",
    description:
      "Your new single has been released and is now available on all streaming platforms.",
    time: "1 week ago",
    type: "system",
  },
];

export default async function NotificationList() {
  return (
    <div className="flex flex-col gap-2.5">
      {mockNotifications.map((notification) => (
        <div
          key={notification.id}
          className="flex items-start gap-4 py-4 hover:bg-default-secondary/50 border-b border-b-default-default transition-all duration-200 group"
        >
          {notification.image ? (
            <Image
              src={notification.image}
              width={50}
              height={50}
              alt={notification.title}
              className="rounded-lg"
            />
          ) : null}
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <header className="flex items-center justify-between gap-2">
              <span className="font-medium text-default truncate">{notification.title}</span>
              <span className="text-sm text-default shrink-0">{notification.time}</span>
            </header>
            <p className="text-border-default-secondary font-medium text-sm leading-relaxed wrap-break-word">
              {notification.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
