"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { LogIn } from "lucide-react";
import { Button } from "./ui/button";

function SignInButton() {
	return (
		<Button  variant="outline" onClick={() => signIn()}>
			<LogIn />
		</Button>
	);
}

export default SignInButton;
