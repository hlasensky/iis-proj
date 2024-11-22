"use client";

import { Room } from "@prisma/client";
import { CellContext, ColumnDef } from "@tanstack/react-table";

import { toast } from "sonner";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteRoom } from "@/actions/roomActions";

type CellProps = CellContext<Room, unknown>;

const DelRoomCell = (data: CellProps) => {
	const router = useRouter();
	return (
		<Button
			variant="destructive"
			onClick={async () => {
				toast.promise(
					new Promise(async (resolve, reject) => {
						try {
							const response = await deleteRoom(data.row.getValue("id"));
							if (response === 200) {
								resolve("room deleted");
								router.refresh();
							} else if (!response) {
								reject("Failed to delete room: room not found");
							} else {
								reject("Failed to delete room");
							}
						} catch (e) {
							reject("Failed to delete room " + e);
						}
					}),
					{
						loading: "Deleting room...",
						success: "room deleted",
						error: (err) => err,
					}
				);
			}}
		>
			<Trash2 />
		</Button>
	);
};

export const roomColumns: ColumnDef<Room>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "capacity",
		header: "Capacity",
	},
	{
		accessorKey: "Delete",
		cell: DelRoomCell,
	},
];
