"use server";

import { prisma } from "@/lib/prisma";

import { getSessionUser } from "./actions";
import { formPresSchema } from "@/components/presentation/PresForm";
import { z } from "zod";

export async function createPresentation(
    values: z.infer<typeof formPresSchema>,
) {
    const user = await getSessionUser();
    if (!user) {
        return null;
    }
    console.log(values);
    const conference = await prisma.presentation.create({
        data: {
            name: values.name,
            evaluated: false,
            creatorId: user?.id,
            content: values.content,
            conferenceId: values.conference,
        },
    });

    if (conference) return 200;
    return null;
}

export async function getPresentations(conferenceId: string) {
    try {
        const presentations = await prisma.presentation.findMany({
            where: {
                conferenceId: {
                    equals: conferenceId,
                },
            },
            include: {
                creator: {
                    select: {
                        name: true,
                    },
                },
                room: true,
            },
        });
        return presentations;
    } catch (error) {
        console.error("Failed to fetch presentations:", error);
        return [];
    }
}

export async function getUserPresentations() {
    const user = await getSessionUser();
    if (!user) {
        return null;
    }

    const orders = await prisma.order.findMany({
        where: {
            users: {
                some: {
                    id: user.id,
                },
            },
        },
    });

    const conferences = [];
    for (const order of orders) {
        const conference = await prisma.conference.findUnique({
            where: {
                id: order.conferenceId,
            },
        });

        if (!conference) {
            continue;
        }

        const presentations = await prisma.presentation.findMany({
            where: {
                conferenceId: conference.id,
            },
        });

        for (const presentation of presentations) {
            conferences.push(presentation);
        }
    }

    return conferences;
}
