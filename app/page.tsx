import { NavbarMinimal } from "@/components/MiniNav";
import { prisma } from "@/lib/prisma";

import { getServerSession } from "next-auth";

export default async function Home() {
	const session = await getServerSession();
	const users = await prisma.users.findMany();

	console.log(users);

	console.log(session);
	return (
		<main>
			<NavbarMinimal session={session} />
		</main>
	);
}
