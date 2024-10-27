// "use server";

import { prisma } from "@/lib/prisma";

// import { prisma } from "@/lib/prisma";
// import { getSessionUser } from "./actions";
// // import { formPresSchema } from "@/components/presentation/PresForm";
// import { z } from "zod";

// export async function createPresentation(
//     values: z.infer<typeof formPresSchema>,
// ) {
//     const user = await getSessionUser();
//     if (!user) {
//         return null;
//     }
//     // const conference = await prisma.presentation.create({
//     //     data: {
//     //         name: values.name,
//     //         start: "",
//     //         end: "",
//     //         roomId: "",
//     //         conferenceId:"",
//     //         evaluated: false,
//     //         creatorId: user?.id,
//     //     },
//     // });

//     // if (conference) return 200;
//     // return null;
//     return 200;
// }

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
