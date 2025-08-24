import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';
import User from "@/models/userModel";
import cloudinary from "@/lib/cloudinary";

type CloudinaryResultType = {
    secure_url: string;
    public_id: string;
};

const DEFAULT_BANNER = "v1755469597/default-banner_pkbtz3.jpg";
export const config = {
    api: {
        bodyParser: false,
    },
};
export async function PUT(request: NextRequest) {
    try {
        const formData = await request.formData();
        const bannerImg = formData.get("bannerImg");
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
        // banner img
        let sendBannerImg = userFind.bannerImg
        // delete old image from cloudinary
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

        const updatedBanner = await User.findByIdAndUpdate(
            userId,
            { bannerImg: sendBannerImg },
            { new: true }
        );

        return NextResponse.json(updatedBanner, { status: 200 });

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