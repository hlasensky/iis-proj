"use server";

import React from "react";
import { NavbarMinimal } from "./MiniNav";
import { getServerSession } from "next-auth";

async function Nav() {
	const session = await getServerSession();

	return (
		<>
			<NavbarMinimal session={session} />
		</>
	);
}

export default Nav;
