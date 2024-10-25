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
import { PresForm } from "./PresForm";

function CreatePresButton({ classNameTrig }: { classNameTrig: string }) {
    return (
        <Dialog>
            <DialogTrigger className={classNameTrig}>
                <CirclePlus size={36} absoluteStrokeWidth />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Vytvor Prezentaci</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <PresForm />
            </DialogContent>
        </Dialog>
    );
}

export default CreatePresButton;
