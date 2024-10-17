import { prisma } from "@/lib/prisma";
import { array } from "zod";

export default async function Home() {
  const conferences = await prisma.conference.findMany({});
  return (
    <main>
      {conferences.map((conference, i) => (
        <div key={i}>
          <p>{conference.name}</p>
        </div>
      ))}
    </main>
  );
}
