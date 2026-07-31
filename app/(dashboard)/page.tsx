import TimeSorterSelect from "@/components/time-sorter-select";
import Greeting from "./components/greeting";
import MusicCard from "./components/music-card";
import CompletProfileCard from "./components/complete-profile-card";
import LifeTimeStreams from "./components/lifetime-streams";
import Earnings from "./components/earnings";
import EarningHistory from "./components/earning-history";
import MyRelease from "./components/my-release";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";

export default async function Home() {
  const { releases } = await api.get<{ releases: Release[] }>(API_ROUTES.RELEASES.MY);

  return (
    <div className="flex flex-col gap-6 pb-6">
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
        <MyRelease releases={releases} />
      </div>
    </div>
  );
}
