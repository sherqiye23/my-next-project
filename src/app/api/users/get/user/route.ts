import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

connect();

export async function GET(request: NextRequest) {
    try {
        const refreshToken = request.cookies.get("refreshToken")?.value;
        const accessToken = request.cookies.get("accessToken")?.value;

        const token = accessToken || refreshToken;
        if (!token) {
            return NextResponse.json({ error: "Token not found" }, { status: 404 });
        }
        // Tokeni yoxla
        let payload: any;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET!);
        } catch (err) {
            return NextResponse.json({ error: "Token is invalid" }, { status: 401 });
        }

        // find user from db
        const user = await User.findById(payload.userId).select("-password");
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // success and response userinfo
        return NextResponse.json({
            id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin
        });
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((el: any) => el.message);
            return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}