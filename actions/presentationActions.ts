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

export async function addToMyProgram(pres: Presentation) {
    const user = await getSessionUser();
    if (!user) {
        return null;
    }

    const program = await prisma.program.findUnique({
        where: {
            userId: user.id,
        },
    });

    if (program) {
        await prisma.program.update({
            where: {
                userId: user.id,
            },
            data: {
                presentations: {
                    connect: {
                        id: pres.id,
                    },
                },
            },
        });
    } else {
        await prisma.program.create({
            data: {
                userId: user.id,
                presentations: {
                    connect: {
                        id: pres.id,
                    },
                },
            },
        });
    }
}
