"use client";
import CreateArtistFlow from "@/components/CreateArtistFlow";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Clock, Link as LinkIcon, Loader2, Plus, User, X } from "lucide-react";
import Image from "next/image";
import { VisuallyHidden } from "radix-ui";
import { ReactNode, useState } from "react";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { goeyToast } from "goey-toast";
import { useRouter } from "next/navigation";

export function PendingInvitesTrigger({
  count,
  invites,
}: {
  count: number;
  invites?: ArtistInviteItem[];
}) {
  return (
    <Invites invites={invites}>
      <Button variant="white">
        <Clock size={16} />
        <span>Pending Invites ({count})</span>
      </Button>
    </Invites>
  );
}

export function InvitesInvitesTrigger({
  invites,
}: {
  invites?: ArtistInviteItem[];
}) {
  return (
    <Invites invites={invites}>
      <Button>
        <span className="text-sm leading-none">Add Artist</span>
        <Plus size={16} />
      </Button>
    </Invites>
  );
}

function Invites({
  children,
  invites = [],
}: {
  children: ReactNode;
  invites?: ArtistInviteItem[];
}) {
  const [emails, setEmails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.origin + "/auth/register");
      goeyToast.success("Invite link copied to clipboard");
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = emails.trim();
    if (!trimmed) {
      goeyToast.error("Please enter at least one email address.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post<InviteArtistResponse>(API_ROUTES.LABEL.ARTISTS.INVITE, {
        emails: trimmed,
      });

      const sentCount = res?.sent?.length ?? 0;
      const skippedItems = res?.skipped ?? [];

      const showSkippedWarning: () => void = () => {
        if (skippedItems.length === 0) return;
        if (skippedItems.length === 1) {
          goeyToast.warning(`${skippedItems[0].email} skipped`, {
            description: skippedItems[0].reason,
            duration: 4000,
          });
        } else {
          goeyToast.warning(`${skippedItems.length} invite(s) skipped`, {
            description: (
              <div className="flex flex-col gap-1 mt-1 text-xs">
                {skippedItems.map((item, idx) => (
                  <p key={idx}>
                    <span className="font-semibold">{item.email}:</span> {item.reason}
                  </p>
                ))}
              </div>
            ),
            duration: 5000,
          });
        }
      };

      if (sentCount > 0) {
        goeyToast.success(`${sentCount} invite(s) sent.`, { duration: 3000 });
        setEmails("");

        if (skippedItems.length > 0) {
          setTimeout(showSkippedWarning, 3000);
        }
      } else if (skippedItems.length > 0) {
        showSkippedWarning();
      }
      router.refresh();
    } catch (error) {
      console.error("Failed to send artist invites:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <button
            type="button"
            onClick={handleCopyLink}
            className="p-2 rounded-md bg-white flex items-center gap-2 hover:bg-white/80 transition-colors"
          >
            <span className="text-xs font-medium">Copy link</span>
            <LinkIcon size={16} className="text-brand-blue" />
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
          <div className="flex items-stretch gap-2.5">
            <form
              onSubmit={handleInvite}
              className="bg-white rounded-2xl overflow-hidden flex items-stretch outline outline-default-default grow"
            >
              <input
                type="email"
                autoComplete="email"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                disabled={isSubmitting}
                placeholder="Email, comma to seperate"
                className="grow p-4 leading-none outline-none disabled:opacity-50 text-sm"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 py-3 bg-brand-blue text-white font-medium flex items-center justify-center gap-2 disabled:opacity-70 transition-opacity"
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                <span>Invite</span>
              </button>
            </form>

            <CreateArtist />
          </div>
          <div className="flex flex-col gap-2.5">
            <p className="font-medium text-xs">Pending Invites</p>
            {invites.length > 0 ? (
              <ul className="divide-y divide-default-default max-h-96 overflow-y-auto">
                {invites.map((invite) => (
                  <li key={invite.invite_id} className="flex items-center gap-3 py-4">
                    <div className="bg-brand-purple/12 rounded-full p-1.5 shrink-0">
                      <User size={20} className="text-brand-purple" />
                    </div>
                    <div className="grow min-w-0">
                      <p className="text-default font-medium truncate text-sm">{invite.email}</p>
                      <p className="text-xs text-default">
                        <span>Status:</span>{" "}
                        <span className="text-[#FF9A03] capitalize">{invite.status}</span>
                      </p>
                    </div>
                    <p className="self-start text-default text-xs shrink-0">
                      {invite.created_at ? invite.created_at.slice(0, 16) : ""}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-8 text-center text-sm text-default-tertiary">
                No pending invites
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Invites;

function CreateArtist() {
  const [open, setOpen] = useState(false);

  return (
    <CreateArtistFlow
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button className="leading-none">
          <Plus size={20} />
        </Button>
      }
    />
  );
}
