"use client";

import Icon from "@/components/icon";
import { mainOptions, managementOptions } from "@/data/nav-links";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PageTitle() {
  const pathname = usePathname();
  const currentPath = [...mainOptions, ...managementOptions]
    .filter((option) => option.href.trim() !== "")
    .find((option) => {
      const href = option.href.trim();
      if (href === "/") {
        return pathname === "/";
      }
      return pathname === href || pathname.startsWith(href + "/");
    });

  if (!currentPath) {
    return null;
  }

  const isHome = pathname === "/";

  return (
    <>
      <div className="@max-sm:hidden">
        {isHome ? (
          typeof currentPath.icon === "string" ? (
            <Icon name={currentPath.icon} size={20} className="text-default-tertiary" />
          ) : (
            <currentPath.icon size={20} className="text-default-tertiary" />
          )
        ) : (
          <Link href="/">
            {typeof currentPath.icon === "string" ? (
              <Icon name={currentPath.icon} size={20} className="text-default" />
            ) : (
              <currentPath.icon size={20} className="text-default" />
            )}
          </Link>
        )}
      </div>
      <span className="text-sm font-medium">{currentPath.title}</span>
    </>
  );
}
