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
    addEndTimeToPresentation,
    addRoomToPresentation,
    addStartTimeToPresentation,
    deletePresentation,
} from "@/actions/presentationActions";
import { getRooms } from "@/actions/conferenceActions";
import { Popover, PopoverContent } from "../ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

type CellProps = Presentation & { conference: Conference } & {
    creator: users;
} & { room: Room | null };

const DelUserCell = (data: CellContext<CellProps, unknown>) => {
    const router = useRouter();
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
                                router.refresh();
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

const roundToNearestFiveMinutes = (time: Date): Date => {
    if (!time) {
        return new Date();
    }
    const hours = (time as Date).getHours();
    const minutes = (time as Date).getMinutes();
    const roundedMinutes = Math.round(minutes / 5) * 5;
    const formattedMinutes =
        roundedMinutes === 60 ? "00" : String(roundedMinutes).padStart(2, "0");
    const formatedHours = (roundedMinutes === 60 ? hours + 1 : hours)
        .toString()
        .padStart(2, "0");

    const date = new Date();
    date.setHours(Number(formatedHours), Number(formattedMinutes), 0, 0);
    return date;
};

const stringToDate = (time: string): Date => {
    const [hours, minutes] = time.split(":").map((item) => parseInt(item));
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
};

const AddStartTimeCell = (data: CellContext<CellProps, unknown>) => {
    const [startT, setStartT] = useState(
        data.row.original.start
            ?.toLocaleTimeString()
            .split(":")
            .slice(0, 2)
            .map((item) => item.padStart(2, "0"))
            .join(":") || "",
    );

    useEffect(() => {
        setStartT(
            data.row.original.start
                ?.toLocaleTimeString()
                .split(":")
                .slice(0, 2)
                .map((item) => item.padStart(2, "0"))
                .join(":") || "",
        );
    }, [data.row.original.start]);

    const handleStartTimeChange = () => {
        const roundedTime = roundToNearestFiveMinutes(stringToDate(startT));

        // Validate if the end time is after the start time
        // if (startDate < data.row.original.conference.startTime) {
        //     toast.error("End time must be after the start time.");
        //     return;
        // }

        const updateDate = async () => {
            const res = await addStartTimeToPresentation(
                data.row.original.id,
                roundedTime.toISOString(),
            );
            if (res === 200) {
                toast.success("Start time updated");
                data.row.original.start = roundedTime;
            } else {
                toast.error("Failed to update start time");
            }
        };
        updateDate();

        // Assign the converted Date object to the row data
    };

    // const localConferenceStartTime = new Date(
    //     data.row.original.conference.startTime.toLocaleDateString(),
    // );
    // const localConferenceEndTime = new Date(
    //     data.row.original.conference.endTime.toLocaleDateString(),
    // );

    return (
        <Popover>
            <PopoverTrigger>
                {startT
                    ? startT
                    : "Select start time"}
            </PopoverTrigger>
            <PopoverContent>
                <Input
                    type="time"
                    value={startT}
                    onChange={(e) => setStartT(e.currentTarget.value)}
                />

                <Button onClick={handleStartTimeChange}>Submit</Button>
            </PopoverContent>
        </Popover>
    );
};

const AddEndTimeCell = (data: CellContext<CellProps, unknown>) => {
    const [endT, setEndT] = useState(
        data.row.original.end
            ?.toLocaleTimeString()
            .split(":")
            .slice(0, 2)
            .map((item) => item.padStart(2, "0"))
            .join(":") || "",
    );

    useEffect(() => {
        setEndT(
            data.row.original.end
                ?.toLocaleTimeString()
                .split(":")
                .slice(0, 2)
                .map((item) => item.padStart(2, "0"))
                .join(":") || "",
        );
    }, [data.row.original.end]);

    const handleEndTimeChange = () => {
        const roundedTime = roundToNearestFiveMinutes(stringToDate(endT));

        // Validate if the end time is after the start time
        // if (
        //     !startDate ||
        //     endDate <= startDate ||
        //     startDate < data.row.original.conference.startTime ||
        //     endDate > data.row.original.conference.endTime
        // ) {
        //     toast.error("End time must be after the start time.");
        //     return;
        // }

        const updateDate = async () => {
            const res = await addEndTimeToPresentation(
                data.row.original.id,
                roundedTime.toISOString(),
            );
            if (res === 200) {
                toast.success("End time updated");
                data.row.original.end = roundedTime;
            } else {
                toast.error("Failed to update end time");
            }
        };
        updateDate();

        // Assign the converted Date object to the row data
    };

    // const localConferenceStartTime = new Date(
    //     data.row.original.conference.startTime.toLocaleDateString(),
    // );
    // const localConferenceEndTime = new Date(
    //     data.row.original.conference.endTime.toLocaleDateString(),
    // );

    return (
        <Popover>
            <PopoverTrigger>{endT ? endT : "Select end time"}</PopoverTrigger>
            <PopoverContent>
                <Input
                    type="time"
                    value={endT}
                    onChange={(e) => setEndT(e.currentTarget.value)}
                />
                <Button onClick={handleEndTimeChange}>Submit</Button>
            </PopoverContent>
        </Popover>
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
