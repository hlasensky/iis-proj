"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardDescription, CardContent } from "../ui/card";
import CalendarView from "./CalendarView";
import { Presentation, Room, Conference, Order } from "@prisma/client";
import { getPresentations } from "@/actions/presentationActions";

function ToggleConf({
    userOrders,
}: {
    userOrders: (Order & { conference: Conference })[];
}) {
    type presType = Presentation & {
        room?: Room | null;
        creator?: {
            name?: string | null;
        };
    };
    const [presentations, setPresentations] = useState<presType[]>([]);

    const [selectedConference, setSelectedConference] =
        useState<Conference | null>(null);

    // Handle selection change
    const handleSelect = (conference: Conference) => {
        setSelectedConference(conference);
    };

    useEffect(() => {
        const fetchPresentations = async () => {
            if (selectedConference) {
                try {
                    const fetchedPresentations = await getPresentations(
                        selectedConference.id,
                    );
                    setPresentations(fetchedPresentations);
                } catch (error) {
                    console.error("Error fetching presentations:", error);
                }
            }
        };

        fetchPresentations();
    }, [selectedConference]);

    console.log(userOrders);
    return (
        <>
            <ToggleGroup type="single">
                {userOrders.map((order, i) => (
                    <ToggleGroupItem
                        key={order.id}
                        name={order.id}
                        value={order.conference.id}
                        onClick={() => handleSelect(order.conference)}
                    >
                        {order.conference.name}
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>

            {selectedConference && (
                <div className="flex gap-4 justify-between ">
                    <Card className="m-4 ">
                        <CardHeader>
                            <h1>{selectedConference.name}</h1>
                            <CardDescription>
                                {selectedConference.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <label htmlFor="startTime">Start time:</label>
                            <input
                                name="startTime"
                                type="datetime-local"
                                className="w-fit text-center"
                                value={selectedConference.startTime
                                    .toISOString()
                                    .slice(0, 16)}
                                disabled
                            />
                            <label htmlFor="endTime">End time:</label>
                            <input
                                name="endTime"
                                type="datetime-local"
                                className="w-fit text-center"
                                value={selectedConference.endTime
                                    .toISOString()
                                    .slice(0, 16)}
                                disabled
                            />
                        </CardContent>
                    </Card>
                    <CalendarView
                        presentations={presentations}
                        conferenceStart={selectedConference.startTime}
                        conferenceEnd={selectedConference.endTime}
                        isProgram={false}
                    />
                </div>
            )}
        </>
    );
}

export default ToggleConf;
