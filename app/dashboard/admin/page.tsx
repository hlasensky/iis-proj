export const revalidate = 1;

import React from "react";
import { columns } from "@/components/userTable/Column";
import { DataTable } from "@/components/ui/data-table";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/actions/adminActions";
import { redirect } from "next/navigation";

async function Page() {
	const sessionUser = await getSessionUser();

	if (sessionUser === 404 || sessionUser.role !== "ADMIN") {
		redirect("/");
	}

	const users = await prisma.users.findMany();

	return (
		<section className="container mx-auto py-10">
			<DataTable columns={columns} data={users} />
		</section>
	);
}

export default Page;
