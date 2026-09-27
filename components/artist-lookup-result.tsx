import Image from "next/image";
import Spotify from "./icons/spotify";
import AppleMusicRoundedRectangle from "./icons/apple-music-rounded-rectangle";
import { Button } from "./ui/button";
import UserSharing from "./icons/user-sharing";

interface ArtistLookupResultProps {
  platform: "spotify" | "apple";
  artist: ConnectedArtist;
  value: string;
  handleAdd: (artist: ConnectedArtist) => void;
  handleRemove: () => void;
}

function ArtistLookupResult({
  platform,
  artist,
  value,
  handleAdd,
  handleRemove,
}: ArtistLookupResultProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10.5 h-10.5 relative rounded-full overflow-hidden shrink-0 bg-neutral-100 flex items-center justify-center">
          {artist.image_url ? (
            <Image src={artist.image_url} alt={artist.name} fill className="object-cover" />
          ) : (
            <UserSharing size={16} />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-black truncate">{artist.name}</p>
          <p className="text-xs text-border-default-secondary truncate">
            {artist.latest_release || artist.id}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {platform === "spotify" ? (
          <Spotify color="black" size={26.25} />
        ) : (
          <AppleMusicRoundedRectangle size={26.25} />
        )}
        {value === artist.id ? (
          <Button
            size="sm"
            type="button"
            variant="white-outline"
            onClick={handleRemove}
            className="text-xs"
          >
            Remove
          </Button>
        ) : (
          <Button
            size="sm"
            type="button"
            variant="white-outline"
            onClick={() => handleAdd(artist)}
            className="text-xs"
          >
            Add
          </Button>
        )}
      </div>
    </div>
  );
}

export default ArtistLookupResult;
