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
}: {
    presentations: (Presentation & {
        room: Room;
        creator: {
            name: string | null;
        };
    })[];
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
                    const now = new Date();
                    const currentMinutes =
                        now.getHours() * 60 + now.getMinutes();
                    const totalMinutes = 24 * 60;
                    const scrollFraction = currentMinutes / totalMinutes;
                    const totalHeight = div.scrollHeight - div.clientHeight;
                    div.scrollTop = scrollFraction * totalHeight;
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
                    className="bg-red-500 h-2 w-2 rounded-full"
                    style={{
                        gridRow: Math.round(minutes / 5 + 2) + " / span 1",
                    }}
                ></div>
            </div>

            {/* Presentations Grid */}
            <div
                className="grid grid-rows-[repeat(288,minmax(0,1fr))] grid-cols-3"
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
            </div>
        </div>
    );
}

export default CalendarView;
