"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { Button } from "@mantine/core";

function SignOutButton() {
	return <Button variant="filled" onClick={() => signOut()}>Sign out</Button>;
}

export default SignOutButton;
