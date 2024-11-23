import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Presentation, Room } from "@prisma/client";
import { selectedPresentationAtom } from "@/app/userAtom";
import { useAtom } from "jotai";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent } from "../ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "../ui/button";
import {
    addToMyProgram,
    removeFromMyProgram,
} from "@/actions/presentationActions";
import { toast } from "sonner";

function CalendarPresenCard({
    presentation,
    rowStart,
    rowSpan,
    isProgram,
}: {
    presentation: Presentation & {
        room?: Room | null;
        creator?: {
            name?: string | null;
        };
    };
    rowStart: number;
    rowSpan: number;
    isProgram?: boolean;
}) {
    const [selected, setSelected] = useAtom(selectedPresentationAtom);

    return (
        <Card
            onClick={() => setSelected(presentation)}
            style={{
                gridRowStart: 1 + rowStart,
                gridRowEnd: 1 + rowStart + rowSpan,
            }}
            className={cn(
                "bg-slate-200 my-1",
                selected?.id === presentation.id && "border-2 border-slate-300",
            )}
        >
            <CardHeader>{presentation.name}</CardHeader>
            <CardContent className="space-x-5">
                <Popover>
                    <PopoverTrigger>Detail</PopoverTrigger>
                    <PopoverContent>
                        <p className="text-xl">{presentation.name}</p>
                        <p>
                            {presentation.start?.toLocaleTimeString()} -{" "}
                            {presentation.start?.toLocaleDateString()}
                        </p>
                        <p>
                            {presentation.end?.toLocaleTimeString()} -{" "}
                            {presentation.end?.toLocaleDateString()}{" "}
                        </p>
                        <p>{presentation.creator?.name}</p>
                        <p>{presentation.room?.name}</p>
                        <p>Capacity: {presentation.room?.capacity}</p>
                    </PopoverContent>
                </Popover>
                {isProgram !== undefined && (
                    <Button
                        onClick={async () => {
                            if (isProgram) {
                                // Handle adding to the program
                                const res = await addToMyProgram(presentation);
                                if (res === 200) {
                                    toast.success("Successfully added");
                                } else {
                                    toast.error("Failed to add");
                                }
                            } else {
                                // Handle removing from the program
                                const res = await removeFromMyProgram(
                                    presentation,
                                );
                                if (res === 200) {
                                    toast.success("Successfully removed");
                                } else {
                                    toast.error("Failed to remove");
                                }
                            }
                        }}
                    >
                        {isProgram ? "Add to my program" : "Remove"}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

export default CalendarPresenCard;
