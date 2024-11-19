import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    getCreatorConferences,
    getUserConferences,
} from "@/actions/conferenceActions";
import ConferenceUserCard from "@/components/root/ConferenceUserCard";
import ConferenceCreatorCard from "@/components/root/ConferenceCreatorCard";
import CreateConfButton from "@/components/conference/CreateConfButton";
import { ConfKeyForm } from "@/components/conference/ConfKeyForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { redirect } from "next/navigation";

async function Conferences() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/");
    }

    const userOrders = await getUserConferences();
    const creatorConf = await getCreatorConferences();

    return (
        <>
            <div className="w-full flex items-center justify-center text-3xl my-5">
                Conferences
            </div>

            <Tabs defaultValue="zakoupene" className="mx-12 my-5">
                <TabsList className="w-full">
                    <TabsTrigger value="zakoupene" className="w-full">
                        Zakoupene
                    </TabsTrigger>
                    <TabsTrigger value="vytvorene" className="w-full">
                        Vytvorene
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="zakoupene" className="w-full">
                    <ConfKeyForm />

                    {userOrders.map((order, i) => (
                        <ConferenceUserCard
                            key={i}
                            conference={order.conference}
                            code={order.code}
                        />
                    ))}
                </TabsContent>
                <TabsContent value="vytvorene" className="w-full">
                    {creatorConf.map((conference, i) => (
                        <ConferenceCreatorCard
                            key={i}
                            conference={conference}
                        />
                    ))}

                    <CreateConfButton classNameTrig="fixed bottom-10 right-10" />
                </TabsContent>
            </Tabs>
        </>
    );
}

export default Conferences;
