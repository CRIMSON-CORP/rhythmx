"use client";
import Image from "next/image";
import { Dialog, DialogTrigger } from "./ui/dialog";
import TeamForm from "./team-form";

interface TeamProps {
  id: string;
  image: string;
  name: string;
  role: string;
}
function Team({ id, image, name, role }: TeamProps) {
  return (
    <Dialog>
      <DialogTrigger className="flex flex-col items-center gap-1.5">
        <Image
          src={image}
          width={168}
          height={168}
          alt={name}
          className="rounded-30 w-full aspect-square max-w-42 object-center object-cover"
        />
        <div className="flex flex-col text-center">
          <span className="font-medium text-lg">{name}</span>
          <span className="text-xs text-border-default-secondary">{role}</span>
        </div>
      </DialogTrigger>
      <TeamForm id={id} image={image} name={name} role={role} />
    </Dialog>
  );
}

export default Team;
