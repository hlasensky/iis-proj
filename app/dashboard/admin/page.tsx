export const revalidate = 1;

import React from "react";
import { columns } from "@/components/userTable/Column";
import { UserTable } from "@/components/userTable/User-table";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/app/adminActions";
import { redirect } from "next/navigation";

async function Page() {
	const sessionUser = await getSessionUser();

	if (sessionUser === 404 || sessionUser.role !== "ADMIN") {
		redirect("/");
	}

	const users = await prisma.users.findMany();
	

	return (
		<section className="container mx-auto py-10">
			<UserTable columns={columns} data={users} />
		</section>
	);
}

export default Page;
