"use client";

import { CellContext, ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { changeEvaluatedStatus } from "@/actions/adminActions";
import { Conference, Presentation, users } from "@prisma/client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

type CellProps = Presentation & { conference: Conference } & { creator: users };

const ChangeStatusCell = (data: CellContext<CellProps, unknown>) => {
    return (
        <Select
            onValueChange={(val) =>
                toast.promise(
                    new Promise(async (resolve, reject) => {
                        try {
                            console.log(data.row.original.id, val);
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
        accessorKey: "start",
        header: "Začátek",
    },
    {
        accessorKey: "end",
        header: "Konec",
    },
    {
        accessorKey: "paymentStatus",
        header: "Stav platby",
        cell: ChangeStatusCell,
    },
];
