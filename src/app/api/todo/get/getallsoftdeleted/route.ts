import { connect } from "@/dbConfig/dbConfig";
import Todo from "@/models/todoModel";
import mongoose from 'mongoose';
import { NextResponse } from "next/server";

connect();

export async function GET() {
    try {
        const todos = await Todo.find({ isSoftDeleted: true });
        return NextResponse.json(todos, { status: 200 });
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