import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { Error as MongooseError } from 'mongoose';
import { NextResponse } from "next/server";

connect();

export async function GET() {
    try {
        const users = await User.find({});
        return NextResponse.json(users, { status: 200 });
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