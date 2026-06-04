"use client";

import Icon from "@/components/icon";
import { DialogClose } from "@/components/ui/dialog";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

function Releases({
  title,
  releases,
  type = "approved",
}: {
  title: string;
  releases: ReleaseResult[];
  type?: "approved" | "pending" | "rejected";
}) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <header className="p-5 flex items-center gap-4 text-default justify-between">
        <span className="text-sm leading-tight font-semibold ">{title}</span>
        <DialogClose className="p-2">
          <Icon name="cancel" size={24} className="text-default" />
        </DialogClose>
      </header>
      <div className="px-3 md:px-6 pb-10.5 overflow-auto">
        <header className="flex gap-1.5 md:gap-4 flex-wrap items-center">
          <div className="flex items-center grow w-full gap-2.5 px-4 py-3 bg-white/20 rounded-full">
            <Icon name="search" size={16} className="text-default-tertiary" />
            <input
              placeholder="Search anything"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none w-full text-border-default-secondary"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="bg-white/30 rounded-full flex px-4 py-3 items-center text-xs md:text-base">
              <span className="text-default-tertiary">Filter:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start" className="outline-0! p-2">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="any">
            <SelectTrigger className="bg-white/30 rounded-full flex px-4 py-3 items-center text-xs md:text-base">
              <span className="text-default-tertiary">Artists:</span>
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
          <Select defaultValue="recent">
            <SelectTrigger className="bg-white/30 rounded-full flex px-4 py-3 items-center text-xs md:text-base">
              <span className="text-default-tertiary">Sort:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start" className="outline-0! p-2">
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="unpopular">Unpopular</SelectItem>
            </SelectContent>
          </Select>
        </header>
        <div className="p-4 flex flex-col gap-5 overflow-auto">
          {releases.map((release) => (
            <div key={release.id} className="flex items-center gap-4 group overflow-auto">
              <Image
                src={release.image}
                alt={release.title}
                width={50}
                height={50}
                className="rounded-full size-14 object-cover shrink-0"
              />
              <div className="flex flex-col grow overflow-auto">
                <span className="font-medium text-lg truncate">{release.title}</span>
                <div className="flex items-center gap-2 text-sm mt-0.5 overflow-x-auto">
                  <span className="text-default-tertiary font-medium text-xs">{release.type}</span>
                  <span className="text-border-default-secondary text-xs truncate">
                    {release.platforms}
                  </span>
                </div>
              </div>
              {type === "approved" ? (
                <div className="p-2.5 rounded-20 bg-[#DCFCE7] text-[#14532D]">Approved</div>
              ) : type === "pending" ? (
                <div className="p-2.5 rounded-20 bg-[#FFF1C2] text-[#FF9A03] flex items-center gap-2">
                  <Icon name="clock" size={16} />
                  Pending
                </div>
              ) : (
                <div className="w-fit whitespace-nowrap p-2.5 bg-white/30 rounded-20 text-xs text-brand-blue">
                  Update & Submit
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Releases;
