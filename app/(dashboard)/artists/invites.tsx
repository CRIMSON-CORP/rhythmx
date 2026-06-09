"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Clock, Link, Plus, User, X } from "lucide-react";
import Image from "next/image";
import { VisuallyHidden } from "radix-ui";
import { ReactNode } from "react";

export function PendingInvitesTrigger() {
  return (
    <Invites>
      <Button variant="white">
        <Clock size={16} />
        <span>Pending Invites (3)</span>
      </Button>
    </Invites>
  );
}

export function InvitesInvitesTrigger() {
  return (
    <Invites>
      <Button>
        <span className="text-sm leading-none">Invite Artist</span>
        <Plus size={16} />
      </Button>
    </Invites>
  );
}

function Invites({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent showCloseButton={false} className="max-w-138 rounded-30 isolate gap-0">
        <VisuallyHidden.Root>
          <DialogTitle>Artist Invite Popup</DialogTitle>
          <DialogDescription>Artist Invite Popup</DialogDescription>
        </VisuallyHidden.Root>
        <div className="absolute w-full top-0 right-0 h-26 bg-linear-to-r from-[#8A38F5] to-[#0066FF] -z-10 opacity-25 blur-3xl pointer-none:"></div>
        <header className="px-6 py-5 flex items-center gap-2.5">
          <p className="text-sm font-medium grow">Invite Artist</p>
          <button className="p-2 rounded-md bg-white flex items-center gap-2">
            <span className="text-xs font-medium">Copy link</span>
            <Link size={16} className="text-brand-blue" />
          </button>
          <DialogClose className="p-2">
            <X size={20} />
          </DialogClose>
        </header>
        <div className="flex flex-col gap-4 px-8 pb-8">
          <Image
            src="/images/read-letter.png"
            width={84}
            height={61}
            alt="read letter"
            className="mx-auto scale-150"
          />
          <h3 className="text-center text-default font-medium text-base">Send Invite to artist</h3>
          <form
            action=""
            className="bg-white rounded-2xl overflow-hidden flex items-stretch outline outline-default-default"
          >
            <input type="text" placeholder="Email, comma to seperate" className="grow p-4" />
            <button className="px-7 py-4 bg-brand-blue text-white">Invite</button>
          </form>
          <div className="flex flex-col gap-2.5">
            <p className="font-medium text-xs">Pending Invites</p>
            <ul className="divide-y divide-default-default max-h-96 overflow-y-auto">
              {Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="flex items-center gap-3 py-4">
                  <div className="bg-brand-purple/12 rounded-full p-1.5">
                    <User size={20} className="text-brand-purple" />
                  </div>
                  <div className="grow">
                    <p className="text-default font-medium">mike.ross@example.com</p>
                    <p className="text-xs text-default">
                      <span>Status:</span> <span className="text-[#FF9A03]">Pending</span>
                    </p>
                  </div>
                  <p className="self-start text-default text-xs">2023-10-01 10:15</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Invites;
