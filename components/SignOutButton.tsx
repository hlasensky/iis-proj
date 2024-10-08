"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { Button, Tooltip } from "@mantine/core";
import { LogOut } from "lucide-react";

function SignOutButton() {
	return (
		<Tooltip label="Sign out" position="left">
			<Button variant="filled" radius={"xl"} onClick={() => signOut()}>
				<LogOut />
			</Button>
		</Tooltip>
	);
}

export default SignOutButton;
