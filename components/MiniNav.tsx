"use client";

import { AlignEndVerticalIcon, HomeIcon, LayoutDashboard, LogIn, Settings } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Session } from "next-auth";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { cn } from "@/lib/utils";
import { activeNavAtom } from "@/app/userAtom";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { ForwardRefExoticComponent, SVGProps } from "react";
import { signIn } from "next-auth/react";

interface NavbarLinkProps {
	icon: ForwardRefExoticComponent<SVGProps<SVGSVGElement>> | (() => JSX.Element);
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
						label === "Účet" ? "mt-auto" : "",

						"rounded-full grid place-content-center w-12 h-12 cursor-pointer "
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
	return session ? (
		<Avatar className="m-auto">
			<AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "avatar"} />
			<AvatarFallback>{session?.user?.name?.charAt(0) || "A"}</AvatarFallback>
		</Avatar>
	) : (
		<LogIn onClick={() => signIn()} />
	);
};

export function NavbarMinimal({ session }: { session: Session | null }) {
	const router = useRouter();
	const [active, setActive] = useAtom(activeNavAtom);
	const path = usePathname();

	const mockdata = [
		{ icon: HomeIcon, label: "Home", url: "/" },
		{ icon: LayoutDashboard, label: "Konference", url: "/conferences" },
		{ icon: AlignEndVerticalIcon, label: "Prezentace", url: "/presentations" },
		{ icon: Settings, label: "Admin", url: "/admin" },
		{ icon: () => AccBtn({ session: session }), label: "Účet", url: "/account" },
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

	return <nav className=" h-screen w-full bg-slate-100 flex flex-col gap-3 justify-start p-1">{links}</nav>;
}
