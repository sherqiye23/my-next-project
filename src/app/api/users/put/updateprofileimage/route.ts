import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';
import User from "@/models/userModel";
import cloudinary from "@/lib/cloudinary";

type CloudinaryResultType = {
    secure_url: string;
    public_id: string;
};

const DEFAULT_IMAGE = "v1753739717/vcw9wjll2wphh2btpkym.jpg";
export const config = {
    api: {
        bodyParser: false,
    },
};
export async function PUT(request: NextRequest) {
    try {
        const formData = await request.formData();
        const profileImg = formData.get("profileImg");
        const userId = formData.get("userId");

        if (!userId) {
            return NextResponse.json({
                message: "User is not found",
                success: false
            }, { status: 404 });
        }

        const userFind = await User.findById(userId);
        if (!userFind) {
            return NextResponse.json({
                message: "User not found",
                success: false
            }, { status: 404 });
        }

        // image upload cloudinary
        // profile img
        let sendProfileImg = userFind.profileImg
        // delete old image from cloudinary
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
        // upload new image to cloudinary
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

        const updatedProfile = await User.findByIdAndUpdate(
            userId,
            { profileImg: sendProfileImg },
            { new: true }
        );

        return NextResponse.json(updatedProfile, { status: 200 });

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