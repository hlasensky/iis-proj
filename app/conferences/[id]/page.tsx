import { getConferences } from "@/actions/conferenceActions";
import { getPresentations } from "@/actions/presentationActions";
import CalendarView from "@/components/presentation/CalendarView";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card";
import { Conference } from "@prisma/client";
import React from "react";

export async function generateStaticParams() {
    const conferences = await getConferences();

    if (!conferences) {
        return [];
    }

    return (conferences as Conference[]).map((conf) => ({
        id: conf.id,
    }));
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;
    const conferenceData = await getConferences(id);
    const conference = conferenceData as Conference;

    let presentations = await getPresentations(id);
    presentations = presentations.filter(
        (presentation) => presentation.evaluated,
    );

    return (
        <div className="flex gap-4 justify-between ">
            <Card className="m-4 ">
                <CardHeader>
                    <h1>{conference.name}</h1>
                    <CardDescription>{conference.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <label htmlFor="startTime">Start time:</label>
                    <input
                        name="startTime"
                        type="datetime-local"
                        className="w-fit text-center"
                        value={conference.startTime.toISOString().slice(0, 16)}
                        disabled
                    />
                    <label htmlFor="endTime">End time:</label>
                    <input
                        name="endTime"
                        type="datetime-local"
                        className="w-fit text-center"
                        value={conference.endTime.toISOString().slice(0, 16)}
                        disabled
                    />
                </CardContent>
            </Card>
            <CalendarView
                presentations={presentations}
                conferenceStart={conference.startTime}
                conferenceEnd={conference.endTime}
                isProgram={false}
            />
        </div>
    );
}

export const revalidate = 60; // 60 seconds
