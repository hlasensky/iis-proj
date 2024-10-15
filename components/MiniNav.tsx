"use client";

import { useState } from "react";
import {
	AlignEndVerticalIcon,
	Calendar,
	Fingerprint,
	HomeIcon,
	LayoutDashboard,
	Settings,
	User,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import SignInButton from "./SignInButton";
import SignOutButton from "./SignOutButton";
import { Session } from "next-auth";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { cn } from "@/lib/utils";

interface NavbarLinkProps {
	icon: typeof HomeIcon;
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
						active ? "border-2 border-blue-400 text-blue-400" : "",
						"rounded-full grid place-content-center w-12 h-12 cursor-pointer m-auto"
					)}
				>
					<Icon />
				</TooltipTrigger>
				<TooltipContent side={"right"}>{label}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

const mockdata = [
	{ icon: HomeIcon, label: "Home" },
	{ icon: LayoutDashboard, label: "Dashboard" },
	{ icon: AlignEndVerticalIcon, label: "Analytics" },
	{ icon: Calendar, label: "Releases" },
	{ icon: User, label: "Account" },
	{ icon: Fingerprint, label: "Security" },
	{ icon: Settings, label: "Settings" },
];

export function NavbarMinimal({ session }: { session: Session | null }) {
	const [active, setActive] = useState(2);

	const links = mockdata.map((link, index) => (
		<NavbarLink
			{...link}
			key={link.label}
			active={index === active}
			onClick={() => setActive(index)}
		/>
	));

	return (
		<nav className=" h-screen w-fit bg-slate-100">
			<div className="grid gap-3">
				{links}
				{session ? (
					<>
						<Avatar className="m-auto">
							<AvatarImage
								src={session?.user?.image || ""}
								alt={session?.user?.name || "avatar"}
							/>
							<AvatarFallback>{session?.user?.name?.charAt(0) || "A"}</AvatarFallback>
						</Avatar>

						<SignOutButton />
					</>
				) : (
					<>
						<span></span>
						<SignInButton />
					</>
				)}
			</div>
		</nav>
	);
}
