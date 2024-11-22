"use server";

import { prisma } from "@/lib/prisma";
import { Room } from "@prisma/client";

export async function createRooms(
    confID: string,
    rooms: Omit<Room, "id" | "conferenceId">[],
) {
    const conference = await prisma.conference.findUnique({
        where: {
            id: confID,
        },
    });

    if (!conference) {
        return null;
    }

    rooms = rooms.map((room) => ({
        capacity: Number(room.capacity),
        name: room.name,
        conferenceId: confID,
    }));

    const createdRooms = await prisma.room.createMany({
        data: rooms.map((room) => ({
            ...room,
            conferenceId: conference.id,
        })),
    });

    if (createdRooms) {
        return 200;
    }

    return null;
}

export async function updateRooms(confID: string, rooms: Room[]) {
    const conference = await prisma.conference.findUnique({
        where: {
            id: confID,
        },
    });

    if (!conference) {
        return null;
    }

    const updatedRooms = await Promise.all(
        rooms.map(async (room) => {
            const updatedRoom = await prisma.room.update({
                where: {
                    id: room.id,
                },
                data: {
                    ...room,
                },
            });

            return updatedRoom;
        }),
    );

    if (updatedRooms) {
        return 200;
    }

    return null;
}

export async function deleteRoom(roomID: string) {
    const deletedRoom = await prisma.room.delete({
        where: {
            id: roomID,
        },
    });

    if (deletedRoom) {
        return 200;
    }

    return null;
}