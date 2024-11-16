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
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
    addRoomToPresentation,
    deletePresentation,
} from "@/actions/presentationActions";
import TimePicker from "react-time-picker";
import { getRooms } from "@/actions/conferenceActions";

type CellProps = Presentation & { conference: Conference } & {
    creator: users;
} & { room: Room | null };

const DelUserCell = (data: CellContext<CellProps, unknown>) => {
    return (
        <Button
            variant="destructive"
            onClick={async () => {
                toast.promise(
                    new Promise(async (resolve, reject) => {
                        try {
                            const response = await deletePresentation(
                                data.row.getValue("id"),
                            );
                            if (response === 200) {
                                resolve("Presentation deleted");
                                
                            } else if (!response) {
                                reject(
                                    "Failed to delete presentation: Presentation not found",
                                );
                            } else {
                                reject("Failed to delete presentation");
                            }
                        } catch (e) {
                            reject("Failed to delete presentation " + e);
                        }
                    }),
                    {
                        loading: "Deleting presentation...",
                        success: "Presentation deleted",
                        error: (err) => err,
                    },
                );
            }}
        >
            <Trash2 />
        </Button>
    );
};

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
                <SelectValue
                    placeholder={
                        data.row.original.evaluated ? "Allowed" : "Disallowed"
                    }
                />
            </SelectTrigger>
            <SelectContent
                position="popper"
                defaultValue={
                    data.row.original.evaluated ? "allow" : "disallow"
                }
            >
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

    useEffect(() => {
        const startDate = data.row.original.start
            ? new Date(data.row.original.start)
            : new Date();
        setStartTime(
            `${String(startDate.getHours()).padStart(2, "0")}:${String(
                startDate.getMinutes(),
            ).padStart(2, "0")}`,
        );
    }, [data.row.original.start]);

    const handleStartTimeChange = (value: unknown) => {
        const roundedTime = roundToNearestFiveMinutes(value as string);
        const startDate = timeStringToDate(roundedTime);

        // Validate if the end time is after the start time
        if (startDate < data.row.original.conference.startTime) {
            toast.error("End time must be after the start time.");
            return;
        }

        setStartTime(roundedTime);

        // Assign the converted Date object to the row data
        data.row.original.start = startDate;
    };

    return (
        <TimePicker
            className={"w-full"}
            onChange={handleStartTimeChange}
            disableClock
            clearIcon={null}
            value={startTime}
            maxDetail="minute"
            minTime={`${String(
                data.row.original.conference.startTime.getHours(),
            ).padStart(2, "0")}:${String(
                data.row.original.conference.startTime.getMinutes(),
            ).padStart(2, "0")}:00`}
            maxTime={`${String(
                data.row.original.conference.endTime.getHours(),
            ).padStart(2, "0")}:${String(
                data.row.original.conference.endTime.getMinutes(),
            ).padStart(2, "0")}`}
        />
    );
};

const AddEndTimeCell = (data: CellContext<CellProps, unknown>) => {
    const [endTime, setEndTime] = useState(""); // default at least 5 minutes after 00:00

    useEffect(() => {
        const endDate = data.row.original.start
            ? new Date(
                  new Date(data.row.original.start).getTime() +
                      1 * 60 * 60 * 1000,
              )
            : new Date();
        setEndTime(
            `${String(endDate.getHours()).padStart(2, "0")}:${String(
                endDate.getMinutes(),
            ).padStart(2, "0")}`,
        );
    }, [data.row.original.start]);

    const handleEndTimeChange = (value: unknown) => {
        const roundedTime = roundToNearestFiveMinutes(value as string);

        const startDate = data.row.original.start;
        const endDate = timeStringToDate(roundedTime);

        // Validate if the end time is after the start time
        if (
            !startDate ||
            endDate <= startDate ||
            startDate < data.row.original.conference.startTime ||
            endDate > data.row.original.conference.endTime
        ) {
            toast.error("End time must be after the start time.");
            return;
        }

        setEndTime(roundedTime);

        // Assign the converted Date object to the row data
        data.row.original.end = endDate;
    };

    return (
        <TimePicker
            className={"w-full"}
            onChange={handleEndTimeChange}
            disableClock
            clearIcon={null}
            value={endTime}
            maxDetail="minute"
            minTime={`${String(
                data.row.original.conference.startTime.getHours(),
            ).padStart(2, "0")}:${String(
                data.row.original.conference.startTime.getMinutes(),
            ).padStart(2, "0")}:00`}
            maxTime={`${String(
                data.row.original.conference.endTime.getHours(),
            ).padStart(2, "0")}:${String(
                data.row.original.conference.endTime.getMinutes(),
            ).padStart(2, "0")}`}
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
            onValueChange={async (val) => {
                const res = await addRoomToPresentation(
                    data.row.original.id,
                    val as string,
                );

                if (res === 200) {
                    toast.success("Room added to presentation");
                } else {
                    toast.error("Failed to add room to presentation");
                }
            }}
        >
            <SelectTrigger id="room">
                <SelectValue
                    placeholder={
                        data.row.original.room
                            ? data.row.original.room.name
                            : "Select room"
                    }
                />
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
    {
        accessorKey: "id",
        header: "Delete",
        cell: DelUserCell,
    },
];
