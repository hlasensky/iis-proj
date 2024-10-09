import { prisma } from "@/lib/prisma";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import React from "react";

async function page() {
	const session = await getServerSession(authOptions);

    if (!session || !session!.user || !session!.user.email) {
		return {
			redirect: {
				destination: "/auth/signin",
				permanent: false,
			},
		};
    }
    
    const user = await prisma.users.findUnique({
        where: {
            email: session!.user!.email,
        },
    });

    if (!user || user.role !== "ADMIN") {
        return {
            redirect: {
                destination: "/auth/signin",
                permanent: false,
            },
        };
    }

    return <span>Admin Page</span>;
}

export default page;
