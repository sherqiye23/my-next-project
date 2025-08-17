import cache from "@/lib/cache";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import Favorites from "@/models/favoritesModel";
import mongoose from 'mongoose';
import cloudinary from "@/lib/cloudinary";

connect()
type CloudinaryResultType = {
    secure_url: string;
    public_id: string;
};

export const config = {
    api: {
        bodyParser: false,
    },
};
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const profileImg = formData.get("profileImg");
        const bannerImg = formData.get("bannerImg");
        const email = formData.get("email");
        const username = formData.get("username");
        const password = formData.get("password");
        const otp = formData.get("otp");

        const cachedOtp = cache.get(email)

        if (!cachedOtp) {
            return NextResponse.json({ message: 'OTP expired or not found' }, { status: 400 });
        }
        if (Number(otp) !== cachedOtp) {
            return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
        }
        cache.delete(email);

        // image upload cloudinary
        // profile image
        let sendProfileImg;
        if (profileImg instanceof File) {
            const arrayBuffer = await profileImg.arrayBuffer();
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

        } else if (profileImg === '') {
            sendProfileImg = null
        } else {
            return NextResponse.json({
                message: "Invalid profile picture format",
                success: false,
            }, { status: 400 });
        }
        // banner image
        let sendBannerImg;
        if (bannerImg instanceof File) {
            const arrayBuffer = await bannerImg.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const result: CloudinaryResultType = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'banner-images' },
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
            sendBannerImg = shortImageUrl

        } else if (bannerImg === '') {
            sendBannerImg = null
        } else {
            return NextResponse.json({
                message: "Invalid banner picture format",
                success: false,
            }, { status: 400 });
        }

        // hash password if the user follows all the rules
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(String(password), salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            ...(sendProfileImg && { profileImg: sendProfileImg }),
            ...(sendBannerImg && { bannerImg: sendBannerImg }),
        });
        const savedUser = await newUser.save()

        // create favorite
        const newFavorites = new Favorites({
            userId: savedUser._id,
        })

        const savedFavorites = await newFavorites.save()

        await User.updateOne({ _id: savedUser._id }, { favoritesId: savedFavorites._id });

        return NextResponse.json({
            message: 'OTP verified! User created successfully!',
            success: true,
            savedUser
        })

    } catch (error: unknown) {
        if (error instanceof mongoose.Error.ValidationError) {
            const errors = Object.values(error.errors).map(el => {
                if (el instanceof mongoose.Error.ValidatorError) {
                    return el.message;
                }
                return 'Validation error';
            });
            return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
        } else if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
        }
    }
}