import { X } from "lucide-react";
import Image from "next/image";
import Icon from "../../../components/icon";

function MusicCard() {
  return (
    <aside className="bg-white p-4 rounded-20 flex items-center gap-4 w-full max-w-100">
      <Image
        src="/images/music-card-image.jpg"
        width={50}
        height={50}
        alt="Rainy Days"
        className="rounded-2xl"
      />
      <div className="flex flex-col gap-2 grow">
        <span className="text-lg font-medium leading-tight">Rainy Days</span>
        <p className="text-[#838383] leading-tight text-trim">Apple Music. Spotify. Deezer...</p>
      </div>
      <button className="self-start">
        <X size={16} className="text-default" />
      </button>
    </aside>
  );
}

export default MusicCard;
