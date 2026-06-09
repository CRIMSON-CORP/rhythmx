import {
  ChartNoAxesColumn,
  Command,
  Disc,
  Home,
  Inbox,
  Settings,
  Star,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";

export const mainOptions = [
  {
    href: "/",
    title: "Home",
    icon: Home,
    command: "⇧I",
  },
  {
    href: "/discography",
    title: "Discography",
    icon: Disc,
    command: "⇧C",
  },
  {
    href: "/artists",
    title: "Artists",
    icon: Star,
    command: "⇧A",
  },
  {
    href: "/trends-analytics",
    title: "Trends & Analytics",
    icon: ChartNoAxesColumn,
    command: "⇧T",
  },
  {
    href: "/earnings",
    title: "Earning",
    icon: "dollar",
    command: "⇧E",
  },
  {
    href: "/wallet",
    title: "Wallet",
    icon: Inbox,
    command: "⇧W",
  },
  {
    href: "/subscription",
    title: "Subscription",
    icon: Zap,
    command: "⇧S",
  },
];

export const managementOptions = [
  {
    href: "/team ",
    title: "Team",
    icon: Users,
    command: "",
  },
  {
    href: "/roles-permission ",
    title: "Roles & Permission",
    icon: Command,
    command: "",
  },
];

export const profileOptions = [
  {
    href: "/invite ",
    title: "Invite",
    icon: UserPlus,
    command: "⇧I",
  },
  {
    href: "/view-as-artist",
    title: "View As Artist",
    icon: Command,
    command: "⇧I",
  },
  {
    href: "/view-as-record-label ",
    title: "View As Record Label",
    icon: Command,
    command: "⇧I",
  },
  {
    href: "/view-as-royalty",
    title: "View As Royalty",
    icon: Command,
    command: "⇧I",
  },
  {
    href: "/settings",
    title: "Settings",
    icon: Settings,
    command: "⇧S",
  },
];
