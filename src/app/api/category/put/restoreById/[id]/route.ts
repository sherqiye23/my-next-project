import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from 'mongoose';
import Category from "@/models/categoryModel";

interface Context {
    params: Promise<{
        id: string;
    }>;
}

const SECRET = process.env.JWT_SECRET!;
interface MyJwtPayload extends JwtPayload {
    id: string;
    email: string;
    isAdmin: boolean;
}

export async function PUT(
    request: NextRequest,
    context: Context
) {
    try {
        const { id } = await context.params;

        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        if (!token) {
            return NextResponse.json({ message: "Token is not found" }, { status: 404 });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, SECRET) as MyJwtPayload;
        } catch (err) {
            return NextResponse.json({ message: "Token is invalid" }, { status: 401 });
        }

        if (!decoded.isAdmin) {
            return NextResponse.json({ message: "You are not admin" }, { status: 403 });
        }

        const categoryId = id;
        const restoreCategory = await Category.findOne({ _id: categoryId })
        if (!restoreCategory) {
            return NextResponse.json({ message: "Category is not found" }, { status: 404 });
        }
        if (!restoreCategory.isSoftDeleted) {
            return NextResponse.json({ message: "Category already restored" }, { status: 400 });
        }

        restoreCategory.isSoftDeleted = false;
        await restoreCategory.save();
        return NextResponse.json({ message: `Category restored` }, { status: 200 });

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
