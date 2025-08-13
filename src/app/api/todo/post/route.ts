import ReminderTime from "@/models/reminderTimeModel";
import TodoList from "@/models/todolistModel";
import Todo from "@/models/todoModel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { description, todoListId, reminderTime, customReminderTime, } = reqBody
        const isCustomReminderTime = customReminderTime ? true : false

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

        const findTodoList = await TodoList.findById(todoListId)
        if (!findTodoList) {
            return NextResponse.json({
                message: 'Todolist not found',
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

        const newTodo = new Todo({
            description: description.trim(),
            todoListId,
            ...(reminderTime && { reminderTime }),
            ...(customReminderTime && { customReminderTime }),
            isCustomReminderTime
        })

        const savedTodo = await newTodo.save()

        await TodoList.findByIdAndUpdate(todoListId, {
            $push: { todosArray: savedTodo._id }
        });


        return NextResponse.json({
            message: 'Todo created successfully!',
            success: true,
            savedTodo
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