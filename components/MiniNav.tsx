"use client";

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { cn } from "@/lib/utils";
import { activeNavAtom } from "@/app/userAtom";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

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
  { icon: HomeIcon, label: "Home", url: "/" },
  { icon: LayoutDashboard, label: "Konference", url: "/conferences" },
  { icon: AlignEndVerticalIcon, label: "Prezentace", url: "/presentations" },
  { icon: User, label: "Účet", url: "/account" },
  { icon: Settings, label: "Admin", url: "/admin" },
];

export function NavbarMinimal({ session }: { session: Session | null }) {
  const router = useRouter();
  const [active, setActive] = useAtom(activeNavAtom);
  const path = usePathname();

  useEffect(() => {
    const index = mockdata.findIndex((link) => link.url === path);
    if (index !== -1) setActive(index);
    else setActive(0);
  }, [path, setActive]);

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => router.push(link.url)}
    />
  ));

  return (
    <nav className=" h-screen w-fit bg-slate-100">
      <div className="flex flex-col">
        {links}
        {session ? (
          <div className="">
            <Avatar className="m-auto">
              <AvatarImage
                src={session?.user?.image || ""}
                alt={session?.user?.name || "avatar"}
              />
              <AvatarFallback>
                {session?.user?.name?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>

            <SignOutButton />
          </div>
        ) : (
          <div className="">
            <span></span>
            <SignInButton />
          </div>
        )}
      </div>
    </nav>
  );
}
