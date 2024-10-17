"use server";

import { prisma } from "@/lib/prisma";

export async function getCapacity(conferenceId: string) {
	const conference = await prisma.conference.findUnique({
		where: {
			id: conferenceId,
		},
	});
	const orders = await prisma.order.findMany({
		where: {
			conferenceId: {
				equals: conferenceId,
			},
		},
	});

	if (!conference) {
		return null;
	}

	const taken = orders.reduce((acc, prev) => acc + prev.numberOfTickets, 0);
	const capacityObj = {
		takenNmOfTickets: taken,
		freeNmOfTickets: conference.capacity - taken,
		capacity: conference.capacity,
	};

	return capacityObj;
}
