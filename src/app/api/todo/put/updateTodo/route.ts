import ReminderTime from "@/models/reminderTimeModel";
import Todo from "@/models/todoModel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { todoId, description, reminderTime, customReminderTime, isCompleted } = reqBody
        const isCustomReminderTime = customReminderTime ? true : false
        // const isCompletedBool = isCompleted == 'true' ? true : false

        if (!description.trim()) {
            return NextResponse.json({
                message: 'Description is required',
                success: false
            }, { status: 400 });
        }
        if (description.trim().length > 50) {
            return NextResponse.json({
                message: 'Description maximum 50 characters',
                success: false
            }, { status: 400 });
        }

        const findTodo = await Todo.findById(todoId)
        if (!findTodo) {
            return NextResponse.json({
                message: 'Todo not found',
                success: false
            }, { status: 404 });
        }

        if (reminderTime) {
            const findReminder = await ReminderTime.findById(reminderTime)
            if (!findReminder) {
                return NextResponse.json({
                    message: 'Reminder Time not found',
                    success: false
                }, { status: 404 });
            }
        }

        const updatedTodo = await Todo.findByIdAndUpdate(todoId, {
            description: description.trim(),
            ...(reminderTime && { reminderTime }),
            ...(customReminderTime && { customReminderTime }),
            isCompleted,
            isCustomReminderTime
        }, { new: true })

        return NextResponse.json({
            message: 'Todo updated successfully!',
            success: true,
            updatedTodo
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