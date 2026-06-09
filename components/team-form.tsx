"use client";
import { X, Trash2 } from "lucide-react";
import Image from "next/image";
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

function TeamForm({ id = "", image = "", name = "", role = "" }: Partial<Team> = {}) {
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
              src={image}
              width={114}
              height={114}
              alt={name}
              className="rounded-30 aspect-square object-center object-cover"
            />
            <div className="flex flex-col items-start gap-6 grow">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-xl">{name}</span>
                <span className="text-[#8A38F5]">{role}</span>
              </div>
              <label
                htmlFor="avatar"
                className="outline outline-neutral-default rounded-30 px-3 py-2 flex items-center gap-2.5 font-medium text-xs"
              >
                <input type="file" name="avatar" id="avatar" className="hidden" />
                <Icon name="image" size={20} />
                <span className="text-default">Update Photo</span>
              </label>
            </div>
            <button className="bg-[#EC221F] rounded-full p-2">
              <Trash2 size={26.25} className="text-white" />
            </button>
          </div>
        ) : (
          <div className="flex items-center flex-col gap-2">
            <div className="w-26 aspect-square flex items-center justify-center rounded-full bg-brand-orange/10">
              <Icon name="user-square" size={48} />
            </div>
            <label
              htmlFor="avatar"
              className="outline outline-neutral-default rounded-20 p-1.5 flex items-center gap-2.5 font-medium text-xs"
            >
              <input type="file" name="avatar" id="avatar" className="hidden" />
              <Icon name="image" size={20} />
              <span className="text-default">Add Photo</span>
            </label>
          </div>
        )}
        <div className="p-8 flex flex-col gap-6">
          <Input label="First Name" value={name} onChange={(e) => {}} name="first-name" />
          <Input label="Last Name" value={name} onChange={(e) => {}} name="last-name" />
          <div className="flex flex-col gap-2">
            <p>Role</p>
            <Select>
              <SelectTrigger className="w-full p-4 rounded-10 bg-white outline-solid outline outline-[#D9D9D9]">
                <SelectValue placeholder="Select a Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="business-analyst">Business Analyst</SelectItem>
                  <SelectItem value="business-analyst">Business Analyst</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Input
            label="Set a Password"
            type="password"
            onChange={(e) => {}}
            name="password"
            placeholder="Password"
          />
          <Button className="max-w-63.25 mx-auto">Update team</Button>
        </div>
      </div>
    </DialogContent>
  );
}

export default TeamForm;
