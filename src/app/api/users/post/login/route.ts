import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';
import { Error as MongooseError } from 'mongoose';
import jwt from 'jsonwebtoken';

connect()
// login checks
export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { email, password, rememberMe } = reqBody
        console.log(reqBody);

        // check user email
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 400 },
            );
        }

        // compare entered password with hashed password in DB
        const isPasswordCorrect = await bcryptjs.compare(password, user.password);

        if (!isPasswordCorrect) {
            return NextResponse.json(
                { message: 'Password is wrong' },
                { status: 401 },
            );
        }

        // if password is correct:
        const payload = {
            userId: user._id,
            isAdmin: user.isAdmin,
            username: user.username
        };
        try {
            const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '15m' });
            const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
            const response = NextResponse.json({
                accessToken,
                success: true,
            });
            response.cookies.set("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 60,
            });
            if (rememberMe) {
                response.cookies.set("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    path: "/",
                    maxAge: 7 * 24 * 60 * 60,
                });
            }
            return response;
        } catch (error) {
            console.error('Error signing JWT:', error);
            return NextResponse.json({ message: 'Failed to generate token' }, { status: 500 });
        }

    } catch (error: unknown) {
        if (error instanceof MongooseError.ValidationError) {
            const errors = Object.values(error.errors).map((el: any) => el.message);
            return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
        }
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
    }
}
