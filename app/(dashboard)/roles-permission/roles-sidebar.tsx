"use client";

import { Command, Search, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRoles } from "./roles-provider";

interface RolesSidebarProps {
  initialRoles?: RoleItem[];
}

export default function RolesSidebar({ initialRoles }: RolesSidebarProps = {}) {
  const pathname = usePathname();
  const { roles: contextRoles } = useRoles();
  const [searchQuery, setSearchQuery] = useState("");

  const currentRoles = initialRoles?.length ? initialRoles : contextRoles;

  const filteredRoles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return currentRoles;
    return currentRoles.filter(
      (role) =>
        role.name?.toLowerCase().includes(query) ||
        role.description?.toLowerCase().includes(query) ||
        role.slug?.toLowerCase().includes(query),
    );
  }, [currentRoles, searchQuery]);

  return (
    <div className="bg-white rounded-30 p-4 md:p-6 flex flex-col gap-3 h-full overflow-auto min-h-112.5">
      <h2 className="font-medium text-xl">Roles</h2>

      {/* Client-side search input */}
      <div className="flex items-center px-4 py-3 gap-x-2 bg-page-background rounded-full">
        <Search size={16} className="text-default-tertiary shrink-0" />
        <input
          type="search"
          placeholder="Search Roles"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent outline-none w-full text-default font-medium text-sm placeholder:text-default-tertiary"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-default-tertiary hover:text-default p-0.5"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        ) : null}
      </div>

      {/* Animated roles list */}
      <motion.ul layout className="flex flex-col grow gap-3.5 max-h-150 overflow-y-auto px-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {filteredRoles.map((role) => {
            const isActive = pathname === `/roles-permission/${role.id}`;
            const teamCount = role.members ?? 0;

            return (
              <motion.li
                key={role.id}
                layout
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.75 }}
                transition={{ type: "spring", mass: 1.5, damping: 14, stiffness: 120 }}
              >
                <Link
                  href={`/roles-permission/${role.id}`}
                  className={`flex items-center gap-3 p-4 transition-colors hover:bg-neutral-50 ${
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
                    <span className="text-default/50 text-xs truncate">
                      {role.description || "No description"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Users size={16} className="text-neutral-400" />
                    <p className="text-border-default-secondary font-medium text-xs">
                      {teamCount} {teamCount === 1 ? "Team" : "Teams"}
                    </p>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </AnimatePresence>

        {filteredRoles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8 text-neutral-400 text-sm"
          >
            {searchQuery ? "No roles match your search." : "No roles created yet."}
          </motion.div>
        )}
      </motion.ul>
    </div>
  );
}
