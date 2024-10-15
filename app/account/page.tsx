import { getSessionUser } from "@/actions/actions";
import { ProfileForm } from "@/components/account/form";
import SignOutButton from "@/components/SignOutButton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { users } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

async function Page() {
	const user = await getSessionUser();

	console.log("user", user);

	if (user === 404) return redirect("/");

	return (
		<div className="mx-auto w-4/5 grid gap-4 p-8">
			<Card  className="w-fit px-10 py-4 flex gap-3 justify-center items-center">
				<CardHeader className="p-0" >
					<h2 className="text-xl md:text-3xl">Odhlásit se</h2>
				</CardHeader>
				<CardContent className="p-0">
					<SignOutButton />
				</CardContent>
			</Card>
			<Card >
				<CardHeader>
					<h2 className="text-2xl font-semibold">Edit Profile</h2>
				</CardHeader>
				<CardContent>
					<ProfileForm defaultVals={user as users} />
				</CardContent>
			</Card>
		</div>
	);
}

export default Page;
