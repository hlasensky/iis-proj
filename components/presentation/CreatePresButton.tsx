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
import { useAtom } from "jotai";
import { openPopupAtom } from "@/app/userAtom";

function CreatePresButton({
    classNameTrig,
    conf,
    name,
}: {
    classNameTrig: string;
    conf?: string;
    name?: string;
}) {
    const [openPopup, setOpenPopup] = useAtom(openPopupAtom);
    return (
        <Dialog open={openPopup} onOpenChange={setOpenPopup}>
            <DialogTrigger className={classNameTrig}>
                <CirclePlus size={36} absoluteStrokeWidth />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Vytvor Prezentaci</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <PresForm edit={false} conf={conf} Cname={name} />
            </DialogContent>
        </Dialog>
    );
}

export default CreatePresButton;
