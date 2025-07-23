import { cookies } from "next/headers";
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

    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((el: any) => el.message);
            return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}