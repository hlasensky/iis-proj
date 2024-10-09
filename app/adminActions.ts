"use server";

import { revalidateTag } from 'next/cache'

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/utils/authOptions";
import { Roles, users } from "@prisma/client";
import { getServerSession } from "next-auth";

export async function getSessionUser(): Promise<users | 404> {
	const session = await getServerSession(authOptions);

	if (!session || !session!.user || !session!.user.email) {
		return 404;
	}

	const user = await prisma.users.findUnique({
		where: {
			email: session!.user!.email,
		},
	});

	if (!user) {
		return 404;
	}

	return user;
}

export async function changeRole(email: string, role: Roles): Promise<200 | 404> {
    const sessionUser = await getSessionUser();
    if (sessionUser === 404) {
        return 404;
    }

	if (sessionUser.role !== "ADMIN" && sessionUser.role !== "USER") {
		return 404;
	}

	const data = await prisma.users.update({
		where: {
			email: email,
		},
		data: {
			role,
		},
	});

	revalidateTag("users");

	if (data) {
		return 200;
	} else {
		return 404;
	}
}
