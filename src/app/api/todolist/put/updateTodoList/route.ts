import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';
import TodoList from "@/models/todolistModel";

export async function PUT(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { todoListId, title, categoryId, isPrivate } = reqBody

        if (!title.trim()) {
            return NextResponse.json({
                message: 'Name is required',
                success: false
            }, { status: 400 });
        }
        if (title.trim().length > 30) {
            return NextResponse.json({
                message: 'Name maximum 30 characters',
                success: false
            }, { status: 400 });
        }
        if (!categoryId.trim()) {
            return NextResponse.json({
                message: 'Category is required',
                success: false
            }, { status: 400 });
        }

        const findedTodoList = await TodoList.findById(todoListId);
        if (!findedTodoList) {
            return NextResponse.json({
                message: 'Todo List is not found',
                success: false
            }, { status: 404 });
        }

        if (findedTodoList.isSoftDeleted) {
            return NextResponse.json({
                message: 'Todo List is soft deleted',
                success: false
            }, { status: 400 });
        }

        await TodoList.findByIdAndUpdate(todoListId, {
            title: title.trim(),
            categoryId,
            isPrivate
        });

        return NextResponse.json({
            message: 'Todo List updated successfully!',
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