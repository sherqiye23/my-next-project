import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';
import ReminderTime from "@/models/reminderTimeModel";

interface Context {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
    request: NextRequest,
    context: Context
) {
    try {
        const { id } = await context.params;
        const remindertime = await ReminderTime.findOne({ _id: id });
        if (!remindertime) {
            return NextResponse.json({ message: "Reminder time is not found" }, { status: 404 });
        }
        return NextResponse.json(remindertime, { status: 200 });

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
