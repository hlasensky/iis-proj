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
}: {
    presentation: Presentation & {
        room?: Room | null;
        creator?: {
            name?: string | null;
        };
    };
    rowStart: number;
    rowSpan: number;
}) {
    const [selected, setSelected] = useAtom(selectedPresentationAtom);
    return (
        <Card
            onClick={() => setSelected(presentation)}
            style={{
                gridRowStart: rowStart,
                gridRowEnd: rowStart + rowSpan,
            }}
            className={cn(
                "bg-slate-200",
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
