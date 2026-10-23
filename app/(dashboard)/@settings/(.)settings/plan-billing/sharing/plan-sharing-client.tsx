"use client";

import { useRouter } from "next/navigation";
import { goeyToast } from "goey-toast";
import SharePlanModal from "../share-plan-modal";
import RemoveMemberModal from "../remove-member-modal";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface PlanSharingClientProps {
  subscription: UserSubscription | null;
  subscriberName: string;
  user: User | null;
}

export default function PlanSharingClient({
  subscription,
  subscriberName,
}: PlanSharingClientProps) {
  const router = useRouter();
  const planName = subscription?.plan?.name || "Kickstart";

  const handleResendInvite = (email: string) => {
    goeyToast.success(`Invitation resent to ${email}`);
    router.refresh();
  };

  const handleCancelInvite = (name: string) => {
    goeyToast.success(`Invitation for ${name} cancelled`);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-6 px-3 md:px-8 pb-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="flex flex-col">
          <h2 className="font-medium text-black">Sharing</h2>
          <p className="text-sm text-border-default-secondary mt-1">
            Manage who shares your {planName} Plan.
          </p>
        </div>

        <SharePlanModal
          subscription={subscription}
          subscriberName={subscriberName}
          trigger={
            <Button variant="orange-outline" type="button">
              Invite user
            </Button>
          }
        />
      </div>

      {/* Plan Info Card */}
      <div className="bg-page-background rounded-lg p-4 flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-brand-purple-2 flex items-center justify-center text-white shrink-0">
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
          <h3 className="font-semibold text-base text-default truncate">{planName} Plan</h3>
          <p className="text-xs text-border-default-secondary font-medium truncate">
            Primary subscriber · {subscriberName}
          </p>
        </div>
      </div>

      {/* People on your plan */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-black">People on your plan</h3>

        <div className="flex flex-col bg-white rounded-2xl">
          {/* Row 1: Primary Subscriber */}
          <div className="p-5 flex items-center justify-between gap-3">
            <div className="size-9 rounded-full bg-page-background flex items-center justify-center text-border-default-secondary shrink-0">
              <User size="14" />
            </div>
            <div className="flex flex-col min-w-0 grow">
              <h4 className="text-sm font-medium text-default truncate">{subscriberName}</h4>
              <p className="text-xs text-border-default-secondary font-medium">You · Plan owner</p>
            </div>
            <span className="px-2.5 py-1.5 rounded-full bg-[#F2F3F5] text-border-default-secondary text-xs font-medium shrink-0">
              Primary subscriber
            </span>
          </div>

          {/* Row 2: Active Shared Member */}
          <div className="p-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="size-9 rounded-full bg-page-background flex items-center justify-center text-border-default-secondary shrink-0">
                <User size="14" />
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="text-sm font-semibold text-default truncate">Jordan Lee</h4>
                <p className="text-xs text-border-default-secondary font-medium truncate">
                  jordan.lee@example.com
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="px-3 py-1 rounded-full bg-[#ECFDF3] text-[#027A48] text-xs font-semibold">
                Active
              </span>
              <RemoveMemberModal
                member={{
                  id: "jordan-lee",
                  name: "Jordan Lee",
                  email: "jordan.lee@example.com",
                  status: "active",
                }}
                planName={planName}
              />
            </div>
          </div>

          {/* Row 3: Pending Invitee */}
          <div className="p-5 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="size-9 rounded-full bg-page-background flex items-center justify-center text-border-default-secondary shrink-0">
                  <User size="14" />
                </div>
                <div className="flex flex-col min-w-0">
                  <h4 className="text-sm font-semibold text-default truncate">Taylor Quinn</h4>
                  <p className="text-xs text-border-default-secondary font-medium truncate">
                    taylor.quinn@example.com
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#FFFAEB] text-[#B54708] text-xs font-semibold shrink-0">
                Pending invite
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pl-0 sm:pl-13.5 pt-0.5">
              <p className="text-xs text-border-default-secondary">
                No shared access until the email invite is accepted.
              </p>
              <div className="flex items-center gap-4 shrink-0">
                <button
                  type="button"
                  onClick={() => handleResendInvite("taylor.quinn@example.com")}
                  className="text-xs font-semibold text-default hover:underline cursor-pointer"
                >
                  Resend invite
                </button>
                <button
                  type="button"
                  onClick={() => handleCancelInvite("Taylor Quinn")}
                  className="text-xs font-semibold text-[#D92D20] hover:underline cursor-pointer"
                >
                  Cancel invite
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <p className="text-sm text-border-default-secondary">
        Only you, as the primary subscriber, can manage sharing and billing.
      </p>
    </div>
  );
}
