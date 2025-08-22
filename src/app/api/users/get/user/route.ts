import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { connect } from "@/dbConfig/dbConfig";
import mongoose from 'mongoose';
import User from "@/models/userModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

connect();

interface MyJwtPayload extends JwtPayload {
    id: string;
    email: string;
    isAdmin: boolean;
}

export async function GET(request: NextRequest) {
    try {
        // session control
        const session = await getServerSession(authOptions);

        if (session) {
            const user = await User.findById(session.user.id).select("-password");
            if (!user) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }
            return NextResponse.json(user);
        }

        // token control
        const refreshToken = request.cookies.get("refreshToken")?.value;
        const accessToken = request.cookies.get("accessToken")?.value;
        const token = accessToken || refreshToken;

        if (!token) {
            return NextResponse.json({ error: "Token not found" }, { status: 404 });
        }

        let payload: MyJwtPayload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET!) as MyJwtPayload;
        } catch (err) {
            return NextResponse.json({ error: "Token is invalid" }, { status: 401 });
        }

        // find user from db
        const user = await User.findById(payload.userId).select("-password");
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // success and response userinfo
        return NextResponse.json(user);
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