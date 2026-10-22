"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Inbox } from "lucide-react";

interface HeaderNotificationsClientProps {
  initialHasUnread: boolean;
}

export default function HeaderNotificationsClient({
  initialHasUnread,
}: HeaderNotificationsClientProps) {
  const [hasUnread, setHasUnread] = useState<boolean>(false);

  const currentHasUnread = hasUnread ?? initialHasUnread;

  useEffect(() => {
    const handleReadAll = () => {
      setHasUnread(false);
    };

    window.addEventListener("notifications:read-all", handleReadAll);
    return () => {
      window.removeEventListener("notifications:read-all", handleReadAll);
    };
  }, []);

  return (
    <Link href="/notifications" className="relative @max-2xl:hidden" aria-label="Notifications">
      <Inbox size={24} />
      {currentHasUnread && (
        <span className="absolute size-2.5 bg-danger-default rounded-full top-0 right-0 block" />
      )}
    </Link>
  );
}
