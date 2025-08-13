import mongoose, { Document } from "mongoose";

export interface IReminderTime extends Document {
    title: string,
    time: Date,
    isSoftDeleted: boolean,
}

const reminderTimeSchema = new mongoose.Schema<IReminderTime>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            unique: true
        },
        time: {
            type: Date,
            required: [true, 'Time is required'],
            unique: true
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
