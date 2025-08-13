import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';
import Todo from "@/models/todoModel";
import ReminderTime from "@/models/reminderTimeModel";

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

        const reminderTimeId = id;
        const softdeletedReminderTime = await ReminderTime.findOne({ _id: reminderTimeId })
        if (!softdeletedReminderTime) {
            return NextResponse.json({ message: "Reminder time is not found" }, { status: 404 });
        }
        if (softdeletedReminderTime.isSoftDeleted) {
            return NextResponse.json({ message: "Reminder time already soft deleted" }, { status: 400 });
        }

        await Todo.updateMany(
            { reminderTime: reminderTimeId },
            {
                $set: {
                    reminderTime: null,
                    isCustomReminderTime: true,
                    customReminderTime: softdeletedReminderTime.time
                }
            }
        );

        softdeletedReminderTime.isSoftDeleted = true;
        await softdeletedReminderTime.save();
        return NextResponse.json({ message: `Reminder time soft deleted` }, { status: 200 });

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
