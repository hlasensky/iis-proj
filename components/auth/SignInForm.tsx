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
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import type { JSX } from "react";

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export function SignInForm({ csrfToken }: { csrfToken: string }): JSX.Element {
    const router = useRouter();
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log(data);
        const status = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        });
        if (status?.ok) router.back();
    };

    return (
        <div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-4/5 mx-auto border-2 border-slate-300 rounded-xl m-3 p-9"
                >
                    <div>
                        <input
                            name="csrfToken"
                            type="hidden"
                            defaultValue={csrfToken}
                        />
                        <h1 className="text-3xl font-semibold">Sign In</h1>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="karel.novak@vut.cz"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="mt-4" type="submit">
                            Submit
                        </Button>
                    </div>
                    <div className="h-[2px] bg-slate-300 rounded relative">
                        <span className="absolute ml-5 px-1 -top-[0.875rem] text-slate-500 bg-white rounded">or</span>
                    </div>
                    <Button
                        variant={"secondary"}
                        type="button"
                        className="mx-auto"
                        onClick={() => router.push("/auth/register")}
                    >
                        Register
                    </Button>
                </form>
            </Form>
        </div>
    );
}
