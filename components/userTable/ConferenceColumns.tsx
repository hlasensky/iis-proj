"use client";

import { Conference } from "@prisma/client";
import { CellContext, ColumnDef } from "@tanstack/react-table";

import { toast } from "sonner";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { deleteConference } from "@/actions/conferenceActions";
import { useRouter } from "next/navigation";

type CellProps = CellContext<Conference, unknown>;

const DelConfCell = (data: CellProps) => {
    const router = useRouter();
    return (
        <Button
            variant="destructive"
            onClick={async () => {
                toast.promise(
                    new Promise(async (resolve, reject) => {
                        try {
                            const response = await deleteConference(
                                data.row.getValue("id"),
                            );
                            if (response === 200) {
                                resolve("conference deleted");
                                router.refresh();
                            } else if (!response) {
                                reject(
                                    "Failed to delete conference: User not found",
                                );
                            } else {
                                reject("Failed to delete conference");
                            }
                        } catch (e) {
                            reject("Failed to delete conference " + e);
                        }
                    }),
                    {
                        loading: "Deleting conference...",
                        success: "conference deleted",
                        error: (err) => err,
                    },
                );
            }}
        >
            <Trash2 />
        </Button>
    );
};

export const conferenceColumns: ColumnDef<Conference>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "desc",
        header: "Description",
    },
    {
        accessorKey: "day",
        header: "Day",
    },
    {
        accessorKey: "start",
        header: "Start",
    },
    {
        accessorKey: "end",
        header: "End",
    },
    {
        accessorKey: "capacity",
        header: "Capacity",
    },
    {
        accessorKey: "Delete",
        cell: DelConfCell,
    },
];
