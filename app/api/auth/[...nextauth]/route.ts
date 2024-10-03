import NextAuth from "next-auth";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import Github from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Github({
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        }),
    ],
	adapter: SupabaseAdapter({
		url: process.env.SUPABASE_URL || "",
		secret: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
	}),
});
