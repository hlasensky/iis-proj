"use client";

import { CellContext, ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { changeEvaluatedStatus } from "@/actions/adminActions";
import { Conference, Presentation, Room, users } from "@prisma/client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { getConferences, getRooms } from "@/actions/conferenceActions";

type CellProps = Presentation & { conference: Conference } & { creator: users };

const ChangeStatusCell = (data: CellContext<CellProps, unknown>) => {
    return (
        <Select
            onValueChange={(val) =>
                toast.promise(
                    new Promise(async (resolve, reject) => {
                        try {
                            const response = await changeEvaluatedStatus(
                                data.row.original.id,
                                (val as string) === "allow" ? true : false,
                            );
                            if (response === 200) {
                                resolve("Presentation status changed");
                            } else if (!response) {
                                reject(
                                    "Failed to change presentation evaluation: Presentation not found",
                                );
                            } else {
                                reject("Failed to change Presentation status");
                            }
                        } catch (e) {
                            reject("Failed to change Presentation " + e);
                        }
                    }),
                    {
                        loading: "Changing Presentation status...",
                        success: "Presentation status changed",
                        error: (err) => err,
                    },
                )
            }
        >
            <SelectTrigger id="evaluated">
                <SelectValue placeholder="Not evaluated" />
            </SelectTrigger>
            <SelectContent position="popper">
                <SelectItem value="allow">Allow</SelectItem>
                <SelectItem value="disallow">Disallow</SelectItem>
            </SelectContent>
        </Select>
    );
};

const roundToNearestFiveMinutes = (timeStr: string): string => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const roundedMinutes = Math.round(minutes / 5) * 5;
    const formattedMinutes =
        roundedMinutes === 60 ? "00" : String(roundedMinutes).padStart(2, "0");
    const formattedHours = (roundedMinutes === 60 ? hours + 1 : hours)
        .toString()
        .padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}`;
};

// Converts a time string ("HH:MM") to a Date object for today’s date
const timeStringToDate = (timeStr: string): Date => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
};

const AddStartTimeCell = (data: CellContext<CellProps, unknown>) => {
    const [startTime, setStartTime] = useState("");
    const [conference, setConference] = useState<Conference | null>(null);

    useEffect(() => {
        const fetchConference = async () => {
            const conference = await getConferences(
                data.row.original.conferenceId,
            );
            setConference(conference as Conference);
        };
        fetchConference();
    }, [data.row.original, data.row.original.conferenceId]);

    const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const roundedTime = roundToNearestFiveMinutes(e.currentTarget.value);
        const startDate = timeStringToDate(roundedTime);

        console.log(conference);

        // Validate if the end time is after the start time
        if (!conference || startDate < conference.startTime) {
            toast.error("End time must be after the start time.");
            return;
        }

        setStartTime(roundedTime);

        // Assign the converted Date object to the row data
        data.row.original.start = startDate
    };

    return (
        <Input
            type="time"
            step={300}
            min="00:00"
            max="23:59"
            value={startTime}
            onChange={handleStartTimeChange}
        />
    );
};

const AddEndTimeCell = (data: CellContext<CellProps, unknown>) => {
    const [endTime, setEndTime] = useState(""); // default at least 5 minutes after 00:00
    const [conference, setConference] = useState<Conference | null>(null);

    useEffect(() => {
        const fetchConference = async () => {
            const conference = await getConferences(
                data.row.original.conferenceId,
            );
            setConference(conference as Conference);
        };
        fetchConference();
    }, [data.row.original, data.row.original.conferenceId]);

    const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const roundedTime = roundToNearestFiveMinutes(e.currentTarget.value);

        const startDate = data.row.original.start;
        const endDate = timeStringToDate(roundedTime);

        console.log(conference);

        // Validate if the end time is after the start time
        if (
            !startDate ||
            !conference ||
            endDate <= startDate ||
            startDate < conference.startTime ||
            endDate > conference.endTime
        ) {
            toast.error("End time must be after the start time.");
            return;
        }

        setEndTime(roundedTime);

        // Assign the converted Date object to the row data
        data.row.original.end = endDate;
    };

    return (
        <Input
            type="time"
            step={300}
            min="00:05"
            max="23:59"
            value={endTime}
            onChange={handleEndTimeChange}
        />
    );
};

const AddRoomCell = (data: CellContext<CellProps, unknown>) => {
    const [rooms, setRooms] = useState<Room[] | null>(null);

    useEffect(() => {
        const fetchPress = async () => {
            const roomsFetched = await getRooms(data.row.original.conferenceId);
            if (roomsFetched) setRooms(roomsFetched);
        };
        fetchPress();
    }, [data.row.original.conferenceId]);

    return (
        <Select
            disabled={!rooms?.length}
            onValueChange={(val) => {
                console.log(val);
            }}
        >
            <SelectTrigger id="room">
                <SelectValue placeholder="Select room" />
            </SelectTrigger>
            <SelectContent position="popper">
                {rooms &&
                    rooms.map((room, i) => (
                        <SelectItem key={i} value={room.id}>
                            {room.name}
                        </SelectItem>
                    ))}
            </SelectContent>
        </Select>
    );
};

export const presentationsColumns: ColumnDef<CellProps>[] = [
    {
        accessorKey: "name",
        header: "Presentation",
    },
    {
        accessorKey: "conference.name",
        header: "Konference",
    },
    {
        accessorKey: "description",
        header: "Popis",
    },
    {
        accessorKey: "content",
        header: "Obsah",
    },
    {
        accessorKey: "room",
        header: "Místnost",
        cell: AddRoomCell,
    },
    {
        accessorKey: "start",
        header: "Začátek",
        cell: AddStartTimeCell,
    },
    {
        accessorKey: "end",
        header: "Konec",
        cell: AddEndTimeCell,
    },
    {
        accessorKey: "paymentStatus",
        header: "Stav platby",
        cell: ChangeStatusCell,
    },
];
