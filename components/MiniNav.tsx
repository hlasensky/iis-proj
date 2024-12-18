"use client";

import {
    HomeIcon,
    LogIn,
    MonitorPlay,
    Presentation,
    Settings,
    UserRoundPlus,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Session } from "next-auth";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { signIn } from "next-auth/react";

interface NavbarLinkProps {
    icon: React.ElementType;
    label: string;
    active?: boolean;
    onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
    return (
        <TooltipProvider delayDuration={100}>
            <Tooltip>
                <TooltipTrigger
                    onClick={onClick}
                    className={cn(
                        active
                            ? "border-2 border-blue-400 text-blue-400"
                            : "border-2 border-slate-300 ",
                        label === "Sign up" || label === "Account"
                            ? "mt-auto"
                            : "",

                        "rounded-full grid place-content-center w-12 h-12 cursor-pointer ",
                    )}
                >
                    <Icon />
                </TooltipTrigger>
                <TooltipContent side={"right"}>{label}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

const AccBtn = ({ session }: { session: Session | null }) => {
    return (
        <Avatar className="m-auto">
            <AvatarImage
                src={session?.user?.image || ""}
                alt={session?.user?.name || "avatar"}
            />
            <AvatarFallback>
                {session?.user?.name?.charAt(0) || "A"}
            </AvatarFallback>
        </Avatar>
    );
};

const LogInBtn = () => {
    return <LogIn onClick={() => signIn()} />;
};

const RegBtn = ({ session }: { session: Session | null }) => {
    return session ? null : <UserRoundPlus />;
};

export function NavbarMinimal({
    session,
    user,
}: {
    session: Session | null;
    user: { id: string | null; role: string | null; admin: boolean };
}) {
    const router = useRouter();
    const [active, setActive] = useState(0);
    const path = usePathname();

    const mockdata = [
        { icon: HomeIcon, label: "Home", url: "/" },
        { icon: MonitorPlay, label: "Conferences", url: "/conferences" },
        {
            icon: Presentation,
            label: "Presentations",
            url: "/presentations",
        },
        ...(user.admin
            ? [{ icon: Settings, label: "Admin", url: "/admin" }]
            : []),
        ...(session
            ? [{ icon: AccBtn, label: "Account", url: "/account" }]
            : [
                  {
                      icon: () => RegBtn({ session: session }),
                      label: "Sign up",
                      url: "/auth/register",
                  },
                  { icon: LogInBtn, label: "Sign in", url: "" },
              ]),
    ];

    useEffect(() => {
        const index = mockdata.findIndex((link) => link.url === path);
        if (index !== -1) setActive(index);
        else setActive(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path, setActive]);

    const links = mockdata.map((link, index) => (
        <NavbarLink
            icon={link.icon}
            label={link.label}
            key={link.label}
            active={index === active}
            onClick={() => router.push(link.url)}
        />
    ));

    return (
        <nav className=" h-screen w-full bg-slate-100 flex flex-col gap-3 justify-start p-1 sticky top-0">
            {links}
        </nav>
    );
}
