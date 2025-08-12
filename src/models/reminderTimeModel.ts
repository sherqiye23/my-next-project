import mongoose, { Document } from "mongoose";

export interface IReminderTime extends Document {
    title: string,
    time: Date,
    isReminderSelected: boolean,
    isSoftDeleted: boolean,
}

const reminderTimeSchema = new mongoose.Schema<IReminderTime>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
        },
        time: {
            type: Date
        },
        isReminderSelected: {
            type: Boolean,
            default: false
        },
        isSoftDeleted: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
)

const ReminderTime = mongoose.models.ReminderTime || mongoose.model<IReminderTime>('ReminderTime', reminderTimeSchema)

export default ReminderTime
