"use server";

import React from "react";
import { NavbarMinimal } from "./MiniNav";
import { getServerSession } from "next-auth";
import { getSessionUser } from "@/actions/actions";
import { getUserPresentations } from "@/actions/presentationActions";
import { getUserConferences } from "@/actions/conferenceActions";

async function Nav() {
    const session = await getServerSession();
    const user = await getSessionUser();

    if (!user) {
        return (
            <NavbarMinimal
                session={session}
                user={{ id: null, role: null, admin: false }}
            />
        );
    }

    const presentation = await getUserPresentations();
    const conferences = await getUserConferences();

    const role =
        presentation.length || conferences.length ? "LOGGED_USER" : "USER";

    return (
        <NavbarMinimal
            session={session}
            user={{
                id: user?.id,
                role: role,
                admin: user?.role === "ADMIN",
            }}
        />
    );
}

export default Nav;
