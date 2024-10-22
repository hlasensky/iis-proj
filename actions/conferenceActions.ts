"use server";

import { prisma } from "@/lib/prisma";
import { Session } from "inspector/promises";
import { getSessionUser } from "./actions";
import { formKeySchema } from "@/components/conference/ConfKeyForm";
import { z } from "zod";
import { formConfSchema } from "@/components/conference/ConfForm";

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
  //   const conferences = userOrders.map((order) => order.conference);

  return userOrders;
}

export async function createConference(values: z.infer<typeof formConfSchema>) {
  const user = await getSessionUser();
  const tmpStart = `${values.day}T${values.start}:00.000Z`;
  const tmpEnd = `${values.day}T${values.end}:00.000Z`;
  if (user === 404) {
    return null;
  }
  const conference = await prisma.conference.create({
    data: {
      name: values.name,
      description: values.desc,
      capacity: Number(values.capacity),
      startTime: tmpStart,
      endTime: tmpEnd,
      creatorId: user.id,
    },
  });

  if (conference) return 200;
  return 404;
}

export async function addVisitorByKey(values: z.infer<typeof formKeySchema>) {
  const user = await getSessionUser();

  if (user === 404) {
    return null;
  }
  const order = await prisma.order.update({
    where: {
      code: values.key,
    },
    data: {
      users: {
        connect: { id: user.id },
      },
    },
  });

  if (order) return 200;
  return 404;
}
