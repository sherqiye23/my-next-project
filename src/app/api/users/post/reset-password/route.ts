import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { email, newPassword, confirmPassword } = reqBody

        // check password
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

        if (newPassword !== confirmPassword) return NextResponse.json({ message: 'New password and confirm password do not match ', success: false }, { status: 400 });

        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(newPassword, salt)

        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({
            message: 'Password updated successfully!',
            success: true,
        })


    } catch (error: any) {
        if (error) {
            const errors = Object.values(error.errors).map((el: any) => el.message);
            return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}