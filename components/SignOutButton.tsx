"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "./ui/button";

function SignOutButton() {
	return (
		<Button variant="destructive" onClick={() => signOut()}>
			<LogOut />
		</Button>
	);
}

export default SignOutButton;
