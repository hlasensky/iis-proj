"use server";

import { prisma } from "@/lib/prisma";
import { getCapacity } from "./conferenceActions";
import { randomUUID } from "crypto";
import { z } from "zod";

const orderSchema = z.object({
	conferenceId: z.string().uuid(),
	numberOfTickets: z.number().int().positive(),
});

export async function processOrder(
	orders: {
		conferenceId: string;
		numberOfTickets: number;
	}[]
) {
	async function createOrder(
		conferenceId: string,
		numberOfTickets: number
	): Promise<{ id: string; status: number }> {
		const capacity = await getCapacity(conferenceId);

		if (!capacity) {
			console.error("Capacity not found");
			return { id: conferenceId, status: 500 };
		}

		if (capacity.freeNmOfTickets < numberOfTickets) {
			console.error("Not enough tickets left");
			return { id: conferenceId, status: 500 };
		}

		const validation = orderSchema.safeParse({ conferenceId, numberOfTickets });

		if (!validation.success) {
			console.error("Validation failed", validation.error.errors);
			return { id: conferenceId, status: 500 };
		}

		const newOrder = await prisma.order.create({
			data: {
				code: randomUUID(),
				paymentStatus: false,
				numberOfTickets,
				conferenceId,
			},
		});

		if (!newOrder) {
			console.error("Order not created");
			return { id: conferenceId, status: 500 };
		}

		return { id: conferenceId, status: 200 };
	}

	const results = await Promise.all(
		orders.map(async (order) => {
			const result = await createOrder(order.conferenceId, order.numberOfTickets);
			return result;
		})
	);

	return results;
}
