"use server"
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/utils/authOptions";
import {  users } from "@prisma/client";
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

	console.log("user", session);

	if (!user) {
		return 404;
	}

	return user;
}