"use client";

import { X, Trash2, Search, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/icon";
import { Switch } from "@/components/ui/switch";
import { Button } from "./ui/button";
import { goeyToast } from "goey-toast";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { getFirstFieldError } from "@/lib/utils";
import { CONSTANTS } from "@/lib/constants";
import { useRoles } from "@/app/(dashboard)/roles-permission/roles-provider";

interface PermissionsFormProps {
  roleId?: string;
}

export default function PermissionsForm({ roleId }: PermissionsFormProps) {
  const router = useRouter();
  const { roles, catalogue } = useRoles();

  const isEditMode = Boolean(roleId);
  const existingRole = roleId ? roles.find((r) => String(r.id) === String(roleId)) : undefined;

  const defaultPermissions = useMemo<Record<string, boolean>>(() => {
    if (!existingRole?.permissions) return {};
    if (Array.isArray(existingRole.permissions)) {
      const map: Record<string, boolean> = {};
      for (const key of existingRole.permissions) {
        map[key] = true;
      }
      return map;
    }
    if (typeof existingRole.permissions === "object") {
      return existingRole.permissions;
    }
    return {};
  }, [existingRole]);

  const [roleName, setRoleName] = useState<string | undefined>(undefined);
  const [roleDescription, setRoleDescription] = useState<string | undefined>(undefined);
  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<string, boolean> | undefined
  >(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentRoleName = roleName ?? existingRole?.name ?? "";
  const currentRoleDescription = roleDescription ?? existingRole?.description ?? "";
  const currentSelectedPermissions = selectedPermissions ?? defaultPermissions;

  // Handle individual toggle switches
  const handleTogglePermission = (permissionKey: string, checked: boolean) => {
    setSelectedPermissions((prev) => ({
      ...(prev ?? defaultPermissions),
      [permissionKey]: checked,
    }));
  };

  // Handle category master toggles
  const handleToggleCategory = (group: RoleCatalogueGroup, checked: boolean) => {
    setSelectedPermissions((prev) => {
      const next = { ...(prev ?? defaultPermissions) };
      for (const perm of group.permissions) {
        next[perm.key] = checked;
      }
      return next;
    });
  };

  // Check if all permissions in a category are active
  const isCategoryFullyEnabled = (group: RoleCatalogueGroup) => {
    if (!group.permissions?.length) return false;
    return group.permissions.every((p) => Boolean(currentSelectedPermissions[p.key]));
  };

  // Filter permission groups based on search input
  const filteredCatalogue = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return catalogue;

    return catalogue
      .map((group) => {
        const matchingPermissions = group.permissions.filter(
          (p) =>
            p.label?.toLowerCase().includes(query) ||
            p.key?.toLowerCase().includes(query) ||
            p.description?.toLowerCase().includes(query),
        );
        const groupMatches = group.label?.toLowerCase().includes(query);
        return {
          ...group,
          permissions: groupMatches ? group.permissions : matchingPermissions,
        };
      })
      .filter((group) => group.permissions.length > 0);
  }, [catalogue, searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentRoleName.trim()) {
      goeyToast.error("Role Name is required.");
      return;
    }

    if (!currentRoleDescription.trim()) {
      goeyToast.error("Role Description is required.");
      return;
    }

    const enabledKeys = Object.entries(currentSelectedPermissions)
      .filter(([, enabled]) => Boolean(enabled))
      .map(([key]) => key);

    const payload = {
      name: currentRoleName.trim(),
      description: currentRoleDescription.trim(),
      permissions: enabledKeys,
    };

    setIsSubmitting(true);
    try {
      if (isEditMode && roleId) {
        await api.patch(API_ROUTES.LABEL.ROLE(roleId), payload);
        goeyToast.success("Permissions updated successfully.");
        router.refresh();
      } else {
        await api.post(API_ROUTES.LABEL.ROLES, payload);
        goeyToast.success("Role created successfully.");
        router.push("/roles-permission");
        router.refresh();
      }
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

  const handleDelete = () => {
    if (!roleId || isDeleting) return;

    let warningToastId: string | number = "";
    warningToastId = goeyToast.warning(`Remove role ${currentRoleName || "this role"}?`, {
      description: "This will permanently remove the role from your label.",
      action: {
        label: "Confirm",
        onClick: async () => {
          goeyToast.dismiss(warningToastId);
          setIsDeleting(true);
          try {
            await api.delete(API_ROUTES.LABEL.ROLE(roleId));
            goeyToast.success("Role deleted successfully.");
            router.push("/roles-permission");
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 grow relative select-none">
      <div className="flex flex-col grow gap-2.5">
        <div className="flex items-center justify-between py-1">
          <h2 className="font-medium font-heading text-xl">Role Details & Permission</h2>
          <Link href="/roles-permission" className="p-2" aria-label="Close">
            <X size={20} />
          </Link>
        </div>

        {/* Role Name Row */}
        <div className="flex flex-col gap-2">
          <label className="text-default font-medium text-sm">Role Name</label>
          <div className="flex items-center gap-3 w-full">
            <input
              type="text"
              placeholder="e.g. A&R Manager"
              className="grow px-4 py-3.5 rounded-20 bg-white text-default font-medium placeholder:text-neutral-400 focus:border-brand-purple transition-colors"
              value={currentRoleName}
              onChange={(e) => setRoleName(e.target.value)}
              disabled={isSubmitting || isDeleting}
            />
            {isEditMode && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting || isDeleting}
                className="p-2.5 bg-brand-orange/10 hover:bg-brand-orange/20 text-brand-orange rounded-20 transition-colors shrink-0 disabled:opacity-50"
                title="Delete Role"
                aria-label="Delete Role"
              >
                {isDeleting ? <Loader2 size={24} className="animate-spin" /> : <Trash2 size={24} />}
              </button>
            )}
          </div>
        </div>

        {/* Role Description Row */}
        <div className="flex flex-col gap-2">
          <label className="text-default font-medium text-sm">Role Description</label>
          <input
            type="text"
            placeholder="e.g. Signs and manages artists"
            className="w-full px-4 py-3.5 rounded-20 outline-none bg-white text-default font-medium placeholder:text-neutral-400 focus:border-brand-purple transition-colors"
            value={currentRoleDescription}
            onChange={(e) => setRoleDescription(e.target.value)}
            disabled={isSubmitting || isDeleting}
          />
        </div>

        {/* Permissions Search & Title */}
        <div className="flex flex-col gap-4 grow">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h3 className="font-medium text-xl font-heading">Permissions</h3>
            <div className="flex items-center p-3 px-4 gap-x-2 bg-white rounded-full w-full max-w-117.5">
              <Search size={14} className="text-neutral-400 shrink-0" />
              <input
                type="search"
                placeholder="Search Permission"
                className="bg-transparent outline-none w-full text-xs text-default font-medium placeholder:text-neutral-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Grouped Permissions Checklist */}
          <div className="grow relative overflow-y-auto">
            <div className="absolute inset-0 flex flex-col gap-6 min-h-125 p-6 bg-white rounded-30">
              {filteredCatalogue.length > 0 ? (
                filteredCatalogue.map((group) => {
                  const isFullyEnabled = isCategoryFullyEnabled(group);

                  return (
                    <div key={group.key} className="flex flex-col gap-3">
                      {/* Category Header Row */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-border-default-secondary">
                          {group.label}
                        </span>
                        <Switch
                          checked={isFullyEnabled}
                          onCheckedChange={(checked) => handleToggleCategory(group, checked)}
                          disabled={isSubmitting || isDeleting}
                        />
                      </div>

                      {/* Permissions list */}
                      <ul className="flex flex-col gap-3">
                        {group.permissions.map((p) => {
                          const isEnabled = Boolean(currentSelectedPermissions[p.key]);

                          return (
                            <li key={p.key} className="flex items-center justify-between py-1">
                              <div className="flex items-center gap-3">
                                <div className="size-9.5 flex items-center justify-center bg-brand-blue/10 text-brand-blue rounded-xl shrink-0">
                                  <Icon name="list-setting" size={18} />
                                </div>
                                <span className="font-medium text-sm text-default">{p.label}</span>
                              </div>
                              <Switch
                                checked={isEnabled}
                                onCheckedChange={(checked) =>
                                  handleTogglePermission(p.key, checked)
                                }
                                disabled={isSubmitting || isDeleting}
                              />
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-neutral-400 text-sm">
                  No permissions match your search.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Submit Button */}
      <Button
        type="submit"
        rounded={10}
        className="min-w-60 mx-auto mt-auto"
        disabled={isSubmitting || isDeleting}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            <span>{isEditMode ? "Updating Role..." : "Creating Role..."}</span>
          </span>
        ) : isEditMode ? (
          "Update Role Permission"
        ) : (
          "Create Role"
        )}
      </Button>
    </form>
  );
}
