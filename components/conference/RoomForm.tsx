"use client";

import { updateRooms, createRooms, deleteRoom } from "@/actions/roomActions";
import { Loader2, Check } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
    FormMessage,
    FormField,
    FormItem,
    FormControl,
    Form,
} from "../ui/form";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { getRooms } from "@/actions/conferenceActions";
import { Room } from "@prisma/client";

export const formRoomSchema = z.array(
    z.object({
        id: z.string(),
        conferenceId: z.string(),
        name: z.string().min(2, {
            message: "Name must be at least 2 characters.",
        }),
        capacity: z.string(),
    }),
);

type Item = {
    id: string;
    name: string;
    capacity: string;
    conferenceId: string;
};

function RoomForm({
    loading,
    setLoading,
    setSuccess,
    setStep,
    success,
    editID,
    confID,
}: {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    setSuccess: (success: boolean) => void;
    setStep: (step: boolean) => void;
    success: boolean;
    editID: string | undefined;
    confID: string;
}) {
    const router = useRouter();
    const [newRooms, setNewRooms] = React.useState<Item[]>([]);
    const [editRooms, setEditRooms] = React.useState<Item[]>([]);

    useEffect(() => {
        console.log("editID", editID);
        if (editID) {
            const fetchRooms = async () => {
                const res = await getRooms(editID);

                if (!res || res.length === 0) {
                    console.error("Error fetching rooms or no rooms found");
                } else {
                    console.log(res);
                    setEditRooms(
                        res.map((room) => ({
                            ...room,
                            capacity: room.capacity.toString(),
                        })),
                    );
                }
            };
            fetchRooms();
        }
    }, [editID]);

    const roomForm = useForm<z.infer<typeof formRoomSchema>>({
        // resolver: zodResolver(formRoomSchema),
        defaultValues: [{ id: "", name: "", capacity: "", conferenceId: "" }],
    });

    const addNewRoom = () => {
        setNewRooms([
            ...newRooms,
            { id: "", name: "", capacity: "", conferenceId: "" },
        ]);
    };

    const removeNewRoom = (index: number) => {
        setNewRooms((rooms) => rooms.filter((_, i) => i !== index));
    };

    const removeOldRoom = async (index: number) => {
        setEditRooms((rooms) => rooms.filter((_, i) => i !== index));

        const status = await deleteRoom(editRooms[index].id);
        if (status === 200) {
            console.log("Room deleted");
        } else {
            console.error("Error deleting room");
        }
    };

    async function onRoomSubmit(values: z.infer<typeof formRoomSchema>) {
        console.log("submitting form");

        console.log("values", values);
        console.log("newRooms", newRooms);
        console.log("editRooms", editRooms);

        const valuesArray = Object.values(values);
        const dataArray = [...editRooms, ...newRooms];

        const newRoomsData: Omit<Room, "id">[] = [];
        const editRoomsData: Room[] = [];

        dataArray.forEach((room, i) => {
            if (i < editRooms.length) {
                editRoomsData.push({
                    ...room,
                    name: valuesArray[i].name || room.name,
                    capacity:
                        Number(valuesArray[i].capacity) ||
                        Number(room.capacity),
                });
            } else {
                newRoomsData.push({
                    conferenceId: confID,
                    name: valuesArray[i].name || room.name,
                    capacity: Number(valuesArray[i].capacity) || 1,
                });
            }
        });

        try {
            let statusOld = null;
            let statusNew = null;
            if (editRooms.length > 0) {
                statusOld = await updateRooms(confID, editRoomsData);
            }

            if (newRooms.length > 0) {
                statusNew = await createRooms(confID, newRoomsData);
            }

            if (statusNew === null && statusOld === null) {
                setStep(true);
                return;
            };

            if (statusOld === 200 || statusNew === 200) {
                console.log("Form Success!");
                setSuccess(true);
                router.refresh();
                roomForm.reset();
                roomForm.clearErrors();
                setStep(true);
            } else {
                if (statusOld !== 200) {
                    console.error("Error updating rooms");
                }
                if (statusNew !== 200) console.error("Error creating rooms");

                roomForm.setError("root", {
                    type: "manual",
                    message: "An error occurred. Please try again later.",
                });
            }
        } catch (error) {
            console.error("Submission error:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...roomForm}>
            <form
                onSubmit={roomForm.handleSubmit(onRoomSubmit)}
                className="flex flex-col w-full"
            >
                <FormMessage />
                {[...editRooms, ...newRooms].map((room, index) => (
                    <div key={index} className="flex flex-row w-full mb-4">
                        <FormField
                            control={roomForm.control}
                            name={`${index}.id`}
                            render={({ field }) => (
                                <FormItem className="w-0">
                                    <FormControl>
                                        <Input
                                            className="w-0"
                                            type="hidden"
                                            {...field}
                                            value={room.id || ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={roomForm.control}
                            name={`${index}.conferenceId`}
                            render={({ field }) => (
                                <FormItem className="w-0">
                                    <FormControl>
                                        <Input
                                            className="w-0"
                                            type="hidden"
                                            {...field}
                                            value={confID}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={roomForm.control}
                            name={`${index}.name`}
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Input
                                            className="w-full"
                                            placeholder="Zadej jmeno mistnosti"
                                            {...field}
                                            value={
                                                field.value
                                                    ? field.value
                                                    : room.name || ""
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={roomForm.control}
                            name={`${index}.capacity`}
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Input
                                            className="w-full"
                                            type="number"
                                            min={1}
                                            placeholder="Zadej kapacitu mistnosti"
                                            {...field}
                                            value={
                                                field.value
                                                    ? field.value
                                                    : room.capacity || "1"
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="button"
                            onClick={() =>
                                room.id
                                    ? removeOldRoom(index)
                                    : removeNewRoom(index)
                            }
                        >
                            Remove
                        </Button>
                    </div>
                ))}
                <Button
                    type="button"
                    variant={"secondary"}
                    onClick={addNewRoom}
                >
                    Add Room
                </Button>
                <Button
                    type="submit"
                    className={success ? "border-green-400" : ""}
                    onClick={() => console.log("submit")}
                >
                    {loading ? (
                        <Loader2 className="animate-spin" />
                    ) : success ? (
                        <Check />
                    ) : (
                        "Done"
                    )}
                </Button>
            </form>
        </Form>
    );
}

export default RoomForm;
