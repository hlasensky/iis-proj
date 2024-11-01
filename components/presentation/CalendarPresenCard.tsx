import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Presentation, Room } from "@prisma/client";
import { selectedPresentationAtom } from "@/app/userAtom";
import { useAtom } from "jotai";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent } from "../ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";

function CalendarPresenCard({
    presentation,
    rowStart,
    rowSpan,
    colStart,
}: {
    presentation: Presentation & {
        room?: Room | null;
        creator?: {
            name?: string | null;
        };
    };
    rowStart: number;
    rowSpan: number;
    colStart: number;
}) {
    const [selected, setSelected] = useAtom(selectedPresentationAtom);
    return (
        <Card
            onClick={() => setSelected(presentation)}
            style={{
                gridRowStart: 1 + rowStart,
                gridRowEnd: 1 + rowStart + rowSpan,
                gridColumnStart: colStart,
            }}
            className={cn(
                "bg-slate-200 my-1",
                selected?.id === presentation.id && "border-2 border-slate-400",
            )}
        >
            <CardHeader>{presentation.name}</CardHeader>
            <CardContent>
                <Popover>
                    <PopoverTrigger>Detail</PopoverTrigger>
                    <PopoverContent>
                        <p>{presentation.name}</p>
                        <p>
                            {presentation.start.toLocaleTimeString()} -{" "}
                            {presentation.start.toLocaleDateString()}
                        </p>
                        <p>
                            {presentation.end.toLocaleTimeString()} -{" "}
                            {presentation.end.toLocaleDateString()}{" "}
                        </p>
                        <p>{presentation.creator?.name}</p>
                        <p>{presentation.room?.name}</p>
                    </PopoverContent>
                </Popover>
            </CardContent>
        </Card>
    );
}

export default CalendarPresenCard;
