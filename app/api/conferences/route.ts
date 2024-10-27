// app/api/conferences/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// const prisma = new PrismaClient();

export async function GET() {
    try {
        const conferences = await prisma.conference.findMany();
        return NextResponse.json(conferences);
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch conferences" },
            { status: 500 },
        );
    }
}
