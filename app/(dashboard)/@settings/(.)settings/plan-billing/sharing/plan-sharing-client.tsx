"use client";

import { useState } from "react";
import { goeyToast } from "goey-toast";
import SharePlanModal from "../share-plan-modal";
import RemoveMemberModal, { PlanMember } from "../remove-member-modal";
import { Button } from "@/components/ui/button";
import { Loader2, User } from "lucide-react";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";

interface PlanSharingClientProps {
  subscription: UserSubscription | null;
  subscriberName: string;
  user: User | null;
  initialMember?: SharedMember | null;
  initialInvites?: SubscriptionMemberInvite[];
}

export default function PlanSharingClient({
  subscription,
  subscriberName,
  initialMember = null,
  initialInvites = [],
}: PlanSharingClientProps) {
  const planName = subscription?.plan?.name || "Kickstart";

  // Active member state
  const [member, setMember] = useState<PlanMember | null>(() => {
    if (initialMember) {
      return {
        id: String(initialMember.member_id),
        reference: initialMember.reference || String(initialMember.member_id),
        name: initialMember.name,
        email: initialMember.email,
        status: "active",
      };
    }
    return null;
  });

  // Invites state
  const [invites, setInvites] = useState<SubscriptionMemberInvite[]>(() => initialInvites || []);

  const [actionLoading, setActionLoading] = useState<{
    inviteId: number;
    action: "resend" | "cancel";
  } | null>(null);

  const handleInviteSent = (newInvite: SubscriptionMemberInvite) => {
    setInvites((prev) => [
      ...prev.filter((inv) => inv.email.toLowerCase() !== newInvite.email.toLowerCase()),
      newInvite,
    ]);
  };

  const handleMemberRemoved = () => {
    setMember(null);
    if (member) {
      setInvites((prev) =>
        prev.filter((inv) => inv.email.toLowerCase() !== member.email.toLowerCase()),
      );
    }
  };

  const handleInviteRemoved = (inviteId: number) => {
    setInvites((prev) => prev.filter((item) => item.invite_id !== inviteId));
    setMember(null);
  };

  const handleResendInvite = async (invite: SubscriptionMemberInvite) => {
    try {
      setActionLoading({ inviteId: invite.invite_id, action: "resend" });
      const res = await api.post<MemberInvitationResponse | null>(
        API_ROUTES.SUBSCRIPTION.RESEND_INVITATION(invite.invite_id),
        {},
      );
      goeyToast.success(`Invitation resent to ${invite.email}`);
      setInvites((prev) =>
        prev.map((item) =>
          item.invite_id === invite.invite_id
            ? { ...item, status: "pending", ...(res?.invite ? res.invite : {}) }
            : item,
        ),
      );
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to resend invitation.";
      goeyToast.error(errorMsg);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelInvite = async (invite: SubscriptionMemberInvite) => {
    const displayName = invite.name || invite.email;
    try {
      setActionLoading({ inviteId: invite.invite_id, action: "cancel" });
      await api.delete(API_ROUTES.SUBSCRIPTION.CANCEL_INVITATION(invite.invite_id));
      setInvites((prev) => prev.filter((item) => item.invite_id !== invite.invite_id));
      goeyToast.success(`Invitation for ${displayName} cancelled`);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to cancel invitation.";
      goeyToast.error(errorMsg);
    } finally {
      setActionLoading(null);
    }
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
          onInviteSent={handleInviteSent}
          trigger={
            <Button variant="orange-outline" type="button">
              Invite user
            </Button>
          }
        />
      </div>

      {/* Plan Info Card */}
      <div className="bg-page-background rounded-lg p-4 flex items-center gap-3.5">
        <div className="w-10.5 h-10.5 rounded-full data-[is-expired=true]:bg-black/50 bg-brand-purple-2 flex items-center justify-center text-white shrink-0">
          <svg id="loyalty-card" width={27} height={27} viewBox="0 0 27 27" fill="none">
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
          <h3 className="font-medium text-default truncate">{planName} Plan</h3>
          <p className="text-xs text-border-default-secondary font-medium truncate">
            Primary subscriber · {subscriberName}
          </p>
        </div>
      </div>

      {/* People on your plan */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-black">People on your plan</h3>

        <div className="flex flex-col bg-white rounded-2xl divide-y divide-black/5">
          {/* Row 1: Primary Subscriber */}
          <SharingPersonRow status="owner" name={subscriberName} subtitle="You · Plan owner" />

          {/* Invites (includes accepted, pending, expired) */}
          {invites.map((invite) => {
            const isAccepted = invite.status === "accepted" || invite.status === "active";
            const isActionLoading = actionLoading?.inviteId === invite.invite_id;
            const isResending = isActionLoading && actionLoading?.action === "resend";
            const isCancelling = isActionLoading && actionLoading?.action === "cancel";
            const displayName = invite.name || invite.email;

            const planMember: PlanMember = {
              id: String(invite.invite_id),
              reference: String(invite.invite_id),
              name: displayName,
              email: invite.email,
              status: "active",
            };

            return (
              <SharingPersonRow
                key={invite.invite_id || invite.email}
                status={invite.status}
                name={displayName}
                email={invite.email}
                planName={planName}
                member={isAccepted ? planMember : undefined}
                onRemoveMember={() => handleInviteRemoved(invite.invite_id)}
                onResend={() => handleResendInvite(invite)}
                onCancel={() => handleCancelInvite(invite)}
                isResending={isResending}
                isCancelling={isCancelling}
                isActionLoading={isActionLoading}
              />
            );
          })}
        </div>
      </div>

      {/* Footer Note */}
      <p className="text-sm text-border-default-secondary">
        Only you, as the primary subscriber, can manage sharing and billing.
      </p>
    </div>
  );
}

interface SharingPersonRowProps {
  name: string;
  email?: string;
  subtitle?: string;
  status: "owner" | "active" | "accepted" | "pending" | "expired" | string;
  planName?: string;
  member?: PlanMember;
  onRemoveMember?: () => void;
  onResend?: () => void;
  onCancel?: () => void;
  isResending?: boolean;
  isCancelling?: boolean;
  isActionLoading?: boolean;
}

function SharingPersonRow({
  name,
  email,
  subtitle,
  status,
  planName,
  member,
  onRemoveMember,
  onResend,
  onCancel,
  isResending,
  isCancelling,
  isActionLoading,
}: SharingPersonRowProps) {
  const isOwner = status === "owner";
  const isActive = status === "active" || status === "accepted";
  const isExpired = status === "expired";
  const isPending = !isOwner && !isActive && !isExpired;

  const showBottom = !isOwner && !isActive;

  return (
    <div
      className={`p-5 ${
        showBottom ? "flex flex-col gap-2" : "flex items-center justify-between gap-3"
      }`}
    >
      <div className={`flex items-center justify-between gap-4 ${!showBottom ? "w-full" : ""}`}>
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="size-9 rounded-full bg-page-background flex items-center justify-center text-border-default-secondary shrink-0">
            <User size={12} />
          </div>
          <div className="flex flex-col min-w-0">
            <h4
              className={`text-sm ${
                isOwner ? "font-medium" : "font-semibold"
              } text-default truncate`}
            >
              {name}
            </h4>
            <p className="text-xs text-border-default-secondary font-medium truncate">
              {subtitle || email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isOwner && (
            <span className="px-2.5 py-1.5 rounded-full bg-[#F2F3F5] text-border-default-secondary text-xs font-medium shrink-0">
              Primary subscriber
            </span>
          )}

          {isActive && (
            <>
              <span className="px-3 py-1 rounded-full bg-[#ECFDF3] text-[#027A48] text-xs font-semibold">
                Active
              </span>
              {member && (
                <RemoveMemberModal member={member} planName={planName} onRemove={onRemoveMember} />
              )}
            </>
          )}

          {isExpired && (
            <span className="px-3 py-1 rounded-full bg-[#FEF3F2] text-[#B42318] text-xs font-semibold shrink-0">
              Expired invite
            </span>
          )}

          {isPending && (
            <span className="px-3 py-1 rounded-full bg-[#FFFAEB] text-[#B54708] text-xs font-semibold shrink-0">
              Pending invite
            </span>
          )}
        </div>
      </div>

      {showBottom && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pl-0 sm:pl-12.5 pt-0.5">
          <p className="text-xs text-border-default-secondary">
            {isExpired
              ? "This invite has expired. Resend to invite again."
              : "No shared access until the email invite is accepted."}
          </p>
          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              disabled={isActionLoading}
              onClick={onResend}
              className="text-xs font-semibold text-default hover:underline cursor-pointer disabled:opacity-50 flex items-center gap-1"
            >
              {isResending && <Loader2 size={11} className="animate-spin" />}
              <span>Resend invite</span>
            </button>
            <button
              type="button"
              disabled={isActionLoading}
              onClick={onCancel}
              className="text-xs font-semibold text-[#D92D20] hover:underline cursor-pointer disabled:opacity-50 flex items-center gap-1"
            >
              {isCancelling && <Loader2 size={11} className="animate-spin" />}
              <span>Cancel invite</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
