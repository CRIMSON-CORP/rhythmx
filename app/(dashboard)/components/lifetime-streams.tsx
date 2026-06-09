"use client";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Activity } from "lucide-react";

const data = [15, 21, 6, 10, 9, 20, 23, 10, 3, 24, 16, 22, 4, 5];

function LifeTimeStreamsInner() {
  const searchParams = useSearchParams();
  const timeSort = searchParams.get("time-sort");
  let lastDays = "30 Days";
  switch (timeSort) {
    case "daily":
      lastDays = "1 Day";
      break;
    case "weekly":
      lastDays = "7 Days";
      break;
    case "monthly":
      lastDays = "30 Days";
      break;
    case "yearly":
      lastDays = "12 months";
      break;
  }

  const dataMax = Math.max(...data);

  return (
    <div className="bg-white rounded-30 basis-91.25">
      <header className="flex items-center gap-1 text-default-tertiary px-4 py-5">
        <Activity size={16} />
        <h2 className="font-medium leading-tight">Lifetime Streams</h2>
      </header>
      <div className="flex flex-col px-6 pb-6 gap-6">
        <div className="flex flex-col gap-2 py-4 border-b border-b-default/10">
          <span className="font-heading text-xl font-medium leading-tight">192,463,897</span>
          <span className="text-default/40 font-medium leading-tight">Streams</span>
          <Link
            href=""
            className="text-default/40 font-medium px-9 py-2.5 rounded-full bg-default/5 leading-tight self-start"
          >
            See trends
          </Link>
        </div>
        <div className="flex flex-col gap-2 self-stretch">
          <span className="font-heading text-xl font-medium leading-tight">874,376</span>
          <span className="text-default/40 font-medium leading-tight">
            Total Stream Last {lastDays}
          </span>
          <div className="flex items-end justify-between h-12.5">
            {data.map((amount, index) => (
              <div
                key={index}
                style={{ height: (amount / dataMax) * 100 + "%" }}
                className="bg-brand-blue rounded-full w-1.5"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LifeTimeStreams() {
  return (
    <Suspense fallback={<div className="bg-white rounded-30 basis-91.25 h-[230px] animate-pulse" />}>
      <LifeTimeStreamsInner />
    </Suspense>
  );
}
