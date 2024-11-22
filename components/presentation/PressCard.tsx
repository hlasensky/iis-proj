"use client"; // This is a Client Component

import { useState } from "react"; // Import useState
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card";
import { Presentation } from "@prisma/client";
import { Button } from "../ui/button";
import { deletePresentation } from "@/actions/presentationActions";
import { PresForm } from "./PresForm";

interface PressCardProps {
    presentation: Presentation;
}

export default function PressCard({ presentation }: PressCardProps) {
    const [openEdit, setOpenEdit] = useState(false);

    const handleDelete = async () => {
        await deletePresentation(presentation.id);
        window.location.reload();
    };

    return (
        <Card className="m-4 ">
            <CardHeader>
                <h1>{presentation.name}</h1>
                <CardDescription>{presentation.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>
                    {presentation.evaluated === null
                        ? "Pending"
                        : presentation.evaluated === true
                        ? "Accepted"
                        : "Rejected"}
                </p>
                {(presentation.evaluated === null ||
                    presentation.evaluated === false) && (
                    <div className="flex space-x-10">
                        <Button
                            onClick={() => {
                                if (openEdit) {
                                    setOpenEdit((prevState) => !prevState);
                                } else {
                                    setOpenEdit((prevState) => !prevState);
                                }
                            }}
                        >
                            <p>
                                {openEdit ? "Close edit" : "Edit presentation"}
                            </p>
                        </Button>

                        <Button onClick={handleDelete}>
                            Delete presentation
                        </Button>
                    </div>
                )}
                {openEdit && (
                    <div>
                        <PresForm
                            edit={true}
                            pres={presentation}
                            setOpenEdit={setOpenEdit}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
