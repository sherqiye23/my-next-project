import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import Favorites from "@/models/favoritesModel";
import jwt from 'jsonwebtoken';
import { JWT } from "next-auth/jwt"
import { randomBytes, randomUUID } from "crypto";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
        generateSessionToken: () => {
            return randomUUID?.() ?? randomBytes(32).toString("hex")
        }
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
    callbacks: {
        async signIn({ user, account }) {
            await connect();

            const existingUser = await User.findOne({ email: user.email });

            if (!existingUser) {
                const newUser = new User({
                    username: user.name?.split(" ").join("") || "user",
                    email: user.email,
                    password: "",
                    ...(user.image && { profileImg: user.image }),
                });

                const savedUser = await newUser.save()
                console.log("New user added db");

                // create favorite
                const newFavorites = new Favorites({
                    userId: savedUser._id,
                })

                const savedFavorites = await newFavorites.save()

                savedUser.favoritesId = savedFavorites._id;
                await savedUser.save();

                return true;
            } else {
                console.log("User is already available");
            }

            return true;
        },

        // async jwt({ token, user }) {
        //     interface IUser {
        //         _id?: string;
        //         id?: string;
        //         isAdmin: boolean;
        //         username: string;
        //         profileImg?: string;
        //         image?: string;
        //         email: string;
        //         accessToken: string;
        //     }
        //     if (user) {
        //         const u = user as IUser
        //         token.id = u.id || u._id
        //         token.email = u.email
        //         token.accessToken = u.accessToken
        //     }
        //     return token;
        // if (user) {
        //     const u = user as IUser
        //     token.id = u.id ?? u._id;
        //     token.isAdmin = u.isAdmin ?? false;
        //     token.username = u.username;
        //     token.profileImg = u.profileImg ?? user.image;

        //     const payload = {
        //         userId: token.id,
        //         isAdmin: token.isAdmin,
        //         username: token.username,
        //     };

        //     token.accessToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "15m" });
        // }
        // return token;
        // },
        // cookies: {
        //     sessionToken: {
        //         name: `__Secure-next-auth.session-token`,
        //         options: {
        //             httpOnly: true,
        //             sameSite: 'lax',
        //             path: '/',
        //             secure: true
        //         }
        //     },
        // },

        async session({ session, token }) {
            // if (session.user && token) {
            //     session.user.id = token.id as string;
            //     session.user.isAdmin = token.isAdmin as boolean;
            //     session.user.username = token.username as string;
            //     session.user.profileImg = token.profileImg as string;
            //     session.accessToken = token.accessToken;
            // }
            // return session;
            await connect();

            const dbUser = await User.findOne({ email: session.user?.email });
            if (dbUser) {
                session.user!.id = dbUser._id.toString();
                session.user!.isAdmin = dbUser.isAdmin;
                session.user!.username = dbUser.username;
                session.user!.profileImg = dbUser.profileImg;

                const payload = {
                    userId: dbUser._id.toString(),
                    isAdmin: dbUser.isAdmin,
                    username: dbUser.username
                };
                // try {
                //     const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '15m' });
                //     // const response = NextResponse.json({
                //     //     accessToken,
                //     //     success: true,
                //     // });
                //     cookies.set("accessToken", accessToken, {
                //         httpOnly: true,
                //         secure: process.env.NODE_ENV === "production",
                //         sameSite: "strict",
                //         path: "/",
                //         maxAge: 60,
                //     });
                //     return accessToken;
                // } catch (error) {
                //     console.error('Error signing JWT:', error);
                // }
            }

            return session;
        },
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
