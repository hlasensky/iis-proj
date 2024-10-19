"use client";

import { Conference, Order, users } from "@prisma/client";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { Switch } from "../ui/switch";
import { toast } from "sonner";
import { changePayStatus } from "@/actions/adminActions";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";

type CellProps = Order & { conference: Conference } & { users: users[] };

const ChangeStatusCell = (data: CellContext<CellProps, unknown>) => {
	return (
		<Switch
			checked={data.row.original.paymentStatus}
			onCheckedChange={(val) =>
				toast.promise(
					new Promise(async (resolve, reject) => {
						try {
							const response = await changePayStatus(data.row.original.id, val);
							if (response === 200) {
								resolve("Order status changed");
							} else if (response === 404) {
								reject("Failed to change order status: Order not found");
							} else {
								reject("Failed to change order status");
							}
						} catch (e) {
							reject("Failed to change order " + e);
						}
					}),
					{
						loading: "Changing order status...",
						success: "Order status changed",
						error: (err) => err,
					}
				)
			}
		/>
	);
};

const ShowUsersCell = (data: CellContext<CellProps, unknown>) => {
	return (
		<Collapsible className="relative">
			<CollapsibleTrigger>Návštěvníci</CollapsibleTrigger>
			{data.row.original.users.map((user) => (
				<CollapsibleContent key={user.id} >
					<p>{user.email}</p>
				</CollapsibleContent>
			))}
		</Collapsible>
	);
};

export const orderColumns: ColumnDef<CellProps>[] = [
	{
		accessorKey: "conference.name",
		header: "Konference",
	},
	{
		accessorKey: "numberOfTickets",
		header: "Množství lístků",
	},
	{
		accessorKey: "users",
		header: "Návštěvníci",
		cell: ShowUsersCell,
	},
	{
		accessorKey: "code",
		header: "Kód pro přístup",
	},
	{
		accessorKey: "paymentStatus",
		header: "Stav platby",
		cell: ChangeStatusCell,
	},
];
