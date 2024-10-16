"use server";

import { prisma } from "@/lib/prisma";
import { Roles } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { getSessionUser } from "./actions";
import bcrypt from "bcrypt";

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

export async function deleteUser(email: string): Promise<200 | 404> {
	const sessionUser = await getSessionUser();
	if (sessionUser === 404) {
		return 404;
	}

	if (sessionUser.role !== "ADMIN") {
		return 404;
	}

	const data = await prisma.users.delete({
		where: {
			email: email,
		},
	});

	revalidateTag("users");

	if (data) {
		return 200;
	} else {
		return 404;
	}
}

export async function hashPassword(password: string): Promise<string> {
	return await bcrypt.hash(password, 10);
}

export async function isSamePassword(password: string, hash: string): Promise<boolean> {
	return await bcrypt.compare(password, hash);
}
