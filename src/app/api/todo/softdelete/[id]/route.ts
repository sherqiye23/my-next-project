import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';
import Todo from "@/models/todoModel";

interface Context {
    params: Promise<{
        id: string;
    }>;
}

export async function DELETE(
    request: NextRequest,
    context: Context
) {
    try {
        const { id } = await context.params;

        const todoId = id;
        const softdeletedTodo = await Todo.findOne({ _id: todoId })
        if (!softdeletedTodo) {
            return NextResponse.json({ message: "Todo is not found" }, { status: 404 });
        }
        if (softdeletedTodo.isSoftDeleted) {
            return NextResponse.json({ message: "Todo already soft deleted" }, { status: 400 });
        }

        softdeletedTodo.isSoftDeleted = true;
        await softdeletedTodo.save();
        return NextResponse.json({ message: `Todo soft deleted` }, { status: 200 });

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
