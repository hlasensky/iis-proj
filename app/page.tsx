import SignInButton from "@/components/SignInButton";
import { getServerSession } from "next-auth";

export default async function Home() {
	const session = await getServerSession();


	return (
		<main>
      <SignInButton />
      {session ? <p>Authenticated</p> : <p>Not authenticated</p>}
			<p>Hello, world!</p>
		</main>
	);
}
