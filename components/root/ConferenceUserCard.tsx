import React from "react";
import { Conference } from "@prisma/client";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

function ConferenceUserCard({
    conference,
    code,
}: {
    conference: Conference;
    code: string;
}) {
    return (
        <Card className="w-3/4 mx-auto my-6">
            <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-xl font-semibold">{conference.name}</h2>
            </CardHeader>
            <CardContent>
                <div>
                    <p>{conference.description}</p>
                    <p>klic ke konferenci: {code}</p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between text-slate-400">
                <p>{`${conference.startTime.toLocaleString()} - ${conference.endTime.toLocaleString()}`}</p>
                <Link href="/presentations">
                    <Button>Program </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}

export default ConferenceUserCard;
