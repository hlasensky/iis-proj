"use server";

import { prisma } from "@/lib/prisma";
import { Session } from "inspector/promises";
import { getSessionUser } from "./actions";

export async function getCapacity(conferenceId: string) {
  const conference = await prisma.conference.findUnique({
    where: {
      id: conferenceId,
    },
  });
  const orders = await prisma.order.findMany({
    where: {
      conferenceId: {
        equals: conferenceId,
      },
    },
  });

  if (!conference) {
    return null;
  }

  const taken = orders.reduce((acc, prev) => acc + prev.numberOfTickets, 0);
  const capacityObj = {
    takenNmOfTickets: taken,
    freeNmOfTickets: conference.capacity - taken,
    capacity: conference.capacity,
  };

  return capacityObj;
}

export async function getCreatorConferences() {
  const user = await getSessionUser();
  if (user === 404) {
    return [];
  }
  const conferences = await prisma.conference.findMany({
    where: {
      creatorId: {
        equals: user?.id,
      },
    },
  });
  if (!conferences) {
    return [];
  }
  return conferences;
}

export async function getUserConferences() {
  const user = await getSessionUser();
  console.log(user);
  if (user === 404) {
    return [];
  }
  const userOrders = await prisma.order.findMany({
    where: {
      users: {
        some: {
          id: user?.id,
        },
      },
    },
    include: {
      conference: true,
    },
  });
  const conferences = userOrders.map((order) => order.conference);

  return conferences;
}
