import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreatePresButton from "@/components/presentation/CreatePresButton";
import { GetMyProgram, getPresentations } from "@/actions/presentationActions";
import CalendarView from "@/components/presentation/CalendarView";
import { getCreatorPresentations } from "@/actions/presentationActions";
import PressCard from "@/components/presentation/PressCard";
import { getUserConferences } from "@/actions/conferenceActions";
import { Presentation } from "@prisma/client";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function Presantations() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/");
    }

    const creatorPres = await getCreatorPresentations();
    const conferences = await getUserConferences();

    const presentationsMap: Record<string, Presentation[]> = {};
    const userProgramMap: Record<string, Presentation[]> = {};

    // Fetch presentations for each conference and store them in the map
    await Promise.all(
        conferences.map(async (conference) => {
            const presentations = await getPresentations(
                conference.conferenceId,
            );
            presentationsMap[conference.conference.id] = presentations;
            const userProgram = await GetMyProgram(conference.conference.id);
            if (userProgram) {
                const key = conference.conference.startTime.toLocaleDateString();
                if (!userProgramMap[key]) {
                    userProgramMap[
                        key
                    ] = userProgram.presentations;
                } else {
                    userProgramMap[
                        key
                    ] = [
                        ...userProgramMap[
                            key
                        ],
                        ...userProgram.presentations,
                    ];
                }
            }
        }),
    );

    return (
        <>
            <div className="w-full flex items-center justify-center text-3xl my-5">
                Prezentace
            </div>

            <Tabs defaultValue="zakoupene" className="mx-12 my-5">
                <TabsList className="w-full">
                    <TabsTrigger value="zakoupene" className="w-full">
                        Program
                    </TabsTrigger>
                    <TabsTrigger value="vytvorene" className="w-full">
                        Vytvorene
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="zakoupene" className="w-full">
                    <Tabs>
                        <TabsList defaultValue="" className="w-full">
                            <TabsTrigger value="myProgram" className="w-full">
                                My program
                            </TabsTrigger>
                            {conferences.map((conference, i) => (
                                <TabsTrigger
                                    value={conference.conference.id}
                                    className="w-full"
                                    key={i}
                                >
                                    {conference.conference.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <TabsContent value="myProgram" className="w-full">
                            {myProgram ? (
                                <CalendarView
                                    conferenceStart={
                                        new Date("2024-12-15T17:00:00Z")
                                    }
                                    conferenceEnd={
                                        new Date("2024-12-15T17:00:00Z")
                                    }
                                    presentations={myProgram.presentations}
                                    isProgram={true}
                                />
                            ) : (
                                <p>no presentations</p>
                            )}
                        </TabsContent>
                        {conferences.map((conference, i) => {
                            const conferencePresentations =
                                presentationsMap[conference.conference.id] ||
                                [];
                            return (
                                <TabsContent
                                    value={conference.conference.id}
                                    className="w-full"
                                    key={i}
                                >
                                    <CalendarView
                                        key={i}
                                        conferenceStart={
                                            conference.conference.startTime
                                        }
                                        conferenceEnd={
                                            conference.conference.endTime
                                        }
                                        presentations={conferencePresentations}
                                        isProgram={true}
                                    />
                                </TabsContent>
                            );
                        })}
                    </Tabs>
                </TabsContent>
                <TabsContent value="vytvorene" className="w-full">
                    {creatorPres.map((presentation, i) => (
                        <PressCard key={i} presentation={presentation} />
                    ))}
                    <CreatePresButton classNameTrig="fixed bottom-10 right-10" />
                </TabsContent>
            </Tabs>
        </>
    );
}
export default Presantations;
