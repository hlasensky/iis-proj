import { RegisterForm } from "@/components/auth/RegisterForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

async function Page() {
	const session = await getServerSession();

	if (session) {
		redirect("/");
	}

	return <RegisterForm />;
}

export default Page;
