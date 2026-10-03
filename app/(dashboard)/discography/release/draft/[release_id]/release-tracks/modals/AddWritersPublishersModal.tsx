"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "radix-ui";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { goeyToast } from "goey-toast";
import { type ContributorRoleOption } from "../track-meta-fallbacks";
import { Button } from "@/components/ui/button";

export interface WriterPublisherData {
  name: string;
  role: string;
  publishing_type: string;
}

interface AddWritersPublishersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles?: ContributorRoleOption[];
  publishingTypes?: PublishingType[];
  onAdd: (data: WriterPublisherData) => void;
}

export function AddWritersPublishersModal({
  open,
  onOpenChange,
  roles = [],
  publishingTypes,
  onAdd,
}: AddWritersPublishersModalProps) {
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPublishingType, setSelectedPublishingType] = useState("");

  const resetForm = () => {
    setName("");
    setSelectedRole("");
    setSelectedPublishingType("");
  };

  const selectedPublishingTypeData = useMemo(
    () => publishingTypes?.find((pt) => pt.slug === selectedPublishingType),
    [selectedPublishingType, publishingTypes],
  );

  const handleAdd = () => {
    if (selectedPublishingTypeData?.requires_publisher && !name.trim()) {
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
      publishing_type: selectedPublishingType || "copyright_control",
    });

    resetForm();
    onOpenChange(false);
    goeyToast.success("Writer & publisher credit added");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm();
        onOpenChange(isOpen);
      }}
    >
      <DialogContent
        className="max-w-130 rounded-30 p-0 overflow-hidden isolate gap-0 border border-default-default/20 shadow-2xl"
        showCloseButton={false}
      >
        <VisuallyHidden.Root>
          <DialogHeader>
            <DialogTitle>Add Writers & Publishers</DialogTitle>
            <DialogDescription>Add writer and publishing credit</DialogDescription>
          </DialogHeader>
        </VisuallyHidden.Root>

        {/* Top glow */}
        <div className="absolute w-full top-0 left-0 right-0 h-28 bg-linear-to-r from-[#9747FF] to-[#FFC107] -z-10 opacity-20 blur-3xl pointer-events-none" />

        {/* Header */}
        <header className="px-6 py-5 flex items-center justify-between border-b border-default-default/10">
          <span className="text-sm font-medium">Add Writers & Publishers</span>
          <DialogClose className="p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer">
            <X size={20} className="text-default" />
          </DialogClose>
        </header>

        <div className="p-6 flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-default">
              Name{" "}
              <span className="text-red-500">
                {selectedPublishingTypeData?.requires_publisher ? "*" : ""}
              </span>
            </label>
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

          {/* Publishing type */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-default">Publishing type</label>
            <Select value={selectedPublishingType} onValueChange={setSelectedPublishingType}>
              <SelectTrigger className="w-full bg-white rounded-md border border-default-default p-4 leading-none font-medium outline-none focus:border-brand-orange transition-colors">
                <SelectValue placeholder="Select publishing type" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {publishingTypes?.map((pt) => (
                  <SelectItem key={pt.slug} value={pt.slug}>
                    {pt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Add Button */}
          <div className="pt-2 flex justify-center">
            <Button rounded={10} type="button" onClick={handleAdd} className="w-full max-w-60">
              Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddWritersPublishersModal;
