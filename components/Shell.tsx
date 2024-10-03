"use client";

import { AppShell, Burger, Flex, Space } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import SignInButton from "@/components/SignInButton";
import SignOutButton from "@/components/SignOutButton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Session } from "next-auth";

function Shell({ session }: { session: Session | null }) {
	const [opened, { toggle }] = useDisclosure();

	return (
		<AppShell
			header={{ height: 60 }}
			navbar={{
				width: 300,
				breakpoint: "sm",
				collapsed: { mobile: !opened },
			}}
			padding="md"
		>
			<AppShell.Header>
				<Flex
					mih={50}
					bg="rgba(0, 0, 0, .3)"
					gap="lg"
					justify="space-between"
					align="center"
					direction="row"
					wrap="wrap"
				>
					{session ? (
						<>
							<Avatar>
								<AvatarImage
									src={session?.user?.image || ""}
									alt={session?.user?.name || "avatar"}
								/>
								<AvatarFallback>
									{session?.user?.name?.charAt(0) || "A"}
								</AvatarFallback>
							</Avatar>

							<SignOutButton />
						</>
					) : (
						<div>
							<SignInButton />
							<p>Not authenticated</p>
						</div>
					)}
				</Flex>

				<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
			</AppShell.Header>

			<AppShell.Navbar p="md">Navbar</AppShell.Navbar>

			<AppShell.Main>
				<p>Hello, world!</p>
			</AppShell.Main>
		</AppShell>
	);
}

export default Shell;
