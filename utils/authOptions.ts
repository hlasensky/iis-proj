import { SupabaseAdapter } from "@auth/supabase-adapter";
import { NextAuthOptions } from "next-auth";
import Github from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET!,
	providers: [
		Github({
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
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
		async session({ session, token }) {
			console.log("Session:", session);
			console.log("Token:", token);
			return session;
		},
		async jwt({ token, user }) {
            console.log("JWT Token:", token);
            console.log("User:", user);
			return token;
		},
	},
};
