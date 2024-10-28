"use client";

import React, { useEffect } from "react";
import { Presentation, Room } from "@prisma/client";
import CalendarPresenCard from "./CalendarPresenCard";

// Generate time labels in 15-minute intervals
function generateTimeLabels() {
    const labels = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const label = `${String(hour).padStart(2, "0")}:${String(
                minute,
            ).padStart(2, "0")}`;
            labels.push(label);
        }
    }
    return labels;
}
function CalendarView({
    presentations,
    conferenceStart,
    conferenceEnd,
}: {
    presentations: (Presentation & {
        room: Room;
        creator: {
            name: string | null;
        };
    })[];
    conferenceStart: Date;
    conferenceEnd: Date;
}) {
    const timeLabels = generateTimeLabels();
    const [minutes, setMinutes] = React.useState(
        new Date().getMinutes() + new Date().getHours() * 60,
    );

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setMinutes(now.getMinutes() + now.getHours() * 60);
        }, 60000); // Update every minute

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    return (
        <div
            className="grid grid-cols-[auto_1fr] gap-2 max-h-svh w-full sm:w-2/4 overflow-y-auto relative py-4"
            style={{
                scrollSnapType: "y mandatory",
                scrollPaddingTop: "1rem",
                scrollBehavior: "smooth",
            }}
            ref={(div) => {
                if (div) {
                    const totalHeight = div.scrollHeight - div.clientHeight;
                    div.scrollTop = totalHeight / 2;
                }
            }}
        >
            {/* Time Labels Column */}
            <div className="grid grid-rows-[repeat(288,minmax(0,1fr))] place-content-center w-fit">
                {Array(288)
                    .fill(null)
                    .map((_, i) => {
                        if (i % 3 !== 0) return null;

                        return (
                            <div
                                key={i}
                                className="text-right "
                                style={{
                                    gridRowStart: i + 1,
                                    gridRowEnd: i + 4,
                                }}
                            >
                                {timeLabels[i / 3]}
                            </div>
                        );
                    })}
                
                {/* Now stamp */}
                <div
                    className="bg-red-500 h-2 w-2 m-auto ml-1 rounded-full"
                    style={{
                        gridRow: Math.round(minutes / 5 + 2) + " / span 1",
                    }}
                ></div>
            </div>

            {/* Presentations Grid */}
            <div
                className="grid grid-rows-[repeat(288,minmax(0,1fr))]  "
                style={{ columnGap: "5px" }}
            >
                {/* For each presentation, create a card */}
                {presentations.map((presentation, i) => {
                    const startMinutes =
                        presentation.start.getMinutes() +
                        presentation.start.getHours() * 60;
                    const endMinutes =
                        presentation.end.getMinutes() +
                        presentation.end.getHours() * 60;

                    const rowStart = Math.round(startMinutes / 5); // Starting row based on 5-minute intervals
                    const rowSpan = Math.round((endMinutes - startMinutes) / 5); // Row span based on duration

                    return (
                        <CalendarPresenCard
                            key={i}
                            presentation={presentation}
                            rowStart={rowStart}
                            rowSpan={rowSpan}
                        />
                    );
                })}
                {/* adding the start of a conference */}
                <div
                    className="bg-slate-200 h-[1px] col-span-3 text-center relative"
                    style={{
                        gridRowStart: Math.round(
                            (conferenceStart.getMinutes() +
                                conferenceStart.getHours() * 60) /
                                5,
                        )+2,
                    }}
                >
                    <span className="absolute mx-2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-md">Start - {conferenceStart.toLocaleTimeString()}</span>
                </div>

                {/* adding the end of a conference */}
                <div
                    className="bg-slate-200 h-[1px] col-span-3 text-center relative"
                    style={{
                        gridRowStart: Math.round(
                            (conferenceEnd.getMinutes() +
                                conferenceEnd.getHours() * 60) /
                                5,
                        )+2,
                    }}
                >
                    <span className="absolute mx-2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-md">End - {conferenceEnd.toLocaleTimeString()}</span>
                </div>
            </div>
        </div>
    );
}

export default CalendarView;
