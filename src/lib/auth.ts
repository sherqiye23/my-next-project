import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import Favorites from "@/models/favoritesModel";

connect()

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {

        async signIn({ user }) {
            try {
                if (!user.email) {
                    console.error("User email is missing during sign-in.");
                    return false;
                }

                const existingUser = await User.findOne({ email: user.email });

                if (!existingUser) {
                    const newUser = new User({
                        username: user.name?.split(" ").join("") || "user",
                        email: user.email,
                        password: "",
                        ...(user.image && { profileImg: user.image }),
                    });

                    const savedUser = await newUser.save();
                    console.log("New user added to DB:", savedUser.email);

                    const newFavorites = new Favorites({
                        userId: savedUser._id,
                    });
                    const savedFavorites = await newFavorites.save();

                    savedUser.favoritesId = savedFavorites._id;
                    await savedUser.save();

                } else {
                    console.log("User already exists in DB: ", existingUser.email);
                }
                return true;
            } catch (error) {
                console.error("Error during signIn callback:", error);
                return false;
            }
        },


        async jwt({ token, user }) {
            if (user) {
                try {
                    const dbUser = await User.findOne({ email: user.email });
                    if (dbUser) {
                        token.id = dbUser._id.toString();
                        token.isAdmin = dbUser.isAdmin;
                        token.username = dbUser.username;
                        token.profileImg = dbUser.profileImg;
                    }
                } catch (error) {
                    console.error("Error fetching user for JWT callback:", error);
                }
            }
            return token;
        },

        async session({ session, token }) {
            if (token.id) {
                session.user!.id = token.id;
            }
            if (token.isAdmin !== undefined) {
                session.user!.isAdmin = token.isAdmin;
            }
            if (token.username) {
                session.user!.username = token.username;
            }
            if (token.profileImg) {
                session.user!.profileImg = token.profileImg;
            }

            return session;
        },
    }
};
