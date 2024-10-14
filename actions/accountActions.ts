"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "./actions";
import { z } from "zod";
import { formSchema } from "@/components/account/form";

const accountSchema = z.object({
	email: z.string().email(),
	name: z.string().min(1),
	address: z.string().min(1),
	city: z.string().min(1),
	country: z.string().min(1),
	zip: z.string().regex(/^\d{3}\s?\d{2}$/),
});

export async function changeAccountInfo(formData: z.infer<typeof formSchema>) {
	try {
		const parsedData = accountSchema.safeParse({
			email: "tomas.hlasensky@seznam.cz",
			name: formData.name,
			address: formData.address,
			city: formData.city,
			country: formData.country,
			zip: formData.zip,
		});

		if (!parsedData.success) {
			console.error(parsedData.error);
			return 404;
		}

		const user = await getSessionUser();

		if (user === 404) {
			return 404;
		}

		const data = await prisma.users.update({
			where: {
				email: user.email,
			},
			data: {
                name: formData.name,
                address: formData.address,
                city: formData.city,
                country: formData.country,
                zip: formData.zip,
			},
		});

		if (data) {
			return 200;
		}
		return 404;
	} catch (error) {
		console.error(error);
		return 404;
	}
}

export async function createAccount(formData: z.infer<typeof formSchema>) {
	try {
		const parsedData = accountSchema.safeParse({
			email: "",
			name: formData.name,
			address: formData.address,
			city: formData.city,
			country: formData.country,
			zip: formData.zip,
		});

		if (!parsedData.success) {
			console.error(parsedData.error);
			return 404;
		}

		const data = await prisma.users.create({
			data: {
				email: "",
				name: formData.name,
				address: formData.address,
				city: formData.city,
				country: formData.country,
				zip: formData.zip,
			},
		});

		if (data) {
			return 200;
		}
		return 404;
	} catch (error) {
		console.error(error);
		return 404;
	}
}
