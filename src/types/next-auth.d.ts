import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        accessToken?: unknown;
        user: {
            id?: string;
            isAdmin?: boolean;
            username?: string;
            profileImg?: string;
        } & DefaultSession["user"];
    }

    interface JWT {
        accessToken?: string;
        id?: string;
        isAdmin?: boolean;
        username?: string;
        profileImg?: string;
    }
}
