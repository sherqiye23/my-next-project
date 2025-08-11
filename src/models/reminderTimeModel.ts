import mongoose, { Document } from "mongoose";

export interface IReminderTime extends Document {
    title: string,
    createdById: string,
    categoryId: string,
    todosArray: string[],
    commentIdsArray: string[],
    isPrivate: boolean,
    isSoftDeleted: boolean,
}
// title, time, isSelected, isSoftDeleted, 
const reminderTimeSchema = new mongoose.Schema<IReminderTime>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
        },
        createdById: {
            type: String,
            required: [true, 'CreatedById is required'],
        },
        categoryId: {
            type: String,
            required: [true, 'CategoryId is required'],
        },
        todosArray: {
            type: [String],
            default: []
        },
        commentIdsArray: {
            type: [String],
            default: []
        },
        isPrivate: {
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
