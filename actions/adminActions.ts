"use server";

import { prisma } from "@/lib/prisma";
import { Roles } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { getSessionUser } from "./actions";

export async function changeRole(email: string, role: Roles): Promise<200 | null> {
	const sessionUser = await getSessionUser();
	if (!sessionUser) {
		return null;
	}

	if (sessionUser.role !== "ADMIN" && sessionUser.role !== "USER") {
		return null;
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
		return null;
	}
}

export async function deleteUser(email: string): Promise<200 | null> {
	const sessionUser = await getSessionUser();
	if (!sessionUser) {
		return null;
	}

	if (sessionUser.role !== "ADMIN") {
		return null;
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
		return null;
	}
}

export async function changePayStatus(orderId: string, status: boolean): Promise<200 | null> {
	const sessionUser = await getSessionUser();
	if (!sessionUser) {
		return null;
	}

	if (sessionUser.role !== "ADMIN") {
		return null;
	}

	if (status !== true && status !== false) {
		return null;
	}

	console.log(orderId, status);

	const data = await prisma.order.update({
		where: {
			id: orderId,
		},
		data: {
			paymentStatus: status,
		},
	});

	revalidateTag("orders");

	if (data) {
		return 200;
	} else {
		return null;
	}
}


export async function changeEvaluatedStatus(presentationId: string, status: boolean): Promise<200 | null> {
	const sessionUser = await getSessionUser();
	if (!sessionUser) {
		return null;
	}

	if (sessionUser.role !== "ADMIN") {
		return null;
	}

	if (status !== true && status !== false) {
		return null;
	}

	const data = await prisma.presentation.update({
		where: {
			id: presentationId,
		},
		data: {
			evaluated: status,
		},
	});

	revalidateTag("presentations");

	if (data) {
		return 200;
	} else {
		return null;
	}
}