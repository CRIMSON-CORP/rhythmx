"use client";
import Image from "next/image";
import { Dialog, DialogTrigger } from "./ui/dialog";
import TeamForm from "./team-form";
import { useState } from "react";

interface TeamProps {
  id: string;
  image: string;
  first_name: string;
  last_name: string;
  role: string;
  email: string;
}

function Team({ id, image, first_name, last_name, role, email }: TeamProps) {
  const [open, setOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const fullName = `${first_name} ${last_name}`.trim();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="group flex flex-col items-center gap-1.5 cursor-pointer text-left">
        <div className="w-full aspect-square max-w-42 rounded-30 overflow-hidden relative bg-default-secondary/30 shrink-0">
          <Image
            src={imgSrc || image}
            width={168}
            height={168}
            alt={fullName}
            className="rounded-30 w-full h-full object-center object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgSrc("/images/avatar.png")}
          />
        </div>
        <div className="flex flex-col text-center max-w-full px-1">
          <span className="font-medium text-lg truncate max-w-40">{fullName}</span>
          <span className="text-xs text-border-default-secondary truncate max-w-40">{role}</span>
        </div>
      </DialogTrigger>
      <TeamForm
        id={id}
        image={imgSrc || image}
        first_name={first_name}
        last_name={last_name}
        role={role}
        email={email}
        onSuccess={() => setOpen(false)}
      />
    </Dialog>
  );
}

export default Team;
