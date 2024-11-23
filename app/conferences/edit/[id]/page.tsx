import { getConferences } from "@/actions/conferenceActions";
import { ConfForm } from "@/components/conference/ConfForm";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { presentationsColumns } from "@/components/userTable/PresentationsColumns";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/utils/authOptions";
import { Conference } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
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
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/");
    }

    const { id } = params;
    const conferenceData = await getConferences(id);
    const conference = conferenceData as Conference;
    const presentations = await prisma.presentation.findMany({
        where: {
            conferenceId: conference.id,
        },
        include: {
            conference: true,
            creator: true,
            room: true,
        },
    });

    return (
        <>
            <Tabs defaultValue="editConf" className="mx-12 my-5">
                <TabsList className="w-full">
                    <TabsTrigger value="editConf" className="w-full">
                        Upravit konferenci
                    </TabsTrigger>
                    <TabsTrigger value="editPres" className="w-full">
                        Prezentace konference
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="editConf" className="w-full">
                    <ConfForm
                        
                        editID={conference.id}
                        defaultValues={{
                            name: conference.name,
                            desc: conference.description,
                            day: conference.startTime
                                .toISOString()
                                .slice(0, 10),
                            start: conference.startTime
                                .toISOString()
                                .slice(11, 16),
                            end: conference.endTime.toISOString().slice(11, 16),
                            capacity: conference.capacity.toString(),
                            price: conference.price
                                ? conference.price.toString()
                                : "1",
                        }}
                    />
                </TabsContent>
                <TabsContent value="editPres" className="w-full">
                    <DataTable
                        columns={presentationsColumns}
                        data={presentations}
                    />
                </TabsContent>
            </Tabs>
        </>
    );
}
