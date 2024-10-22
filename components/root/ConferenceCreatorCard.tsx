import { Conference } from "@prisma/client";
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

function ConferenceCreatorCard({ conference }: { conference: Conference }) {
  return (
    <Card className="w-3/4 mx-auto my-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-semibold">{conference.name}</h2>
      </CardHeader>
      <CardContent>
        <div>
          <p>{conference.description}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-slate-400">
        <p>{`${conference.startTime.toLocaleString()} - ${conference.endTime.toLocaleString()}`}</p>
      </CardFooter>
    </Card>
  );
}

export default ConferenceCreatorCard;
