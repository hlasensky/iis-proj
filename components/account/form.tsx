"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { users } from "@prisma/client";
import { changeAccountInfo } from "@/actions/accountActions";
import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

export const formSchema = z.object({
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	address: z.string().min(2, {
		message: "Address must be at least 2 characters.",
	}),
	city: z.string().min(2, {
		message: "City must be at least 2 characters.",
	}),
	country: z.string().min(2, {
		message: "Country must be at least 2 characters.",
	}),
	zip: z.string().regex(/^\d{3}\s?\d{2}$/, {
		message: "Zip code must be a valid Czech postal code (e.g., 123 45 or 12345).",
	}),
});

export function ProfileForm({ defaultVals }: { defaultVals: users }): JSX.Element {
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: defaultVals.name || "",
			address: defaultVals.address || "",
			city: defaultVals.city || "",
			country: defaultVals.country || "",
			zip: defaultVals.zip || "",
		},
	});

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		setLoading(true);
		try {
			const status = await changeAccountInfo(values);
			console.log(values);
			if (status === 200) {
				console.log("Success!");
				setSuccess(true);
			} else {
				console.log("Error!");
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
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Jméno</FormLabel>
							<FormControl>
								<Input placeholder="Karel Novák" {...field} />
							</FormControl>
							<FormDescription>Zadejte vaše jméno</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="address"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Adresa</FormLabel>
							<FormControl>
								<Input placeholder="Ulice 123" {...field} />
							</FormControl>
							<FormDescription>Zadejte vaši adresu</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="city"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Město</FormLabel>
							<FormControl>
								<Input placeholder="Praha" {...field} />
							</FormControl>
							<FormDescription>Zadejte vaše město</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="country"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Země</FormLabel>
							<FormControl>
								<Input placeholder="Česká republika" {...field} />
							</FormControl>
							<FormDescription>Zadejte vaši zemi</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="zip"
					render={({ field }) => (
						<FormItem>
							<FormLabel>PSČ</FormLabel>
							<FormControl>
								<Input placeholder="123 45" {...field} />
							</FormControl>
							<FormDescription>Zadejte vaše PSČ</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className={success ? "border-green-400" : ""}>
					{loading ? <Loader2 className="animate-spin" /> : success ? <Check /> : "Submit"}
				</Button>
			</form>
		</Form>
	);
}
