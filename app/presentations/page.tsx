import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreatePresButton from "@/components/presentation/CreatePresButton";

async function Presantations() {
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
                <TabsContent value="zakoupene" className="w-full"></TabsContent>
                <TabsContent value="vytvorene" className="w-full">
                    <CreatePresButton classNameTrig="fixed bottom-10 right-10" />
                </TabsContent>
            </Tabs>
        </>
    );
}
export default Presantations;
