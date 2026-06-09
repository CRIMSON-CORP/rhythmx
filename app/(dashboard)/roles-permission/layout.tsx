import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col gap-6 h-full overflow-auto">
      <div className="container flex flex-wrap items-center justify-between gap-6">
        <h1 className="font-heading text-3xl md:text-5xl leading-tight font-semibold flex items-center gap-2.5 text-default">
          <span>Roles & Permission</span>
        </h1>
        <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
          <Select defaultValue="any">
            <SelectTrigger className="bg-white rounded-full flex px-4 py-3 items-center">
              <span>Filter:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start" className="outline-0! p-2">
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="any">
            <SelectTrigger className="bg-white rounded-full flex px-4 py-3 items-center">
              <span>Sort:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start" className="outline-0! p-2">
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Link
            href="/roles-permission/new"
            className="bg-black text-white p-4 rounded-full flex items-center gap-2 whitespace-nowrap"
          >
            <span className="leading-tight">New Role</span>
            <Plus size={16} />
          </Link>
        </div>
      </div>
      <div className="container h-full overflow-auto">{children}</div>
    </div>
  );
}

export default Layout;
