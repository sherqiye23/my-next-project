import cache from "@/lib/cache";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { email, username, password, otp } = reqBody

        const cachedOtp = cache.get(email)

        console.log(cachedOtp);
        console.log(reqBody);

        if (!cachedOtp) {
            return NextResponse.json({ message: 'OTP expired or not found' }, { status: 400 });
        }
        if (otp !== cachedOtp) {
            return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
        }

        cache.delete(email);
        // hash password if the user follows all the rules
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        // user saved after password hashed
        const savedUser = await newUser.save()

        return NextResponse.json({
            message: 'OTP verified! User created successfully!',
            success: true,
            savedUser
        })

    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((el: any) => el.message);
            return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}