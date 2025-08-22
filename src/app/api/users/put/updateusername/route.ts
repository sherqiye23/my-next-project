import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';
import User from "@/models/userModel";

export async function PUT(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { username, userId } = reqBody

        const userFind = await User.findOne({ _id: userId });
        if (!userFind) {
            return NextResponse.json({
                message: "User not found",
                success: false
            }, { status: 404 });
        }

        const trimmedName = username.trim();
        if (!trimmedName) {
            return NextResponse.json({
                message: 'Username is required',
                success: false
            }, { status: 400 });
        }
        if (trimmedName.length > 30) {
            return NextResponse.json({
                message: 'Username maximum 30 characters',
                success: false
            }, { status: 400 });
        }

        const existing = await User.findOne({ username: trimmedName, _id: { $ne: userId } });
        if (existing) {
            return NextResponse.json({
                message: "This username exists",
                success: false
            }, { status: 400 });
        }

        await User.findByIdAndUpdate(userId, {
            username: trimmedName,
        });

        return NextResponse.json({
            message: 'Username updated',
            success: true
        });

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