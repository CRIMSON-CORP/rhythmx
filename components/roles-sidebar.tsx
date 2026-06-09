import { Command, Search, Users } from "lucide-react";
import Link from "next/link";
import { roles } from "@/data/roles";
import SidebarSearch from "./sidebar-search";
import { Suspense } from "react";

interface RolesSidebarProps {
  searchQuery?: string;
  activeRoleId?: string;
}

export default function RolesSidebar({ searchQuery = "", activeRoleId }: RolesSidebarProps) {
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="bg-white rounded-30 p-4 md:p-6 flex flex-col gap-3 h-full overflow-auto min-h-112.5">
      <h2 className="font-medium text-xl">Roles</h2>
      <Suspense
        fallback={
          <div className="flex items-center p-4 gap-x-2 bg-page-background rounded-full">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search Roles"
              disabled
              className="bg-transparent outline-none w-full text-default font-medium"
            />
          </div>
        }
      >
        <SidebarSearch defaultValue={searchQuery} />
      </Suspense>
      <ul className="flex flex-col gap-3.5 max-h-150 overflow-y-auto pr-1">
        {filteredRoles.length > 0 ? (
          filteredRoles.map((role) => {
            const isActive = role.id === activeRoleId;
            const searchParams = new URLSearchParams();
            if (searchQuery) {
              searchParams.set("search", searchQuery);
            }
            const queryString = searchParams.toString();
            const href = `/roles-permission/${role.id}${queryString ? `?${queryString}` : ""}`;

            return (
              <li key={role.id}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 p-4 transition-all hover:bg-neutral-50 ${
                    isActive
                      ? "rounded-20 bg-neutral-50"
                      : "border-b border-b-default-default bg-white"
                  }`}
                >
                  <div className="size-11 flex items-center justify-center bg-brand-purple/10 text-brand-purple rounded-20 shrink-0">
                    <Command size={27.5} />
                  </div>
                  <div className="flex flex-col grow min-w-0">
                    <h3 className="font-medium text-sm truncate">{role.name}</h3>
                    <span className="text-default/50 text-xs truncate">{role.description}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Users size={16} className="text-neutral-400" />
                    <p className="text-border-default-secondary font-medium text-xs">
                      {role.teamCount} {role.teamCount === 1 ? "Team" : "Teams"}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })
        ) : (
          <div className="text-center py-8 text-neutral-400 text-sm">
            No roles match your search.
          </div>
        )}
      </ul>
    </div>
  );
}
