"use client";

import Icon from "@/components/icon";
import { mainOptions, managementOptions } from "@/data/nav-links";
import { usePathname } from "next/navigation";

export default function PageTitle() {
  const pathname = usePathname();
  const currentPath = [...mainOptions, ...managementOptions].find(
    (option) => option.href === pathname,
  );

  if (!currentPath) {
    return null;
  }

  return (
    <>
      <Icon name={currentPath.icon} size={20} className="text-default-tertiary" />
      <span className="text-sm font-medium">{currentPath.title}</span>
    </>
  );
}
