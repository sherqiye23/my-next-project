import mongoose, { Document } from "mongoose";

export interface ITodo extends Document {
    title: string,
    createdById: string,
    categoryId: string,
    todosArray: string[],
    commentIdsArray: string[],
    isPrivate: boolean,
    isSoftDeleted: boolean,
}
// todoListId, description, isCompleted, remidertimes[], iscustomremindertime, customremindertime, isSoftDeleted

const todoSchema = new mongoose.Schema<ITodo>(
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
            default: true
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
