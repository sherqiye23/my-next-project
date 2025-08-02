import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs'
import mongoose from 'mongoose';

export async function PUT(request: NextRequest, { }) {
    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get("userId");
        const oldPassword = url.searchParams.get("oldPassword");
        const newPassword = url.searchParams.get("newPassword");
        const confirmPassword = url.searchParams.get("confirmPassword");

        // user check
        const user = await User.findOne({ _id: userId })
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 })
        }

        // inputs check
        if (!oldPassword || !newPassword || !confirmPassword) {
            return NextResponse.json({ message: "Inputs required" }, { status: 400 });
        }

        // check old and new password
        if (newPassword === oldPassword) return NextResponse.json({ message: 'New password cannot be the same as the old password' }, { status: 400 });

        // oldPassword check
        const isPasswordCorrect = await bcryptjs.compare(oldPassword, user.password);

        if (!isPasswordCorrect) {
            return NextResponse.json(
                { message: 'Old password is wrong' },
                { status: 401 },
            );
        }

        // check newPassword
        function validatePassword(password: string): string | null {
            if (password.trim().length < 8 && password.trim().length > 0) return 'Password must be at least 8 characters long';
            if (password.trim().length > 32) return 'Password must be at most 32 characters long';
            if (!/[A-Z]/.test(password)) return 'Password must include uppercase character';
            if (!/[a-z]/.test(password)) return 'Password must include lowercase character';
            if (!/\d/.test(password)) return 'Password must include number character';
            if (!/[\W_]/.test(password)) return 'Password must include special character';
            return null;
        }

        const error = validatePassword(newPassword);
        if (error) return NextResponse.json({ message: error, success: false }, { status: 400 });

        // check new and confirm password
        if (newPassword !== confirmPassword) return NextResponse.json({ message: 'New password and confirm password do not match' }, { status: 400 });

        // hashed new password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(newPassword, salt)

        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({
            message: 'Password updated successfully',
            success: true,
        })

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