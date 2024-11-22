"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState, type JSX } from "react";
import { Check, Loader2 } from "lucide-react";
import {
    createConference,
    updateConference,
} from "@/actions/conferenceActions";
import RoomForm from "./RoomForm";

export const formConfSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    desc: z.string().min(2, {
        message: "Address must be at least 2 characters.",
    }),
    day: z.string(),
    start: z.string(),
    end: z.string(),
    capacity: z.string(),
    price: z.string(),
});

export function ConfForm({
    defaultValues,
    editID,
}: {
    defaultValues?: z.infer<typeof formConfSchema>;
    editID?: string;
}): JSX.Element {
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(true);
    const [confID, setConfID] = useState("");

    const form = useForm<z.infer<typeof formConfSchema>>({
        resolver: zodResolver(formConfSchema),
        defaultValues: {
            name: defaultValues?.name || "",
            desc: defaultValues?.desc || "",
            day: defaultValues?.day || "",
            start: defaultValues?.start || "",
            end: defaultValues?.end || "",
            capacity: defaultValues?.capacity || "",
            price: defaultValues?.price || "",
        },
    });
    async function onSubmit(values: z.infer<typeof formConfSchema>) {
        setLoading(true);
        try {
            let status;
            let res = null;
            if (editID) {
                status = await updateConference(editID, values);
            } else {
                res = await createConference(values);
            }

            if (status === 200 || res?.status === 200) {
                console.log("Form Success!");
                setSuccess(true);
                if (res || editID) {
                    setConfID(res ? res.confID : editID!);
                    setStep(false);
                } else {
                    setStep(true);
                }
            } else {
                console.log("Form Error!");
                form.setError("name", {
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

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(false);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [success]);

    return step ? (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="desc"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Capacity</FormLabel>
                            <FormControl>
                                <Input type="number" min={1} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="day"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Day</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="start"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Start</FormLabel>
                            <FormControl>
                                <Input
                                    type="time"
                                    min={"00:00"}
                                    max={"23:59"}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="end"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>End</FormLabel>
                            <FormControl>
                                <Input
                                    type="time"
                                    min={"00:00"}
                                    max={"23:59"}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                                <Input type="number" min={0} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className={success ? "border-green-400" : ""}
                >
                    {loading ? (
                        <Loader2 className="animate-spin" />
                    ) : success ? (
                        <Check />
                    ) : (
                        "Continue"
                    )}
                </Button>
            </form>
        </Form>
    ) : (
        <RoomForm
            confID={confID}
            loading={loading}
            setLoading={setLoading}
            setStep={setStep}
            editID={editID}
            setSuccess={setSuccess}
            success={success}
        />
    );
}
