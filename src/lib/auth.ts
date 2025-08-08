import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import Favorites from "@/models/favoritesModel";
import cloudinary from "@/lib/cloudinary";

connect()

type CloudinaryResultType = {
    secure_url: string;
    public_id: string;
};

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
                    // image upload cloudinary
                    let sendProfileImg;
                    if (user.image) {
                        const response = await fetch(user.image);
                        const arrayBuffer = await response.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);

                        const result: CloudinaryResultType = await new Promise((resolve, reject) => {
                            const uploadStream = cloudinary.uploader.upload_stream(
                                { folder: 'profile-images' },
                                (error, uploadResult) => {
                                    if (error) {
                                        return reject(error);
                                    }
                                    resolve(uploadResult as CloudinaryResultType);
                                }
                            );
                            uploadStream.end(buffer);
                        });
                        const fullImageUrl = result.secure_url;
                        const uploadIndex = fullImageUrl.indexOf("/upload/");
                        let shortImageUrl = fullImageUrl;

                        if (uploadIndex !== -1) {
                            shortImageUrl = fullImageUrl.substring(uploadIndex + "/upload/".length);
                        }
                        sendProfileImg = shortImageUrl

                    } else if (user.image === '') {
                        sendProfileImg = null
                    } else {
                        console.log("Invalid profile picture format")
                    }

                    const newUser = new User({
                        username: user.name?.split(" ").join("") || "user",
                        email: user.email,
                        password: "",
                        ...(sendProfileImg && { profileImg: sendProfileImg }),
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
