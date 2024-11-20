"use client";

import { users } from "@prisma/client";
import { CellContext, ColumnDef } from "@tanstack/react-table";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { changeRole, deleteUser } from "@/actions/adminActions";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

type CellProps = CellContext<users, unknown>;

const DelUserCell = (data: CellProps) => {
	const router = useRouter();
	return (
		<Button
			variant="destructive"
			onClick={async () => {
				toast.promise(
					new Promise(async (resolve, reject) => {
						try {
							const response = await deleteUser(data.row.getValue("email"));
							if (response === 200) {
								resolve("User deleted");
								router.refresh();
							} else if (!response) {
								reject("Failed to delete user: User not found");
							} else {
								reject("Failed to delete user");
							}
						} catch (e) {
							reject("Failed to delete user " + e);
						}
					}),
					{
						loading: "Deleting user...",
						success: "User deleted",
						error: (err) => err,
					}
				);
			}}
		>
			<Trash2 />
		</Button>
	);
};

const ChangeRoleCell = (data: CellProps) => {
	let originalRole = data.cell.getValue() as string;
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="border rounded p-2 hover:bg-slate-300">
				{originalRole as string}
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem
					onClick={async () => {
						toast.promise(
							new Promise(async (resolve, reject) => {
								try {
									const response = await changeRole(
										data.row.getValue("email"),
										"ADMIN"
									);
									if (response === 200) {
										resolve("Role changed to ADMIN");
									} else if (!response) {
										reject("Failed to change role: User not found");
									} else {
										reject("Failed to change role");
									}
								} catch (e) {
									reject("Failed to change role " + e);
								}
							}),
							{
								loading: "Changing role...",
								success: "Role changed to ADMIN",
								error: (err) => err,
							}
						);
						originalRole = "ADMIN";
					}}
					className="cursor-pointer"
				>
					ADMIN
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={async () => {
						toast.promise(
							new Promise(async (resolve, reject) => {
								try {
									const response = await changeRole(
										data.row.getValue("email"),
										"USER"
									);
									if (response === 200) {
										resolve("Role changed to USER");
									} else if (!response) {
										reject("Failed to change role: User not found");
									} else {
										reject("Failed to change role");
									}
								} catch (e) {
									reject("Failed to change role " + e);
								}
							}),
							{
								loading: "Changing role...",
								success: "Role changed to USER",
								error: (err) => err,
							}
						);
						originalRole = "USER";
					}}
					className="cursor-pointer"
				>
					USER
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export const columns: ColumnDef<users>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "role",
		cell: ChangeRoleCell,
	},
	{
		accessorKey: "Delete",
		cell: DelUserCell,
	},
];
