"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@mantine/core";

function SignInButton() {
	return <Button variant="filled" onClick={() => signIn()}>Sign in</Button>;
}

export default SignInButton;
