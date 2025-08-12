import mongoose, { Document } from "mongoose";

export interface ITodo extends Document {
    description: string,
    todoListId: string,
    isCompleted: boolean,
    remiderTimes: string[],
    isCustomReminderTime: boolean,
    customReminderTime: string,
    isSoftDeleted: boolean
}

const todoSchema = new mongoose.Schema<ITodo>(
    {
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        todoListId: {
            type: String,
            required: [true, 'TodoListId is required'],
        },
        isCompleted: {
            type: Boolean,
            default: false
        },
        remiderTimes: {
            type: [String],
            default: []
        },
        isCustomReminderTime: {
            type: Boolean
        },
        customReminderTime: {
            type: String,
        },
        isSoftDeleted: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
)

const Todo = mongoose.models.Todo || mongoose.model<ITodo>('Todo', todoSchema)

export default Todo
