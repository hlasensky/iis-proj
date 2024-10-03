"use client";

import React from 'react'
import { signIn } from "next-auth/react";

function SignInButton() {
  return (
    <button onClick={() => signIn()}>Sign in</button>
)
}

export default SignInButton