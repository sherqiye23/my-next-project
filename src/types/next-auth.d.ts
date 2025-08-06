import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            isAdmin: boolean;
            username: string;
            profileImg?: string | null;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        id: string;
        isAdmin: boolean;
        username: string;
        profileImg?: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        isAdmin: boolean;
        username: string;
        profileImg?: string | null;
    }
}
