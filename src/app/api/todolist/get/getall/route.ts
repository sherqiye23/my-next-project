import { connect } from "@/dbConfig/dbConfig";
import TodoList from "@/models/todolistModel";
import mongoose from 'mongoose';
import { NextResponse } from "next/server";

connect();

export async function GET() {
    try {
        const todolists = await TodoList.find({ isSoftDeleted: false });
        return NextResponse.json(todolists, { status: 200 });
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