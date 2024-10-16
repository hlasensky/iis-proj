"use client";

import { Order } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export const orderColumns: ColumnDef<Order>[] = [
	{
		accessorKey: "conferenceId",
		header: "ID Conference",
	},
	{
		accessorKey: "numberOfTickets",
		header: "Množství lístků",
	},
	{
		accessorKey: "code",
		header: "Kód pro přístup",
	},
];
