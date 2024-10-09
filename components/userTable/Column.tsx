"use client";

import { users } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { changeRole } from "@/app/adminActions";

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
		header: "Role",
		cell: (data) => {
			const originalRole = data.cell.getValue();
			console.log(originalRole);

			return (
				<DropdownMenu>
					<DropdownMenuTrigger>
						<span className="cursor-pointer">{originalRole as string}</span>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem
							onClick={async () => {
								await changeRole(data.row.getValue("email"), "ADMIN");
							}}
							className="cursor-pointer"
						>
							ADMIN
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={async () => {
								await changeRole(data.row.getValue("email"), "USER");
							}}
							className="cursor-pointer"
						>
							USER
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
