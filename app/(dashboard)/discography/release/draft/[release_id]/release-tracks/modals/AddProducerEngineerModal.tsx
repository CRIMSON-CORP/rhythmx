"use client";

import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "radix-ui";
import { X, Check, LinkIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { goeyToast } from "goey-toast";
import ConnectPlatformModal, { type ConnectedProfile } from "./ConnectPlatformModal";
import { type ContributorRoleOption } from "../track-meta-fallbacks";
import { Button } from "@/components/ui/button";
import AppleMusicCircle from "@/components/icons/apple-music-circle";
import SpotifyDark from "@/components/icons/spotify-dark";

export interface ProducerEngineerData {
  name: string;
  role: string;
  spotify_id?: string;
  apple_music_id?: string;
}

interface AddProducerEngineerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles?: ContributorRoleOption[];
  onAdd: (data: ProducerEngineerData) => void;
}

export function AddProducerEngineerModal({
  open,
  onOpenChange,
  roles = [],
  onAdd,
}: AddProducerEngineerModalProps) {
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const [spotifyConnection, setSpotifyConnection] = useState<ConnectedProfile | null>(null);
  const [appleConnection, setAppleConnection] = useState<ConnectedProfile | null>(null);

  const [activePlatformModal, setActivePlatformModal] = useState<"spotify" | "apple" | null>(null);

  const resetForm = () => {
    setName("");
    setSelectedRole("");
    setSpotifyConnection(null);
    setAppleConnection(null);
  };

  const handleAdd = () => {
    if (!name.trim()) {
      goeyToast.error("Name Required", {
        description: "Please enter official name.",
      });
      return;
    }

    if (!selectedRole) {
      goeyToast.error("Role Required", {
        description: "Please select a role.",
      });
      return;
    }

    onAdd({
      name: name.trim(),
      role: selectedRole,
      spotify_id: spotifyConnection?.id,
      apple_music_id: appleConnection?.id,
    });

    resetForm();
    onOpenChange(false);
    goeyToast.success("Producer & engineer credit added");
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) resetForm();
          onOpenChange(isOpen);
        }}
      >
        <DialogContent
          className="max-w-150 rounded-30 p-0 overflow-hidden isolate gap-0 border border-default-default/20 shadow-2xl"
          showCloseButton={false}
        >
          <VisuallyHidden.Root>
            <DialogHeader>
              <DialogTitle>Add producer & engineer credit</DialogTitle>
              <DialogDescription>
                Add a producer, mixing engineer, or art director
              </DialogDescription>
            </DialogHeader>
          </VisuallyHidden.Root>

          {/* Top glow */}
          <div className="absolute w-full top-0 left-0 right-0 h-28 bg-linear-to-r from-[#9747FF] to-[#FFC107] -z-10 opacity-20 blur-3xl pointer-events-none" />

          {/* Header */}
          <header className="px-6 py-5 flex items-center justify-between border-b border-default-default/10">
            <span className="text-sm font-medium">Add producer & engineer credit</span>
            <DialogClose className="p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer">
              <X size={20} className="text-default" />
            </DialogClose>
          </header>

          <div className="p-6 flex flex-col gap-4">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-default">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter official name"
                className="w-full bg-white rounded-md border border-default-default p-4 leading-none font-medium outline-none focus:border-brand-orange transition-colors placeholder:text-border-default-secondary/70"
              />
            </div>

            {/* Role */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-default">Role</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full bg-white rounded-md border border-default-default p-4 leading-none font-medium outline-none focus:border-brand-orange transition-colors">
                  <SelectValue placeholder="Select key artist role" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {roles.map((r) => (
                    <SelectItem key={r.slug} value={r.slug}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-6">
              {/* Spotify connection row */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <SpotifyDark />
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium text-default">
                      Existing artist on Spotify?
                    </span>
                    <span className="text-xs text-border-default-secondary font-medium">
                      Does this artist have existing music on Spotify? *
                    </span>
                  </div>
                </div>

                {spotifyConnection ? (
                  <div className="flex items-center gap-2 p-2 rounded-full bg-[#EBFFEE] text-[#009951] border border-[#009951] text-xs font-medium shrink-0">
                    <span>Connected</span>
                    <Check size={16} />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActivePlatformModal("spotify")}
                    className="rounded-full p-2 px-3 bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-medium flex items-center gap-2 shrink-0 transition-colors cursor-pointer"
                  >
                    <span>Connect</span>
                    <LinkIcon size={16} />
                  </button>
                )}
              </div>

              {/* Apple Music connection row */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <AppleMusicCircle />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-default">
                      Existing artist on Apple Music?
                    </span>
                    <span className="text-xs text-border-default-secondary font-medium">
                      Does this artist have existing music on Apple Music? *
                    </span>
                  </div>
                </div>

                {appleConnection ? (
                  <div className="flex items-center gap-2 p-2 rounded-full bg-[#EBFFEE] text-[#009951] border border-[#009951] text-xs font-medium shrink-0">
                    <span>Connected</span>
                    <Check size={16} />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActivePlatformModal("apple")}
                    className="rounded-full p-2 px-3 bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-medium flex items-center gap-2 shrink-0 transition-colors cursor-pointer"
                  >
                    <span>Connect</span>
                    <LinkIcon size={16} />
                  </button>
                )}
              </div>
            </div>
            {/* Done Button */}
            <div className="pt-2 flex justify-center">
              <Button
                type="button"
                onClick={handleAdd}
                rounded={10}
                className="w-full max-w-63.75 mx-auto"
              >
                Add
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sub-modal for connecting Spotify or Apple Music */}
      {activePlatformModal && (
        <ConnectPlatformModal
          open={!!activePlatformModal}
          onOpenChange={(isOpen) => !isOpen && setActivePlatformModal(null)}
          platform={activePlatformModal}
          onSelectProfile={(profile) => {
            if (activePlatformModal === "spotify") {
              setSpotifyConnection(profile);
            } else {
              setAppleConnection(profile);
            }
          }}
        />
      )}
    </>
  );
}

export default AddProducerEngineerModal;
