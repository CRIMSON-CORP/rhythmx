"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Icon from "@/components/icon";

interface SidebarSearchProps {
  defaultValue?: string;
}

export default function SidebarSearch({ defaultValue = "" }: SidebarSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(defaultValue);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    // Skip initial mount if defaultValue matches query
    if (query === (searchParams.get("search") || "")) return;

    const timer = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (query) {
          params.set("search", query);
        } else {
          params.delete("search");
        }
        router.push(`?${params.toString()}`);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [query, router, searchParams]);

  return (
    <div className="flex items-center p-4 gap-x-2 bg-page-background rounded-full">
      <Icon name="search" size={16} />
      <input
        type="text"
        placeholder="Search Roles"
        className="bg-transparent outline-none w-full text-default font-medium"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
