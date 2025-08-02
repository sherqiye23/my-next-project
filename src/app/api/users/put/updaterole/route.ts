import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/models/userModel";
import mongoose from 'mongoose';

const SECRET = process.env.JWT_SECRET!;
interface MyJwtPayload extends JwtPayload {
    id: string;
    email: string;
    isAdmin: boolean;
}

export async function PUT(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get("userId");
        const role = url.searchParams.get("role");
        const roleBool = role === "true";

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

        const changeRoleUser = await User.findOne({ _id: userId })
        if (!changeRoleUser) {
            return NextResponse.json({ message: "User is not found" }, { status: 404 });
        }

        if (!decoded?.isAdmin) {
            return NextResponse.json({ message: "You are not admin" }, { status: 403 });
        }

        if (!userId || !role) {
            return NextResponse.json({ message: "userId and role required" }, { status: 400 });
        }

        await User.findByIdAndUpdate(userId, { isAdmin: roleBool })
        return NextResponse.json(
            { message: `${changeRoleUser.username}'s role has been changed to ${roleBool ? 'admin' : 'user'}` },
            { status: 200 }
        );

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