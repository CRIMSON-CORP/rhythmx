"use client";
import TeamForm from "@/components/team-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

import { useState } from "react";

function NewTeam() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <span>New Team</span>
          <Plus size={16} />
        </Button>
      </DialogTrigger>
      <TeamForm onSuccess={() => setOpen(false)} />
    </Dialog>
  );
}

export default NewTeam;
