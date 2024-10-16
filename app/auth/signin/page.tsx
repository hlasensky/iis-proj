import { SignInForm } from "@/components/auth/SignInForm";
import { getCsrfToken } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function SignIn() {
	const csrfToken = await getCsrfToken();

	if (!csrfToken) {
		redirect("/");
	}

	return <SignInForm csrfToken={csrfToken} />;
}
