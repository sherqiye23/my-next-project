import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';
import User from "@/models/userModel";
import cloudinary from "@/lib/cloudinary";

type CloudinaryResultType = {
    secure_url: string;
    public_id: string;
};

const DEFAULT_IMAGE = "v1753739717/vcw9wjll2wphh2btpkym.jpg";

export async function PUT(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { profileImg, userId } = reqBody

        const userFind = await User.findOne({ _id: userId });
        if (!userFind) {
            return NextResponse.json({
                message: "User not found",
                success: false
            }, { status: 404 });
        }

        // image upload cloudinary
        // profile img
        let sendProfileImg = userFind.profileImg
        if (profileImg instanceof File) {
            const oldProfileImgUrlPart = userFind.profileImg;
            if (oldProfileImgUrlPart && oldProfileImgUrlPart !== DEFAULT_IMAGE) {
                try {
                    const publicIdWithVersion = oldProfileImgUrlPart.substring(0, oldProfileImgUrlPart.lastIndexOf('.'));
                    await cloudinary.uploader.destroy(publicIdWithVersion);
                    console.log('Old profile image deleted');
                } catch (error) {
                    console.error('Deleted Error:', error);
                }
            }

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

        await User.findByIdAndUpdate(userId, {
            profileImg: sendProfileImg
        });

        return NextResponse.json({
            message: 'Profile image updated',
            success: true
        });

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