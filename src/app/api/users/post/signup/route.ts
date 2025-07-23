import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';

connect()

// signup checks
export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { username, email, password } = reqBody
        console.log(reqBody);

        //check username
        if (!username.trim()) {
            return NextResponse.json({
                message: 'Username is required.',
                success: false
            }, { status: 400 });
        }

        // check email
        if (!email.trim()) {
            return NextResponse.json({
                message: 'Email address is required.',
                success: false
            }, { status: 400 });
        }
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({
                message: 'Please enter a valid email.',
                success: false
            }, { status: 400 });
        }

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

        const error = validatePassword(password);
        if (error) return NextResponse.json({ message: error, success: false }, { status: 400 });

        // check if username or email already exists
        const user = await User.findOne({ email })
        const userUsername = await User.findOne({ username })
        if (user) {
            return NextResponse.json(
                { message: 'E-mail already exists' },
                { status: 400 },
            )
        }
        if (userUsername) {
            return NextResponse.json(
                { message: 'Username already exists' },
                { status: 400 },
            )
        }

        // new user create
        // hash password if the user follows all the rules
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        // user saved after password hashed
        const savedUser = await newUser.save()

        return NextResponse.json({
            message: 'User created successfully!',
            success: true,
            savedUser
        })

    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((el: any) => el.message);
            return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

