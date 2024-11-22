"use client";

import { Presentation } from "@prisma/client";
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import React, { useEffect, useState } from "react";
import CalendarView from "./CalendarView";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type UserMapType = Record<string, Presentation[]>;

function UserProgram({ userProgramMap }: { userProgramMap: UserMapType }) {
    const [selectedDay, setselectedDay] = useState("");
    const [dayStart, setdayStart] = useState<Date | null>(null);
    const [dayEnd, setdayEnd] = useState<Date | null>(null);
    useEffect(() => {
        if (selectedDay) {
            const start = new Date(selectedDay);
            start.setHours(0, 0);
            const end = new Date(selectedDay);
            end.setHours(23, 59);
            setdayStart(start);
            setdayEnd(end);
        }
    }, [selectedDay]);

    return (
        <>
            <ToggleGroup
                type="single"
                value={selectedDay}
                onValueChange={setselectedDay}
            >
                {Object.keys(userProgramMap).map((date) => (
                    <ToggleGroupItem value={date} aria-label={date} key={date}>
                        <p
                            className={cn(
                                "m-2 bg-white p-2 border border-black rounded-md text-black text-sm",
                                date === selectedDay
                                    ? "bg-black text-white"
                                    : "",
                            )}
                        >
                            {date}
                        </p>
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>
            {selectedDay ? (
                dayStart && dayEnd ? (
                    <CalendarView
                        conferenceStart={dayStart}
                        conferenceEnd={dayEnd}
                        presentations={userProgramMap[selectedDay]}
                        isProgram={false}
                    />
                ) : (
                    <Loader2 className="animate-spin" />
                )
            ) : (
                <h2>Please select day</h2>
            )}
        </>
    );
}

export default UserProgram;
