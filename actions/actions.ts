"use server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/utils/authOptions";
import { users } from "@prisma/client";
import { getServerSession } from "next-auth";
import bcrypt from "bcrypt";

export async function getSessionUser(): Promise<users | 404> {
  const session = await getServerSession(authOptions);

  if (!session || !session!.user || !session!.user.email) {
    console.error("user in session not found");
    return 404;
  }

  const user = await prisma.users.findUnique({
    where: {
      email: session!.user!.email,
    },
  });

  if (!user) {
    console.error("user in db not found");

    return 404;
  }

  return user;
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function isSamePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
