import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/models/userModel";
import Favorites from "@/models/favoritesModel";
import { Error as MongooseError } from 'mongoose';

const SECRET = process.env.JWT_SECRET!;
interface MyJwtPayload extends JwtPayload {
    id: string;
    email: string;
    isAdmin: boolean;
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
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

        const userId = params.id;
        const deletedUser = await User.findOne({ _id: userId })
        if (!deletedUser) {
            return NextResponse.json({ message: "User is not found" }, { status: 404 });
        }

        if (!decoded.isAdmin) {
            return NextResponse.json({ message: "You are not admin" }, { status: 403 });
        }
        // all todolists, all comment deleted
        // chat and messages deleted user
        await Favorites.findByIdAndDelete(deletedUser.favoritesId);
        await User.findByIdAndDelete(userId);
        return NextResponse.json({ message: `User deleted` }, { status: 200 });
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
