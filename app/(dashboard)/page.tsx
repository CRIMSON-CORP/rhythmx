import { Suspense } from "react";
import TimeSorterSelect from "@/components/time-sorter-select";
import Greeting from "./components/greeting";
import MusicCard from "./components/music-card";
import CompletProfileCard from "./components/complete-profile-card";
import LifeTimeStreams from "./components/lifetime-streams";
import Earnings from "./components/earnings";
import EarningHistory from "./components/earning-history";
import MyRelease from "./components/my-release";

export default function Home() {
  return (
    <Suspense
      fallback={<div className="container py-10 text-default-tertiary">Loading dashboard...</div>}
    >
      <div className="flex flex-col gap-6">
        <div className="container flex flex-wrap items-center justify-between gap-6">
          <Greeting />
          <div className="flex flex-wrap grow justify-end items-center gap-6 md:gap-8">
            <TimeSorterSelect />
            <MusicCard />
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div className="container flex gap-6 flex-wrap">
            <CompletProfileCard />
            <LifeTimeStreams />
            <Earnings />
            <EarningHistory />
          </div>
          <MyRelease />
        </div>
      </div>
    </Suspense>
  );
}
