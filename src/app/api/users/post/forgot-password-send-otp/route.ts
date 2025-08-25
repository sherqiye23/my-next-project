import cache from "@/lib/cache";
import User from "@/models/userModel";
import { sendMail } from "@/utils/mail";
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from "next/server";

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { email } = reqBody

        const user = await User.findOne({ email })

        if (!user) {
            return NextResponse.json(
                { message: 'Email not found' },
                { status: 400 },
            );
        }

        // user finded
        // warning if sent otp code
        if (cache.has(email)) {
            cache.delete(email);
        }

        // otp code send
        const otp = generateOtp();
        cache.set(email, Number(otp));

        setTimeout(() => {
            cache.delete(email);
        }, 5 * 60 * 1000);

        try {
            await sendMail(email, otp);
        } catch (error) {
            console.error('Error sending mail:', error);
            return NextResponse.json({ message: 'Failed to send OTP email' }, { status: 500 });
        }

        return NextResponse.json({ message: "OTP sent. Validity period is 5 minutes" });

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