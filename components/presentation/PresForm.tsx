"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import {
    createPresentation,
    editPresentation,
} from "@/actions/presentationActions";
import { useAtom } from "jotai";
import {  openPopupAtom } from "@/app/userAtom";
import { Presentation } from "@prisma/client";
import { useRouter } from "next/navigation";

export const formPresSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    desc: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    content: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    conference: z.string({
        required_error: "Please select a conference.",
    }),
});
export const formPresEditSchema = z.object({
    name: z.string().optional(),
    desc: z.string().optional(),
    content: z.string().optional(),
    conference: z.string().optional(),
});
type PresFormProps = {
    edit: boolean;
    pres?: Presentation;
    conf?: string;
    Cname?: string;
    setOpenEdit: (openEdit: boolean) => void;
};

export function PresForm({
    edit,
    pres,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    conf,
    Cname,
    setOpenEdit,
}: PresFormProps) {
    const schema = edit ? formPresEditSchema : formPresSchema;
    const router = useRouter();

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: pres?.name || "",
            desc: pres?.description || "",
            content: pres?.content || "",
        },
    });

    const [conferences, setConferences] = useState<
        { id: string; name: string }[]
    >([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConferences = async () => {
            try {
                const response = await fetch("/api/conferences");
                const data = await response.json();
                setConferences(data);
            } catch (error) {
                console.error("Failed to fetch conferences", error);
            } finally {
                setLoading(false);
            }
        };

        fetchConferences();
    }, []);
    const [, setOpenPopup] = useAtom(openPopupAtom);

    async function onSubmit(
        values: z.infer<typeof formPresSchema | typeof formPresEditSchema>,
    ) {
        setLoading(true);
        try {
            let status;
            if (edit && pres) {
                status = await editPresentation(
                    {
                        conference: values.conference!,
                        content: values.content!,
                        desc: values.desc!,
                        name: values.name!,
                    },
                    pres,
                );
            } else {
                status = await createPresentation(
                    values as z.infer<typeof formPresSchema>,
                );
            }
            if (status === 200) {
                console.log("Form Success!");
                form.reset();
                setOpenPopup(false);
                setOpenEdit(false);
                // window.location.reload();
                router.refresh();
                toast.success("prezentace uspesne vytvorena");
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

    if (loading) {
        return <div>Loading...</div>; // Loading state can be more stylized
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {!edit && (
                    <FormField
                        control={form.control}
                        name="conference"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Conference</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-[200px] justify-between",
                                                    !field.value &&
                                                        "text-muted-foreground",
                                                )}
                                            >
                                                {field.value
                                                    ? conferences.find(
                                                          (conf) =>
                                                              conf.id ===
                                                              field.value,
                                                      )?.name
                                                    : Cname
                                                    ? Cname
                                                    : "Select conference"}
                                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>

                                    <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                            <CommandInput
                                                placeholder="Search conference..."
                                                className="h-9"
                                            />
                                            <CommandList>
                                                <CommandEmpty>
                                                    No conference found.
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {conferences.map(
                                                        (conference) => (
                                                            <CommandItem
                                                                value={
                                                                    conference.name
                                                                }
                                                                key={
                                                                    conference.id
                                                                }
                                                                onSelect={() => {
                                                                    form.setValue(
                                                                        "conference",
                                                                        conference.id, // Set conference ID instead of value
                                                                    );
                                                                }}
                                                            >
                                                                {
                                                                    conference.name
                                                                }
                                                                <CheckIcon
                                                                    className={cn(
                                                                        "ml-auto h-4 w-4",
                                                                        conference.id ===
                                                                            field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0",
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ),
                                                    )}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                <Button type="submit">{edit ? "Edit" : "Create"}</Button>
            </form>
        </Form>
    );
}
