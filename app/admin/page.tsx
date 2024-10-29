export const revalidate = 1;

import React from "react";
import { columns } from "@/components/userTable/Column";
import { DataTable } from "@/components/ui/data-table";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/actions";
import { presentationsColumns } from "@/components/userTable/PresentationsColumns";
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

    const presentations = await prisma.presentation.findMany({
        include: {
            conference: true,
            creator: true,
        },
    });

    return (
        <section className="container mx-auto py-10">
            <DataTable columns={orderColumns} data={orders} />
            <DataTable columns={presentationsColumns} data={presentations} />
            <DataTable columns={columns} data={users} />
        </section>
    );
}

export default Page;
