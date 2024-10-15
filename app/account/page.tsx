import { getSessionUser } from "@/actions/actions";
import { ProfileForm } from "@/components/account/form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { users } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

async function Page() {
	const user = await getSessionUser();

	console.log("user", user);

	if (user === 404) return redirect("/");

	return (
		<div className="">
			<Card className="w-4/5 m-auto">
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
