import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { Error as MongooseError } from 'mongoose';
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username");

        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            id: user._id,
            profileImg: user.profileImg,
            username: user.username,
            email: user.email,
            favoritesId: user.favoritesId,
            todoListIds: user.todoListIds,
            chatIds: user.chatIds,
            isAdmin: user.isAdmin,
        }, { status: 200 });
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