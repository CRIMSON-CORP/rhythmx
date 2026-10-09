"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ArtistProps {
  id: string;
  image?: string | null;
  name: string;
  location?: string | null;
}

function Artist({ id, image, name, location }: ArtistProps) {
  const [imgSrc, setImgSrc] = useState(image || "/images/avatar.png");

  useEffect(() => {
    setImgSrc(image || "/images/avatar.png");
  }, [image]);

  return (
    <Link href={`/artists/${id}`} className="group flex flex-col items-center gap-1.5">
      <div className="aspect-square w-42 relative overflow-hidden rounded-full bg-default-secondary/30">
        <Image
          fill
          src={imgSrc}
          alt={name}
          className="rounded-full object-center object-cover transition-all duration-300 group-hover:scale-110"
          onError={() => setImgSrc("/images/avatar.png")}
        />
      </div>
      <div className="flex flex-col text-center max-w-full px-1">
        <span className="font-medium text-lg truncate max-w-40">{name}</span>
        {location ? (
          <span className="text-xs text-border-default-secondary truncate max-w-40">
            {location}
          </span>
        ) : null}
      </div>
    </Link>
  );
}

export default Artist;
