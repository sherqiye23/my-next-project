import mongoose, { Document } from "mongoose";

export interface ITodoList extends Document {
    title: string,
    createdById: string,
    categoryId: string,
    todosArray: string[],
    commentIdsArray: string[],
    isReported: boolean,
    isPrivate: boolean,
    isSoftDeleted: boolean,
}

const todolistSchema = new mongoose.Schema<ITodoList>(
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
        isReported: {
            type: Boolean,
            default: false
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

const TodoList = mongoose.models.TodoList || mongoose.model<ITodoList>('TodoList', todolistSchema)

export default TodoList
