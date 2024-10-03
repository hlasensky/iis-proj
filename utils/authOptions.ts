import { SupabaseAdapter } from "@auth/supabase-adapter";
import { NextAuthOptions } from "next-auth";
import Github from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
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
};
