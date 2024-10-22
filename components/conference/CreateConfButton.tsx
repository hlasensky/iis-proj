"use client";
import { CirclePlus } from "lucide-react";
import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ConfForm } from "./ConfForm";

function CreateConfButton({ classNameTrig }: { classNameTrig: string }) {
  return (
    <Dialog>
      <DialogTrigger className={classNameTrig}>
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
