"use client";
import { createConference } from "@/actions/accountActions";
import { CirclePlus } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ConfForm } from "./ConfForm";

function CreateConfButton() {
  return (
    <Dialog>
      <DialogTrigger>
        <CirclePlus size={36} absoluteStrokeWidth />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vytvor konference</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ConfForm />
      </DialogContent>
    </Dialog>
  );
}

export default CreateConfButton;
