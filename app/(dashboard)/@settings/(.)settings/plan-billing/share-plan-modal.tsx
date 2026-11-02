"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "radix-ui";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { goeyToast } from "goey-toast";
import { CONSTANTS } from "@/lib/constants";

interface SharePlanModalProps {
  subscription: UserSubscription | null;
  subscriberName: string;
  disabled?: boolean;
  trigger?: React.ReactNode;
  onInviteSent?: (invite: SubscriptionMemberInvite) => void;
}

export default function SharePlanModal({
  subscription,
  subscriberName,
  disabled = false,
  trigger,
  onInviteSent,
}: SharePlanModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "sent">("form");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const planName = subscription?.plan?.name || "Active";

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setTimeout(() => {
        setStep("form");
        setEmail("");
        setEmailError(null);
        setLoading(false);
      }, 200);
    }
  };

  const handleSendInvite = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError("Please enter an email address.");
      return;
    }

    try {
      setLoading(true);
      setEmailError(null);
      const res = await api.post<MemberInvitationResponse>(
        API_ROUTES.SUBSCRIPTION.MEMBER_INVITATIONS.INDEX,
        {
          email: trimmed,
        }
      );

      if (res?.invite) {
        onInviteSent?.(res.invite);
      }

      setStep("sent");
    } catch (err: unknown) {
      const errorObj = err as { errors?: Record<string, string>; message?: string };
      if (errorObj?.errors?.email) {
        setEmailError(errorObj.errors.email);
      }
      const errorMsg =
        err instanceof Error
          ? err.message
          : errorObj?.message || "Failed to send invite.";
      goeyToast.update(CONSTANTS.GLOBAL_ERROR_TOAST_ID, { title: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleViewSharing = () => {
    setOpen(false);
    router.push("/settings/plan-billing/sharing");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant="white-outline"
            disabled={disabled}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Share Plan
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="max-w-120 p-0 rounded-20 bg-white shadow-2xl overflow-hidden gap-0"
      >
        <VisuallyHidden.Root>
          <DialogTitle>{step === "form" ? "Share Plan" : "Invitation sent"}</DialogTitle>
        </VisuallyHidden.Root>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
          <h2 className="text-base font-semibold text-default">
            {step === "form" ? "Share Plan" : "Invitation sent"}
          </h2>
          <DialogClose asChild>
            <button
              type="button"
              className="p-1 rounded-full text-black hover:text-default hover:bg-black/5 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </DialogClose>
        </div>

        {/* Modal Body */}
        {step === "form" ? (
          <form onSubmit={handleSendInvite} className="px-6 py-4 flex flex-col gap-6">
            <p className="text-sm text-border-default-secondary leading-relaxed">
              Invite someone to share your subscription. They&apos;ll join your plan when they
              accept the email invitation.
            </p>

            {/* Plan Info Card */}
            <div className="bg-page-background rounded-20 p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-brand-purple-2 flex items-center justify-center text-white shrink-0">
                <svg width={24} height={24} viewBox="0 0 27 27" fill="none">
                  <path
                    d="M2.1875 13.125C2.1875 8.74234 2.1875 6.55156 3.46937 5.18984C4.75125 3.82812 6.81297 3.82812 10.9375 3.82812H15.3125C19.437 3.82812 21.4998 3.82812 22.7806 5.18984C24.0614 6.55156 24.0625 8.74234 24.0625 13.125C24.0625 17.5077 24.0625 19.6984 22.7806 21.0602C21.4987 22.4219 19.437 22.4219 15.3125 22.4219H10.9375C6.81297 22.4219 4.75016 22.4219 3.46937 21.0602C2.18859 19.6984 2.1875 17.5077 2.1875 13.125Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19.6873 18.047H16.4061M7.53357 11.8465C8.5606 11.2472 9.45638 11.4889 9.9945 11.8739C10.2154 12.0314 10.3259 12.1101 10.3904 12.1101C10.4561 12.1101 10.5654 12.0314 10.7864 11.8739C11.3245 11.4889 12.2203 11.2472 13.2473 11.8465C14.5948 12.634 14.8989 15.2306 11.7926 17.4214C11.1998 17.8381 10.9034 18.047 10.3904 18.047C9.87747 18.047 9.58107 17.8392 8.98935 17.4214C5.882 15.2306 6.18497 12.634 7.53357 11.8465Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <h4 className="font-medium text-default truncate">{planName} Plan</h4>
                <p className="text-xs text-border-default-secondary font-medium truncate">
                  Primary subscriber · {subscriberName}
                </p>
              </div>
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="share-plan-email" className="text-sm font-medium text-default">
                Email address
              </label>
              <input
                id="share-plan-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(null);
                }}
                placeholder="jordan.lee@example.com"
                className={`w-full px-4 py-3 rounded-xl border text-sm text-default placeholder:text-neutral-400 outline-none transition-all bg-white ${
                  emailError
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-default-default focus:border-black focus:ring-1 focus:ring-black"
                }`}
              />
              {emailError ? (
                <span className="text-xs text-red-500 font-medium">{emailError}</span>
              ) : (
                <span className="text-sm text-border-default-secondary">
                  Use the email address they use for their account.
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <DialogClose asChild>
                <Button variant="white-outline" type="button" size="md">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                size="md"
                variant="orange-outline"
                disabled={loading || !email.trim()}
                className="flex items-center gap-1.5"
              >
                {loading && <Loader2 size={13} className="animate-spin" />}
                <span>Send invite</span>
              </Button>
            </div>
          </form>
        ) : (
          /* Step: Invitation sent */
          <div className="p-6 flex flex-col gap-5">
            {/* Sent confirmation card */}
            <div className="bg-page-background rounded-20 p-4 flex flex-col gap-2.5 border border-black/5">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-default shadow-xs shrink-0">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.06348 7.97766L11.4958 10.0077C13.4966 11.1907 14.2958 11.1907 16.2978 10.0077L19.7301 7.97766M17.3968 20.2277C17.3968 20.2277 17.9801 20.2277 18.5635 21.3943C18.5635 21.3943 20.4161 18.4777 22.0635 17.8943"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="black"
                  />
                  <path
                    d="M25.6663 12.0307L25.6185 7.511C25.6057 5.79017 24.6758 2.34733 21.0627 2.34733H7.12217C5.52617 2.23067 2.33301 2.73817 2.33301 8.33233V16.6273C2.33301 18.0507 2.65034 19.9675 4.21134 21.1225C5.22167 21.8692 6.54584 21.9392 7.79767 22.001L10.4192 22.1305"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="black"
                  />
                  <path
                    d="M25.6429 19.7867C25.6429 23.0335 23.0237 25.6667 19.7909 25.6667C16.558 25.6667 13.9365 23.0335 13.9365 19.7867C13.9365 16.5375 16.558 13.9043 19.7909 13.9043C23.0237 13.9043 25.644 16.5375 25.644 19.7855"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="black"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-sm font-semibold text-default break-all">{email}</h4>
                <p className="text-xs text-border-default-secondary font-medium leading-relaxed">
                  An invitation to share your {planName} Plan is on its way.
                </p>
              </div>
            </div>

            <p className="text-xs text-border-default-secondary font-medium leading-relaxed">
              Sharing begins when they accept the invitation in their email. You can view pending
              invites in Sharing.
            </p>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleViewSharing}
                className="px-5 py-2.5 rounded-full border border-black text-default text-xs font-medium hover:bg-black/5 transition-colors cursor-pointer"
              >
                View sharing
              </button>
              <DialogClose asChild>
                <Button variant="orange-outline" type="button">
                  Done
                </Button>
              </DialogClose>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
