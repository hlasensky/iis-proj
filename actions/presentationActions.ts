"use server";
"use server";

import { prisma } from "@/lib/prisma";

import { getSessionUser } from "./actions";
import { formPresSchema } from "@/components/presentation/PresForm";
import { z } from "zod";
import { getConferences } from "./conferenceActions";
import { Conference } from "@prisma/client";
import { Presentation } from "@prisma/client";

export async function createPresentation(
    values: z.infer<typeof formPresSchema>,
) {
    const user = await getSessionUser();
    if (!user) {
        return null;
    }
    const conference = (await getConferences(values.conference)) as Conference;
    if (!conference) {
        return null;
    }
    const presentation = await prisma.presentation.create({
        data: {
            name: values.name,
            description: values.desc,
            content: values.content,
            conferenceId: values.conference,
            evaluated: null,
            creatorId: user?.id,
            start: conference.startTime,
            end: new Date(
                new Date(conference.startTime).getTime() + 1 * 60 * 60 * 1000,
            ).toISOString(),
        },
    });

    if (presentation) return 200;
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
        return [];
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

export async function getCreatorPresentations() {
    const user = await getSessionUser();
    if (!user) {
        return [];
    }
    const presentations = await prisma.presentation.findMany({
        where: {
            creatorId: user.id,
        },
    });
    return presentations;
}

export async function deletePresentation(presentationId: string) {
    const presentations = await prisma.presentation.delete({
        where: {
            id: presentationId,
        },
    });

    if (presentations) return 200;
    return null;
}

export async function addRoomToPresentation(
    presentationId: string,
    roomId: string,
) {
    const presentation = await prisma.presentation.update({
        where: {
            id: presentationId,
        },
        data: {
            roomId: roomId,
        },
    });

    if (presentation) return 200;
    return null;
}

export async function editPresentation(
    values: z.infer<typeof formPresSchema>,
    pres: Presentation,
) {
    const presentation = await prisma.presentation.update({
        where: {
            id: pres.id,
        },
        data: {
            name: values.name,
            description: values.desc,
            content: values.content,
        },
    });

    if (presentation) return 200;
    return null;
}

export async function addStartTimeToPresentation(
    presentationId: string,
    startTime: string,
) {
    try {
        if (!startTime) {
            return null;
        }

        const presentation = await prisma.presentation.findUnique({
            where: {
                id: presentationId,
            },
            include: {
                conference: true,
            },
        });

        const conference = await prisma.conference.findUnique({
            where: {
                id: presentation?.conferenceId,
            },
        });

        if (
            !conference ||
            (new Date(startTime).getUTCHours() <
                new Date(conference.startTime).getUTCHours() &&
                new Date(startTime).getUTCMinutes() <
                    new Date(conference.startTime).getUTCMinutes())
        ) {
            console.error("Invalid start time");
            return null;
        }

        const up = await prisma.presentation.update({
            where: {
                id: presentationId,
            },
            data: {
                start: startTime,
            },
        });

        if (up) return 200;
        console.error("Failed to add start time to presentation");
        return null;
    } catch (error) {
        console.error("Failed to add start time to presentation:", error);
        return null;
    }
}

export async function addEndTimeToPresentation(
    presentationId: string,
    endTime: string,
) {
    try {
        if (!endTime) {
            return null;
        }

        const presentation = await prisma.presentation.findUnique({
            where: {
                id: presentationId,
            },
            include: {
                conference: true,
            },
        });

        const conference = await prisma.conference.findUnique({
            where: {
                id: presentation?.conferenceId,
            },
        });

        if (
            !conference ||
            (new Date(endTime).getUTCHours() >
                new Date(conference.endTime).getUTCHours() &&
                new Date(endTime).getUTCMinutes() >
                    new Date(conference.endTime).getUTCMinutes())
        ) {
            return null;
        }

        const up = await prisma.presentation.update({
            where: {
                id: presentationId,
            },
            data: {
                end: endTime,
            },
        });

        if (up) return 200;
        return null;
    } catch (error) {
        console.error("Failed to add end time to presentation:", error);
        return null;
    }
}
