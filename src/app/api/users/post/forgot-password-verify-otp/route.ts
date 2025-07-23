import cache from "@/lib/cache";
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

    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((el: any) => el.message);
            return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}