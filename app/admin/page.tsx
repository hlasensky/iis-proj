"use server";

import React from "react";
import { columns } from "@/components/userTable/Column";
import { DataTable } from "@/components/ui/data-table";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/actions";
import { orderColumns } from "@/components/userTable/OrderColumns";
import { presentationsColumns } from "@/components/userTable/PresentationsColumns";
import { conferenceColumns } from "@/components/userTable/ConferenceColumns";

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
            room: true,
        },
    });
    const conferences = await prisma.conference.findMany();

    return (
        <section className="container mx-auto py-10 grid gap-7">
            <h2 className="text-xl">Conferences</h2>
            <DataTable columns={conferenceColumns} data={conferences} />
            <h2 className="text-xl">Orders</h2>
            <DataTable columns={orderColumns} data={orders} />
            <h2 className="text-xl">Users</h2>
            <DataTable columns={columns} data={users} />
            <h2 className="text-xl">Presentations</h2>
            <DataTable columns={presentationsColumns} data={presentations} />
        </section>
    );
}

export default Page;
