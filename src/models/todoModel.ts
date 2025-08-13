import mongoose, { Document, Types } from "mongoose";

export interface ITodo extends Document {
    description: string;
    todoListId: Types.ObjectId;
    isCompleted: boolean;
    reminderTime: Types.ObjectId | null;
    isCustomReminderTime: boolean;
    customReminderTime: Date | null;
    isSoftDeleted: boolean
}

const todoSchema = new mongoose.Schema<ITodo>(
    {
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        todoListId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TodoList',
            required: [true, 'TodoListId is required'],
        },
        isCompleted: {
            type: Boolean,
            default: false
        },
        reminderTime: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ReminderTime',
            default: null
        },
        isCustomReminderTime: {
            type: Boolean,
            default: false
        },
        customReminderTime: {
            type: Date,
            default: null
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
