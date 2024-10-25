// app/api/conferences/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const conferences = await prisma.conference.findMany();
        return NextResponse.json(conferences);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch conferences" },
            { status: 500 },
        );
    } finally {
        await prisma.$disconnect();
    }
}
