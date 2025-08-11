import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';
import TodoList from "@/models/todolistModel";

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { userId, title, categoryId, isPrivate } = reqBody

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

        const newTodoList = new TodoList({
            title,
            isPrivate,
            categoryId,
            createdById: userId,
        })

        const savedTodoList = await newTodoList.save()

        return NextResponse.json({
            message: 'Todo List created successfully!',
            success: true,
            savedTodoList
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