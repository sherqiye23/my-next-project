import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const refreshToken = request.cookies.get('refreshToken')?.value;

        if (!refreshToken) {
            return NextResponse.json({ error: "No Token" }, { status: 401 });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: string };

        const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET!, {
            expiresIn: "15m",
        });

        const res = NextResponse.json({ success: true });
        res.cookies.set("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
            maxAge: 60,
        });

        return res;
    } catch (error) {
        return NextResponse.json({ error: "Invalid refresh token" }, { status: 403 });
    }
}