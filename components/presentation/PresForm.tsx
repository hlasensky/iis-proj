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
    FormDescription,
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

export const formPresSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    conference: z.string({
        required_error: "Please select a conference.",
    }),
});

export function PresForm() {
    const form = useForm<z.infer<typeof formPresSchema>>({
        resolver: zodResolver(formPresSchema),
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

    const onSubmit = (data: z.infer<typeof formPresSchema>) => {
        toast.success("Vytvoreno");
        console.log("Selected Conference ID:", data);
    };

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
                            <FormLabel>Název Konference</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
                                                            key={conference.id}
                                                            onSelect={() => {
                                                                form.setValue(
                                                                    "conference",
                                                                    conference.id, // Set conference ID instead of value
                                                                );
                                                            }}
                                                        >
                                                            {conference.name}
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
                            <FormDescription>
                                This is the conference that will be used in the
                                dashboard.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
