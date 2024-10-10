import { SupabaseAdapter } from "@auth/supabase-adapter";
import { NextAuthOptions } from "next-auth";
import Github from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET!,
	providers: [
		Github({
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
			},

			async authorize(credentials) {
				if (!credentials) {
					return null;
				}
				console.log("Credentials:", credentials)
				const user = await prisma.users.findUnique({
					where: {
						email: credentials.email,
					},
				});
				console.log("User:", user);
				if (user) {
					return user;
				} else {
					return null;
				}
			},
		}),
	],
	adapter: SupabaseAdapter({
		url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
		secret: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	}),
	session: {
		strategy: "jwt", // Using JWT instead of database session
	},
	callbacks: {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		async session({ session, token }) {
			return session;
		},
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		async jwt({ token, user }) {
			return token;
		},
	},
};
