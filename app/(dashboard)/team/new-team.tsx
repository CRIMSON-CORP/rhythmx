"use client";
import TeamForm from "@/components/team-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

function NewTeam() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <span>New Team</span>
          <Plus size={16} />
        </Button>
      </DialogTrigger>
      <TeamForm />
    </Dialog>
  );
}

export default NewTeam;
