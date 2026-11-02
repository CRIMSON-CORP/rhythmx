"use client";

import { X, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Icon from "./icon";
import Input from "./Input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { VisuallyHidden } from "radix-ui";
import { goeyToast } from "goey-toast";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { getFirstFieldError } from "@/lib/utils";
import { CONSTANTS } from "@/lib/constants";

type UpdateTeamMemberPayload = Partial<Omit<CreateTeamMemberPayload, "email">>;

interface TeamFormProps extends Partial<Team> {
  onSuccess?: () => void;
}

function TeamForm({
  id = "",
  image = "",
  first_name = "",
  last_name = "",
  role = "",
  email: initialEmail = "",
  onSuccess,
}: TeamFormProps = {}) {
  const router = useRouter();

  const [firstName, setFirstName] = useState<string | undefined>(undefined);
  const [lastName, setLastName] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [roleId, setRoleId] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState("");

  const currentFirstName = firstName ?? first_name;
  const currentLastName = lastName ?? last_name;
  const currentEmail = email ?? initialEmail;
  const memberFullName = `${currentFirstName} ${currentLastName}`.trim();

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const matchedRoleId =
    role && roles.length > 0
      ? roles.find((r) => r.name.toLowerCase() === role.toLowerCase())?.id?.toString()
      : undefined;
  const currentRoleId = roleId || matchedRoleId || "";

  // Fetch roles from GET /api/label/roles on mount
  useEffect(() => {
    let isMounted = true;
    async function loadRoles() {
      setIsLoadingRoles(true);
      try {
        const res = await api.get<LabelRolesResponse>(API_ROUTES.LABEL.ROLES);
        if (isMounted && res?.roles) {
          const activeRoles = res.roles.filter((r) => r.is_active !== false);
          setRoles(activeRoles);
        }
      } catch {
        // api.ts automatically displays error toasts on failed requests
      } finally {
        if (isMounted) setIsLoadingRoles(false);
      }
    }

    loadRoles();
    return () => {
      isMounted = false;
    };
  }, []);

  // Revoke avatar preview on cleanup
  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      goeyToast.error("Photo must be less than 2 MB");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      goeyToast.error("Only JPG, PNG or WebP images are allowed");
      return;
    }

    setAvatarFile(file);
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleDelete = () => {
    if (!id || isDeleting) return;

    let warningToastId: string | number = "";
    warningToastId = goeyToast.warning(`Remove ${memberFullName || "team member"}?`, {
      description: "This will remove the member from your label team.",
      action: {
        label: "Confirm",
        onClick: async () => {
          goeyToast.dismiss(warningToastId);
          setIsDeleting(true);
          try {
            await api.delete(API_ROUTES.LABEL.TEAM_MEMBER(id));
            goeyToast.success("Team member deleted successfully");
            onSuccess?.();
            router.refresh();
          } catch (err: any) {
            const firstFieldError = getFirstFieldError(err);
            if (firstFieldError) {
              goeyToast.update(CONSTANTS.GLOBAL_ERROR_TOAST_ID, {
                title: firstFieldError,
                type: "error",
              });
            } else if (err?.message) {
              goeyToast.error(err.message);
            }
          } finally {
            setIsDeleting(false);
          }
        },
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentFirstName.trim()) {
      goeyToast.error("First Name is required");
      return;
    }

    if (!currentLastName.trim()) {
      goeyToast.error("Last Name is required");
      return;
    }

    if (!id) {
      if (!currentEmail.trim()) {
        goeyToast.error("Email is required");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(currentEmail.trim())) {
        goeyToast.error("Please enter a valid email address");
        return;
      }
    }

    if (!currentRoleId) {
      goeyToast.error("Please select a role");
      return;
    }

    if (!id) {
      if (!password) {
        goeyToast.error("Password is required");
        return;
      }

      if (password.length < 8) {
        goeyToast.error("Password must be at least 8 characters");
        return;
      }
    } else {
      if (password && password.length < 8) {
        goeyToast.error("Password must be at least 8 characters");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (id) {
        const updatePayload: UpdateTeamMemberPayload = {
          first_name: currentFirstName.trim(),
          last_name: currentLastName.trim(),
          role_id: Number(currentRoleId),
        };
        if (password.trim()) {
          updatePayload.password = password.trim();
        }

        await api.patch(API_ROUTES.LABEL.TEAM_MEMBER(id), updatePayload);

        if (avatarFile) {
          try {
            const formData = new FormData();
            formData.append("avatar", avatarFile);
            await api.postFormData({
              url: API_ROUTES.LABEL.TEAM_AVATAR(id),
              formData,
            });
          } catch {
            goeyToast.warning("Team member was updated, but avatar photo failed to upload.");
          }
        }

        goeyToast.success("Team member updated successfully");
        onSuccess?.();
        router.refresh();
      } else {
        const payload: CreateTeamMemberPayload = {
          first_name: currentFirstName.trim(),
          last_name: currentLastName.trim(),
          email: currentEmail.trim().toLowerCase(),
          password,
          role_id: Number(currentRoleId),
        };

        const res = await api.post<CreateTeamMemberResponse>(API_ROUTES.LABEL.TEAM, payload);
        const reference = res?.reference || res?.member?.reference;

        if (avatarFile && reference) {
          try {
            const formData = new FormData();
            formData.append("avatar", avatarFile);
            await api.postFormData({
              url: API_ROUTES.LABEL.TEAM_AVATAR(reference),
              formData,
            });
          } catch {
            goeyToast.warning("Team member was created, but avatar photo failed to upload.");
          }
        }

        goeyToast.success("Team member created successfully");
        onSuccess?.();
        router.refresh();
      }
      resetState();
    } catch (err: any) {
      const firstFieldError = getFirstFieldError(err);
      if (firstFieldError) {
        goeyToast.update(CONSTANTS.GLOBAL_ERROR_TOAST_ID, {
          title: firstFieldError,
          type: "error",
        });
      } else if (err?.message) {
        goeyToast.error(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  function resetState() {
    setFirstName(undefined);
    setLastName(undefined);
    setEmail(undefined);
    setRoleId(undefined);
    setPassword("");
    setAvatarFile(null);
    setAvatarPreview(null);
  }

  useEffect(() => {
    return () => {
      resetState();
    };
  }, []);

  return (
    <DialogContent showCloseButton={false} className="gap-0 max-w-138">
      <DialogHeader className="flex-row items-center justify-between px-6 py-5">
        <DialogTitle className="text-sm text-default font-medium">Team</DialogTitle>
        <DialogClose className="p-2 text-default">
          <X size={20} />
        </DialogClose>
      </DialogHeader>
      <VisuallyHidden.Root>
        <DialogDescription>Team Management Popup</DialogDescription>
      </VisuallyHidden.Root>
      <div className="absolute w-full top-0 right-0 h-27.75 bg-linear-to-r from-[#0080FF] to-[#9747FF] -z-10 opacity-25 blur-3xl pointer-events-none"></div>
      <div>
        {id ? (
          <div className="px-8 py-4 flex items-center gap-6">
            <Image
              src={avatarPreview || image || "/images/avatar.png"}
              width={114}
              height={114}
              alt={memberFullName}
              className="rounded-30 aspect-square object-center object-cover"
            />
            <div className="flex flex-col items-start gap-6 grow">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-xl">{memberFullName}</span>
                <span className="text-[#8A38F5]">{role}</span>
              </div>
              <label
                htmlFor="edit-avatar"
                className="outline outline-neutral-default rounded-30 px-3 py-2 flex items-center gap-2.5 font-medium text-xs cursor-pointer hover:bg-neutral-50 transition-colors"
              >
                <input
                  type="file"
                  name="avatar"
                  id="edit-avatar"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={isSubmitting || isDeleting}
                />
                <Icon name="image" size={20} />
                <span className="text-default">{avatarFile ? "Change Photo" : "Update Photo"}</span>
              </label>
            </div>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting || isDeleting}
              className="bg-[#EC221F] rounded-full p-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              aria-label="Delete team member"
            >
              {isDeleting ? (
                <Loader2 size={26.25} className="text-white animate-spin" />
              ) : (
                <Trash2 size={26.25} className="text-white" />
              )}
            </button>
          </div>
        ) : (
          <div className="flex items-center flex-col gap-2">
            <div className="w-26 aspect-square flex items-center justify-center rounded-full bg-brand-orange/10 relative overflow-hidden">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Team avatar preview"
                  fill
                  className="rounded-full object-cover object-center"
                />
              ) : (
                <Icon name="user-square" size={48} />
              )}
            </div>
            <label
              htmlFor="new-team-avatar"
              className="outline outline-neutral-default rounded-20 p-1.5 flex items-center gap-2.5 font-medium text-xs cursor-pointer hover:bg-neutral-50 transition-colors"
            >
              <input
                type="file"
                name="avatar"
                id="new-team-avatar"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={isSubmitting}
              />
              <Icon name="image" size={20} />
              <span className="text-default">{avatarFile ? "Change Photo" : "Add Photo"}</span>
            </label>
          </div>
        )}
        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
          <Input
            label="First Name"
            value={currentFirstName}
            onChange={(e) => setFirstName(e.target.value)}
            name="first-name"
            placeholder="e.g. Ada"
            disabled={isSubmitting || isDeleting}
          />
          <Input
            label="Last Name"
            value={currentLastName}
            onChange={(e) => setLastName(e.target.value)}
            name="last-name"
            placeholder="e.g. Obi"
            disabled={isSubmitting || isDeleting}
          />
          <Input
            label="Email Address"
            type="email"
            value={currentEmail}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            placeholder="e.g. ada@example.com"
            disabled={isSubmitting || isDeleting || !!id}
          />
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-default">Role</p>
            <Select
              value={currentRoleId}
              onValueChange={setRoleId}
              disabled={isSubmitting || isDeleting || isLoadingRoles}
            >
              <SelectTrigger className="w-full p-4 rounded-10 bg-white outline-solid outline outline-[#D9D9D9]">
                <SelectValue placeholder={isLoadingRoles ? "Loading roles..." : "Select a Role"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={String(r.id)}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Input
            label={id ? "Change Password" : "Set a Password"}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            placeholder={
              id ? "Leave blank to keep current password" : "Enter password (min 8 chars)"
            }
            disabled={isSubmitting || isDeleting}
          />
          {id ? (
            <Button
              type="submit"
              rounded={10}
              className="min-w-63.25 mx-auto"
              disabled={isSubmitting || isDeleting || isLoadingRoles}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span>Updating team...</span>
                </span>
              ) : (
                "Update team"
              )}
            </Button>
          ) : (
            <Button
              type="submit"
              rounded={10}
              className="min-w-63.25 mx-auto"
              disabled={isSubmitting || isDeleting || isLoadingRoles}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span>Creating team...</span>
                </span>
              ) : (
                "Create team"
              )}
            </Button>
          )}
        </form>
      </div>
    </DialogContent>
  );
}

export default TeamForm;
