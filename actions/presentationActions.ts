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
