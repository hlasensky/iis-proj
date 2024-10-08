"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { Button, Tooltip } from "@mantine/core";
import { LogIn } from "lucide-react";

function SignInButton() {
	return (
		<Tooltip label="Sign in" position="left">
			<Button variant="filled" radius={"xl"} onClick={() => signIn()}>
				<LogIn />
			</Button>
			
		</Tooltip>
	);
}

export default SignInButton;
