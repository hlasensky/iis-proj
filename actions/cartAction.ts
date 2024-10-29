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
        userId: string;
        conferenceId: string;
        numberOfTickets: number;
    }[],
) {
    async function createOrder(
        userId: string,
        conferenceId: string,
        numberOfTickets: number,
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

        const validation = orderSchema.safeParse({
            conferenceId,
            numberOfTickets,
        });

        if (!validation.success) {
            console.error("Validation failed", validation.error.errors);
            return { id: conferenceId, status: 500 };
        }

        const newOrder = await prisma.order.create({
            data: {
                code: randomUUID(),
                paymentStatus: false,
                users: {
                    connect: {
                        id: userId,
                    },
                },
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
            const result = await createOrder(
                order.userId,
                order.conferenceId,
                order.numberOfTickets,
            );
            return result;
        }),
    );

    return results;
}

// export async function reserveTicket(
//     conferenceId: string,
//     numberOfTickets: number,
// ): Promise<{ id: string; status: number; delete?: boolean }> {
//     const capacity = await getCapacity(conferenceId);

//     if (!capacity) {
//         console.error("Capacity not found");
//         return { id: conferenceId, status: 500 };
//     }

//     if (capacity.freeNmOfTickets < numberOfTickets) {
//         console.error("Not enough tickets left");
//         return { id: conferenceId, status: 500 };
//     }

//     const validation = orderSchema.safeParse({ conferenceId, numberOfTickets });

//     if (!validation.success) {
//         console.error("Validation failed", validation.error.errors);
//         return { id: conferenceId, status: 500 };
//     }

//     const newOrder = await prisma.order.create({
//         data: {
//             code: randomUUID(),
//             paymentStatus: false,
//             users: {},
//             numberOfTickets,
//             conferenceId,
//         },
//     });

//     if (!newOrder) {
//         console.error("Order not created");
//         return { id: conferenceId, status: 500 };
//     }

//     let st = 500;
//     let del = true;
//     setTimeout(async () => {
//         console.log("Server-side task executed after 10 minutes");
//         const order = await prisma.order.findUnique({
//             where: {
//                 id: newOrder.id,
//             },
//             include: {
//                 users: true,
//             },
// 		});
// 		console.log(order);
//         if (!order?.users.length) {
//             const del = await prisma.order.delete({
//                 where: {
//                     id: newOrder.id,
//                 },
// 			});
// 			console.log(del);
//         } else {
//             st = 200;
//             del = false;
//         }
//     }, 60000); // 10 minutes 600000

//     return { id: conferenceId, status: st, delete: del };
// }
