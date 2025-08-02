import cache from "@/lib/cache";
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { email, otp } = reqBody

        const cachedOtp = cache.get(email)

        if (!cachedOtp) {
            return NextResponse.json({ message: 'OTP expired or not found' }, { status: 400 });
        }
        if (otp !== cachedOtp) {
            return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
        }

        cache.delete(email);

        return NextResponse.json({
            message: 'OTP verified! Go to reset password',
            success: true,
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