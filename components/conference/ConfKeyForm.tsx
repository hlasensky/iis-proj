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
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState, type JSX } from "react";
import { Check, Loader2 } from "lucide-react";
import { addVisitorByKey } from "@/actions/conferenceActions";
import { useRouter } from "next/navigation";

export const formKeySchema = z.object({
    key: z.string().uuid({
        message: "Toto neni klic ke konferenci",
    }),
});

export function ConfKeyForm(): JSX.Element {
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formKeySchema>>({
        resolver: zodResolver(formKeySchema),
        defaultValues: {
            key: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formKeySchema>) {
        setLoading(true);
        console.log(values);
        try {
            const status = await addVisitorByKey(values);
            if (status === 200) {
                console.log("Form Success!");
                setSuccess(true);
                form.reset();
                router.refresh();
            } else {
                console.log("Form Error!");
                form.setError("key", {
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
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [success]);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-row w-full"
            >
                <FormMessage />
                <FormField
                    control={form.control}
                    name="key"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormControl>
                                <Input
                                    className="w-full"
                                    placeholder="Enter key to unlock conference"
                                    {...field}
                                />
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
                        "Use key"
                    )}
                </Button>
            </form>
        </Form>
    );
}
