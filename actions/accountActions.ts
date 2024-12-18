"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "./actions";
import { z } from "zod";
import { formSchema } from "@/components/account/form";
import { hashPassword } from "./actions";

const accountSchema = z.object({
	email: z.string().email(),
	name: z.string().min(1),
	address: z.string().min(1),
	city: z.string().min(1),
	country: z.string().min(1),
	zip: z.string().regex(/^\d{3}\s?\d{2}$/),
});

const createAccountSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	name: z.string().min(1),
	address: z.string().min(1),
	city: z.string().min(1),
	country: z.string().min(1),
	zip: z.string().regex(/^\d{3}\s?\d{2}$/),
});

export async function changeAccountInfo(formData: z.infer<typeof formSchema>) {
	try {
		const parsedData = accountSchema.safeParse({
			email: "test@test.cz",
			name: formData.name,
			address: formData.address,
			city: formData.city,
			country: formData.country,
			zip: formData.zip,
		});

		if (!parsedData.success) {
			console.error(parsedData.error);
			return null;
		}

		const user = await getSessionUser();

		if (!user) {
			return null;
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
		return null;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function createAccount(formData: z.infer<typeof createAccountSchema>) {
	try {
		const parsedData = createAccountSchema.safeParse({
			email: formData.email,
			password: formData.password,
			name: formData.name,
			address: formData.address,
			city: formData.city,
			country: formData.country,
			zip: formData.zip,
		});

		if (!parsedData.success) {
			console.error(parsedData.error);
			return null;
		}
		const hashedPassword = await hashPassword(formData.password);
		const data = await prisma.users.create({
			data: {
				email: formData.email,
				password: hashedPassword,
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
		return null;
	} catch (error) {
		console.error(error);
		return null;
	}
}
