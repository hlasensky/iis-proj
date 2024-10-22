import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getCreatorConferences,
  getUserConferences,
} from "@/actions/conferenceActions";
import ConferenceUserCard from "@/components/root/ConferenceUserCard";
import ConferenceCreatorCard from "@/components/root/ConferenceCreatorCard";
import CreateConfButton from "@/components/conference/CreateConfButton";

async function Conferences() {
  const userConf = await getUserConferences();
  const creatorConf = await getCreatorConferences();
  console.log(userConf, creatorConf);

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
          <div className="flex items-center justify-center">
            <p>koupeny konference</p>

            {userConf.map((conference, i) => (
              <ConferenceUserCard key={i} conference={conference} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="vytvorene" className="w-full">
          <div className="flex items-center justify-center">
            <p>Vytvorene konference</p>

            {creatorConf.map((conference, i) => (
              <ConferenceCreatorCard key={i} conference={conference} />
            ))}
          </div>
          <CreateConfButton />
        </TabsContent>
      </Tabs>
    </>
  );
}

export default Conferences;
