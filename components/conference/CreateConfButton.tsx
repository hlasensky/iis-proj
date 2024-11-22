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
import { useAtom } from "jotai";
import { openPopupAtom } from "@/app/userAtom";

function CreateConfButton({ classNameTrig }: { classNameTrig: string }) {
    const [openPopup, setOpenPopup] = useAtom(openPopupAtom);

    return (
        <Dialog open={openPopup} onOpenChange={setOpenPopup}>
            <DialogTrigger className={classNameTrig}>
                <CirclePlus size={36} absoluteStrokeWidth />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create conference</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <ConfForm />
            </DialogContent>
        </Dialog>
    );
}

export default CreateConfButton;
