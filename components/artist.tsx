import Image from "next/image";
import Link from "next/link";

interface ArtistProps {
  id: string;
  image: string;
  name: string;
  location: string;
}
function Artist({ id, image, name, location }: ArtistProps) {
  return (
    <Link href={`/artists/${id}`} className="flex flex-col items-center gap-1.5">
      <Image
        src={image}
        width={168}
        height={168}
        alt={name}
        className="rounded-full w-full aspect-square max-w-42 object-center object-cover"
      />
      <div className="flex flex-col text-center">
        <span className="font-medium text-lg">{name}</span>
        <span className="text-xs text-border-default-secondary">{location}</span>
      </div>
    </Link>
  );
}

export default Artist;
