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
                orders: {
                    select: {
                        numberOfTickets: true,
                    },
                },
            },
        });

        return (
            <main>
                <CartButton />
                {conferences.length ? (
                    conferences.map((conference, i) => {
                        const taken = conference.orders.reduce(
                            (acc, prev) => acc + prev.numberOfTickets,
                            0,
                        );
                        const capacityObj = {
                            takenNmOfTickets: taken,
                            freeNmOfTickets: conference.capacity - taken,
                            capacity: conference.capacity,
                        };
                        return (
                            <ConferenceCard
                                key={i}
                                conference={conference}
                                capacityObj={capacityObj}
                            />
                        );
                    })
                ) : (
                    <p>No conferences available</p>
                )}
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
