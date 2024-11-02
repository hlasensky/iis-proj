export const revalidate = 1;

import React from "react";
import { columns } from "@/components/userTable/Column";
import { DataTable } from "@/components/ui/data-table";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/actions";
import { orderColumns } from "@/components/userTable/OrderColumns";

async function Page() {
    const sessionUser = await getSessionUser();

    if (!sessionUser || sessionUser.role !== "ADMIN") {
        redirect("/");
    }

    const users = await prisma.users.findMany();
    const orders = await prisma.order.findMany({
        include: {
            conference: true,
            users: true,
        },
    });

    return (
        <section className="container mx-auto py-10 grid gap-7">
            <DataTable columns={orderColumns} data={orders} />
            <DataTable columns={columns} data={users} />
        </section>
    );
}

export default Page;
