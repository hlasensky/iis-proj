"use client";

import React, { useEffect, useState } from "react";
import { Presentation, Room } from "@prisma/client";
import CalendarPresenCard from "./CalendarPresenCard";

const NUMBER_OF_5_MINUTE_INTERVALS_IN_A_DAY = (24 * 60) / 5;

function generateTimeLabels() {
    const labels = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 5) {
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
    isProgram,
}: {
    presentations: (Presentation & {
        room?: Room | null;
        creator?: {
            name: string | null;
        };
    })[];
    conferenceStart: Date;
    conferenceEnd: Date;
    isProgram?: Boolean;
}) {
    const calculate5MinuteIntervals = (date: Date) =>
        Math.round((date.getMinutes() + date.getHours() * 60) / 5);

    const [conferenceStartIn5Minutes, setConferenceStartIn5Minutes] =
        useState<number>(calculate5MinuteIntervals(conferenceStart));
    const [conferenceEndIn5Minutes, setConferenceEndIn5Minutes] =
        useState<number>(calculate5MinuteIntervals(conferenceEnd));

    useEffect(() => {
        setConferenceStartIn5Minutes(
            calculate5MinuteIntervals(conferenceStart),
        );
        setConferenceEndIn5Minutes(calculate5MinuteIntervals(conferenceEnd));
    }, [conferenceStart, conferenceEnd]);

    const timeSpan = conferenceEnd.getTime() - conferenceStart.getTime();
    const timeSpanIn5Minutes = timeSpan / 1000 / 60 / 5;

    const timeLabels = generateTimeLabels();
    const [minutes, setMinutes] = useState(
        new Date().getMinutes() + new Date().getHours() * 60,
    );

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setMinutes(now.getMinutes() + now.getHours() * 60);
        }, 60000); // Update every minute

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    if (!presentations) return null;

    return (
        <div
            className="grid gap-2 max-h-svh w-full sm:w-2/4 overflow-y-auto relative py-4"
            style={{
                scrollSnapType: "y mandatory",
                scrollPaddingTop: "1rem",
                scrollBehavior: "smooth",
            }}
        >
            {/* Presentations Grid */}
            <div
                className={`grid grid-rows-[repeat(${timeSpanIn5Minutes},minmax(0,1fr))] grid-cols-[auto_1fr_1fr]`}
                style={{ columnGap: "5px" }}
            >
                {/* Time labels */}
                {Array(NUMBER_OF_5_MINUTE_INTERVALS_IN_A_DAY)
                    .fill(null)
                    .slice(conferenceStartIn5Minutes, conferenceEndIn5Minutes)
                    .map((_, i) => {
                        const key = i + conferenceStartIn5Minutes;

                        return (
                            <div
                                key={i}
                                className="text-right text-xs col-start-1"
                                style={{
                                    gridRowStart: i + 1,
                                }}
                            >
                                {timeLabels[key]}
                            </div>
                        );
                    })}

                {/* Now stamp */}
                <div
                    className="bg-red-500 h-2 w-2 m-auto ml-1 rounded-full col-start-2"
                    style={{
                        gridRow:
                            minutes / 5 - conferenceStartIn5Minutes < 0
                                ? 1
                                : Math.round(minutes / 5) -
                                  conferenceStartIn5Minutes +
                                  " / span 1",
                    }}
                ></div>
                {/* For each presentation, create a card */}
                {presentations.map((presentation, i) => {
                    const startMinutes = presentation.start
                        ? presentation.start.getMinutes() +
                          presentation.start.getHours() * 60
                        : 0;
                    const endMinutes = presentation.end
                        ? presentation.end.getMinutes() +
                          presentation.end.getHours() * 60
                        : 0;

                    const rowStart = Math.round(startMinutes / 5); // Starting row based on 5-minute intervals
                    const rowSpan = Math.round((endMinutes - startMinutes) / 5); // Row span based on duration

                    return (
                        <CalendarPresenCard
                            key={i}
                            presentation={presentation}
                            rowStart={rowStart - conferenceStartIn5Minutes}
                            rowSpan={rowSpan}
                            isProgram={isProgram}
                        />
                    );
                })}
                {/* adding the start of a conference */}
                {/* <div
                    className="bg-slate-200 h-[1px] col-span-3 text-center relative"
                    style={{
                        gridRowStart: 0,
                    }}
                >
                    <span className="absolute mx-2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-md">
                        Start - {conferenceStart.toLocaleTimeString()}
                    </span>
                </div> */}

                {/* adding the end of a conference */}
                {/* <div
                    className="bg-slate-200 h-[1px] col-span-3 text-center relative"
                    style={{
                        gridRowStart: timeSpanIn5Minutes,
                    }}
                >
                    <span className="absolute mx-2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-md">
                        End - {conferenceEnd.toLocaleTimeString()}
                    </span>
                </div> */}
            </div>
        </div>
    );
}

export default CalendarView;
