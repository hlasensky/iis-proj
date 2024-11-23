import { Conference } from "@prisma/client";
import React from "react";
import ConferencesButtons from "@/components/root/ConferencesButtons";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

async function ConferenceCard({
    conference,
    capacityObj,
}: {
    conference: Conference & { orders: { numberOfTickets: number }[] };
    capacityObj: {
        takenNmOfTickets: number;
        freeNmOfTickets: number;
        capacity: number;
    };
}) {
    const dateStart = conference.startTime;
    const dateEnd = conference.endTime;

    if (!capacityObj) {
        return <Skeleton className="h-52 w-3/4 mx-auto my-6 rounded-xl" />;
    }

    return (
        <Card className="w-3/4 mx-auto my-6">
            <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-xl font-semibold">{conference.name}</h2>
                <ConferencesButtons id={conference.id} name={conference.name} />
            </CardHeader>
            <CardContent>
                <div>
                    <p>{conference.description}</p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between text-slate-400">
                <p>{`${dateStart.toLocaleString()} - ${dateEnd.toLocaleString()}`}</p>

                <p>
                    Capacity:{" "}
                    {`${capacityObj.takenNmOfTickets}/${capacityObj?.capacity}`}
                </p>
            </CardFooter>
        </Card>
    );
}

export default ConferenceCard;
