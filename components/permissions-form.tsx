"use client";
import { Search, Trash2, X } from "lucide-react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/icon";
import { Switch } from "@/components/ui/switch";
import { goeyToast } from "goey-toast";
import { roles, DEFAULT_PERMISSIONS } from "@/data/roles";
import Link from "next/link";

interface PermissionsFormProps {
  roleId?: string;
}

export default function PermissionsForm({ roleId }: PermissionsFormProps) {
  const router = useRouter();
  const [roleName, setRoleName] = useState("");
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const isEditMode = !!roleId;

  // Initialize form states
  useEffect(() => {
    if (isEditMode) {
      const existingRole = roles.find((r) => r.id === roleId);
      if (existingRole) {
        setRoleName(existingRole.name);
        setPermissionGroups(JSON.parse(JSON.stringify(existingRole.permissions))); // Deep copy
      }
    } else {
      setRoleName("");
      setPermissionGroups(JSON.parse(JSON.stringify(DEFAULT_PERMISSIONS))); // Deep copy
    }
  }, [roleId, isEditMode]);

  // Handle individual toggle switches
  const handleTogglePermission = (
    categoryIndex: number,
    permissionIndex: number,
    checked: boolean,
  ) => {
    setPermissionGroups((prev) => {
      const next = [...prev];
      next[categoryIndex].permissions[permissionIndex].enabled = checked;
      return next;
    });
  };

  // Handle category master toggles
  const handleToggleCategory = (categoryIndex: number, checked: boolean) => {
    setPermissionGroups((prev) => {
      const next = [...prev];
      next[categoryIndex].permissions = next[categoryIndex].permissions.map((p) => ({
        ...p,
        enabled: checked,
      }));
      return next;
    });
  };

  // Check if all permissions in a category are active
  const isCategoryFullyEnabled = (group: PermissionGroup) => {
    return group.permissions.every((p) => p.enabled);
  };

  // Filter permission groups based on search input
  const filteredGroups = permissionGroups
    .map((group, groupIdx) => {
      const filteredPermissions = group.permissions.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      return {
        ...group,
        originalIndex: groupIdx,
        permissions: filteredPermissions,
      };
    })
    .filter((group) => group.permissions.length > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) {
      goeyToast.error("Role Name is required.");
      return;
    }

    if (isEditMode) {
      // Find role and update local memory mock
      const idx = roles.findIndex((r) => r.id === roleId);
      if (idx !== -1) {
        roles[idx].name = roleName;
        roles[idx].permissions = permissionGroups;
      }
      goeyToast.success("Permissions updated successfully.");
    } else {
      // Create a new role
      const newId = roleName.toLowerCase().replace(/\s+/g, "-");
      const newRole: Role = {
        id: newId,
        name: roleName,
        description:
          permissionGroups
            .flatMap((g) => g.permissions.filter((p) => p.enabled).map((p) => p.name))
            .slice(0, 4)
            .join(", ") || "No permissions defined",
        teamCount: 0,
        permissions: permissionGroups,
      };
      roles.unshift(newRole); // Add to the top of our mock list
      goeyToast.success("Role created successfully.");
      router.push(`/roles-permission/${newId}`);
    }
    router.refresh();
  };

  const handleDelete = () => {
    if (!roleId) return;
    const idx = roles.findIndex((r) => r.id === roleId);
    if (idx !== -1) {
      roles.splice(idx, 1);
    }
    goeyToast.success("Role deleted successfully.");
    router.push("/roles-permission");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 grow relative select-none">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between py-1">
          <h2 className="font-medium font-heading text-xl">Role Details & Permission</h2>
          <Link href="/roles-permission" className="p-2">
            <X size={20} />
          </Link>
        </div>
        {/* Role Name Row */}
        <div className="flex flex-col gap-2 py-2.5">
          <label className="text-default leading-tight">Role Name</label>
          <div className="flex items-center gap-3 w-full">
            <input
              type="text"
              placeholder="e.g. Business Analyst"
              className="grow px-4 py-5 rounded-20 leading-[0.7] outline-none bg-white text-default font-medium placeholder:text-neutral-400 transition-colors"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />
            {isEditMode && (
              <button
                type="button"
                onClick={handleDelete}
                className="p-2.5 bg-brand-orange/10 hover:bg-brand-orange/20 text-brand-orange rounded-20 transition-colors shrink-0"
                title="Delete Role"
              >
                <Trash2 size={33.75} />
              </button>
            )}
          </div>
        </div>

        {/* Permissions Search & Title */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h3 className="font-medium text-lg">Permissions</h3>
            <div className="flex items-center p-4 gap-x-2 bg-white rounded-full w-full max-w-117.5">
              <Search size={14} className="text-neutral-400" />
              <input
                type="text"
                placeholder="Search Permission"
                className="bg-transparent outline-none w-full text-xs text-default font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Grouped Permissions Checklist */}
          <div className="flex flex-col gap-6 max-h-125 overflow-y-auto p-6 bg-white rounded-30">
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => {
                const originalGroupIdx = group.originalIndex;
                const isFullyEnabled = isCategoryFullyEnabled(permissionGroups[originalGroupIdx]);

                return (
                  <div key={group.category} className="flex flex-col gap-3">
                    {/* Category Header Row */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-border-default-secondary tracking-wider">
                        {group.category}
                      </span>
                      <Switch
                        checked={isFullyEnabled}
                        onCheckedChange={(checked) =>
                          handleToggleCategory(originalGroupIdx, checked)
                        }
                      />
                    </div>

                    {/* Permissions list */}
                    <ul className="flex flex-col gap-3">
                      {group.permissions.map((p, permIdx) => {
                        // Find original index inside the original group list
                        const originalPermIdx = permissionGroups[
                          originalGroupIdx
                        ].permissions.findIndex((origP) => origP.id === p.id);

                        return (
                          <li key={p.id} className="flex items-center justify-between py-1">
                            <div className="flex items-center gap-3">
                              <div className="size-9.5 flex items-center justify-center bg-brand-blue/10 text-brand-blue rounded-lg shrink-0">
                                <Icon name="list-setting" size={18} />
                              </div>
                              <span className="font-medium text-default">{p.name}</span>
                            </div>
                            <Switch
                              checked={p.enabled}
                              onCheckedChange={(checked) =>
                                handleTogglePermission(originalGroupIdx, originalPermIdx, checked)
                              }
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

      {/* Action Submit Button */}
      <button
        type="submit"
        className="w-full max-w-[240px] py-3.5 rounded-full bg-black text-white hover:bg-neutral-800 transition-all font-semibold cursor-pointer select-none text-center mx-auto mt-auto"
      >
        {isEditMode ? "Update Role Permission" : "Create Role"}
      </button>
    </form>
  );
}
