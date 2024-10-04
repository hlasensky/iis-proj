"use client";

import { useState } from "react";
import { Tooltip, UnstyledButton, Stack } from "@mantine/core";
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

interface NavbarLinkProps {
	icon: typeof HomeIcon;
	label: string;
	active?: boolean;
	onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
	return (
		<Tooltip className="py-1 px-2" label={label} position="right" transitionProps={{ duration: 0 }}>
			<UnstyledButton
				className={"flex justify-center items-center"}
				onClick={onClick}
				data-active={active || undefined}
			>
				<Icon />
			</UnstyledButton>
		</Tooltip>
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
		<nav className="fixed top-0 left-0 h-screen w-fit bg-slate-100">
			<div>
				<Stack justify="center" gap={0}>
					{links}
				</Stack>
			</div>

			<Stack justify="center" gap={0}>
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
			</Stack>
		</nav>
	);
}
