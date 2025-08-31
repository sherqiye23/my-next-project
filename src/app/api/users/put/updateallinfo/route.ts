import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';
import User from "@/models/userModel";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import cloudinary from "@/lib/cloudinary";

const SECRET = process.env.JWT_SECRET!;
interface MyJwtPayload extends JwtPayload {
    id: string;
    email: string;
    isAdmin: boolean;
}

type CloudinaryResultType = {
    secure_url: string;
    public_id: string;
};

const DEFAULT_IMAGE = "v1753739717/vcw9wjll2wphh2btpkym.jpg";
const DEFAULT_BANNER = "v1755469597/default-banner_pkbtz3.jpg";
export const config = {
    api: {
        bodyParser: false,
    },
};
export async function PUT(request: NextRequest) {
    try {
        const formData = await request.formData();
        const userId = formData.get("userId");
        const username = formData.get("username");
        const profileImg = formData.get("profileImg");
        const bannerImg = formData.get("bannerImg");
        const isAdmin = formData.get("isAdmin");
        const roleBool = isAdmin === "true";

        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        if (!token) {
            return NextResponse.json({ message: "Token is not found" }, { status: 401 });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, SECRET) as MyJwtPayload;
        } catch (err) {
            return NextResponse.json({ message: "Token is invalid" }, { status: 401 });
        }

        if (!decoded?.isAdmin) {
            return NextResponse.json({ message: "You are not admin" }, { status: 403 });
        }

        const userFind = await User.findOne({ _id: userId });
        if (!userFind) {
            return NextResponse.json({
                message: "User not found",
                success: false
            }, { status: 404 });
        }

        if (typeof username !== 'string' || !username) {
            return NextResponse.json({
                message: 'Username is required and must be a string',
                success: false
            }, { status: 400 });
        }

        const trimmedName = username.trim();
        if (trimmedName.length === 0) {
            return NextResponse.json({
                message: 'Username cannot be empty',
                success: false
            }, { status: 400 });
        }
        if (trimmedName.length > 30) {
            return NextResponse.json({
                message: 'Username maximum 30 characters',
                success: false
            }, { status: 400 });
        }

        const existing = await User.findOne({ username: trimmedName, _id: { $ne: userId } });
        if (existing) {
            return NextResponse.json({
                message: "This username exists",
                success: false
            }, { status: 400 });
        }

        // pp
        let sendProfileImg = userFind.profileImg
        const oldProfileImgUrlPart = userFind.profileImg;
        if (oldProfileImgUrlPart && oldProfileImgUrlPart !== DEFAULT_IMAGE) {
            try {
                const urlParts = oldProfileImgUrlPart.split('/');
                const folder = urlParts[1];
                const fileWithExtension = urlParts[2];
                const fileWithoutExtension = fileWithExtension.substring(0, fileWithExtension.lastIndexOf('.'));

                const publicId = `${folder}/${fileWithoutExtension}`;
                await cloudinary.uploader.destroy(publicId);

                console.log('Old profile image deleted:', publicId);
            } catch (error) {
                console.error('Deleted Error:', error);
            }
        }
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
            sendProfileImg = DEFAULT_IMAGE
        }

        // banner
        let sendBannerImg = userFind.bannerImg
        const oldBannerImgUrlPart = userFind.bannerImg;
        if (oldBannerImgUrlPart && oldBannerImgUrlPart !== DEFAULT_BANNER) {
            try {
                const urlParts = oldBannerImgUrlPart.split('/');
                const folder = urlParts[1];
                const fileWithExtension = urlParts[2];
                const fileWithoutExtension = fileWithExtension.substring(0, fileWithExtension.lastIndexOf('.'));

                const publicId = `${folder}/${fileWithoutExtension}`;
                await cloudinary.uploader.destroy(publicId);

                console.log('Old banner image deleted:', publicId);
            } catch (error) {
                console.error('Deleted Error:', error);
            }
        }
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
            sendBannerImg = DEFAULT_BANNER
        }

        // updatee
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                username: trimmedName,
                isAdmin: roleBool,
                profileImg: sendProfileImg,
                bannerImg: sendBannerImg
            },
            { new: true }
        );

        return NextResponse.json(updatedUser, { status: 200 });

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