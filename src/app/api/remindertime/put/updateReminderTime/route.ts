import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';
import ReminderTime from "@/models/reminderTimeModel";

export async function PUT(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { reminderId, title, time } = reqBody

        if (!title.trim()) {
            return NextResponse.json({
                message: 'Title is required',
                success: false
            }, { status: 400 });
        }
        if (title.trim().length > 15) {
            return NextResponse.json({
                message: 'Title maximum 15 characters',
                success: false
            }, { status: 400 });
        }
        if (!time) {
            return NextResponse.json({
                message: 'Time is required',
                success: false
            }, { status: 400 });
        }

        const findReminder = await ReminderTime.findById(reminderId)
        if (!findReminder) {
            return NextResponse.json({
                message: "Reminder Time not found",
                success: false
            }, { status: 404 });
        }
        if (findReminder.isSoftDeleted) {
            return NextResponse.json({
                message: 'Reminder Time is soft deleted',
                success: false
            }, { status: 400 });
        }

        const existingTitle = await ReminderTime.findOne({ title: title.trim() })
        const existingTime = await ReminderTime.findOne({ time })
        if (existingTitle) {
            return NextResponse.json({
                message: "This title already exists",
                success: false
            }, { status: 400 });
        }
        if (existingTime) {
            return NextResponse.json({
                message: "This time already exists",
                success: false
            }, { status: 400 });
        }

        const updateReminderTime = await ReminderTime.findByIdAndUpdate(reminderId, {
            title: title,
            time
        }, { new: true })

        return NextResponse.json({
            message: 'Reminder Time updated successfully!',
            success: true,
            updateReminderTime
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