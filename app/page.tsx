import CartButton from "@/components/root/CartButton";
import ConferenceCard from "@/components/root/ConferenceCard";
import { prisma } from "@/lib/prisma";

export default async function Home() {
	try {
		const conferences = await prisma.conference.findMany({
			where: {
				endTime: {
					gte: new Date(),
				},
			},
			orderBy: {
				startTime: "asc",
			},
			include: {
				orders: true,
			},
		});

		return (
			<main>
				<CartButton />
				{conferences.map((conference, i) => (
					<ConferenceCard key={i} conference={conference} />
				))}
			</main>
		);
	} catch (error) {
		console.error("Failed to fetch conferences:", error);
		return (
			<main>
				<CartButton />
				<p>Failed to load conferences. Please try again later.</p>
			</main>
		);
	}
}
