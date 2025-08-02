import { cookies } from "next/headers";
import mongoose from 'mongoose';
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const cookieStore = await cookies();

        if (cookieStore.get('accessToken') || cookieStore.get('refreshToken')) {
            const response = NextResponse.json({ message: 'Logged out successfully' });

            response.cookies.set('accessToken', '', {
                httpOnly: true,
                secure: true,
                path: '/',
                expires: new Date(0),
            });

            response.cookies.set('refreshToken', '', {
                httpOnly: true,
                secure: true,
                path: '/',
                expires: new Date(0),
            });

            return response;
        }

        return NextResponse.json({ message: 'No tokens found' });

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