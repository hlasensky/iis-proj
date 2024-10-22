"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "./actions";
import { z } from "zod";
import { formSchema } from "@/components/account/form";
import { hashPassword } from "./actions";
import { formConfSchema } from "@/components/conference/ConfForm";

const accountSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  zip: z.string().regex(/^\d{3}\s?\d{2}$/),
});

const createAccountSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  zip: z.string().regex(/^\d{3}\s?\d{2}$/),
});

export async function changeAccountInfo(formData: z.infer<typeof formSchema>) {
  try {
    const parsedData = accountSchema.safeParse({
      email: "tomas.hlasensky@seznam.cz",
      name: formData.name,
      address: formData.address,
      city: formData.city,
      country: formData.country,
      zip: formData.zip,
    });

    if (!parsedData.success) {
      console.error(parsedData.error);
      return 404;
    }

    const user = await getSessionUser();

    if (user === 404) {
      return 404;
    }

    const data = await prisma.users.update({
      where: {
        email: user.email,
      },
      data: {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        zip: formData.zip,
      },
    });

    if (data) {
      return 200;
    }
    return 404;
  } catch (error) {
    console.error(error);
    return 404;
  }
}

export async function createAccount(
  formData: z.infer<typeof createAccountSchema>
) {
  try {
    const parsedData = createAccountSchema.safeParse({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      address: formData.address,
      city: formData.city,
      country: formData.country,
      zip: formData.zip,
    });

    if (!parsedData.success) {
      console.error(parsedData.error);
      return 404;
    }
    const hashedPassword = await hashPassword(formData.password);
    const data = await prisma.users.create({
      data: {
        email: formData.email,
        password: hashedPassword,
        name: formData.name,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        zip: formData.zip,
      },
    });

    if (data) {
      return 200;
    }
    return 404;
  } catch (error) {
    console.error(error);
    return 404;
  }
}

export async function createConference(values: z.infer<typeof formConfSchema>) {
  const user = await getSessionUser();
  console.log("hello");

  console.log(values.day, values.start);
  // const tmpStart = ;
  // cosnt tmpEnd = ;
  if (user === 404) {
    return null;
  }
  const conference = await prisma.conference.create({
    data: {
      name: values.name,
      description: values.desc,
      capacity: Number(values.capacity),
      startTime: values.start,
      endTime: values.end,
      creatorId: user.id,
    },
  });

  if (conference) return 200;
  return 404;
}
