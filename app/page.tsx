import CartButton from "@/components/root/CartButton";
import ConferenceCard from "@/components/root/ConferenceCard";
import { prisma } from "@/lib/prisma";

export default async function Home() {
	const conferences = await prisma.conference.findMany({
		where: {
			endTime: {
				gte: new Date(),
			},
		},
	});

	return (
		<main>
			<CartButton />
			{conferences.map(async (conference, i) => (
				<ConferenceCard key={i} conference={conference} />
			))}
		</main>
	);
}
