import mongoose, { Document, Types } from "mongoose";

export interface ITodoList extends Document {
    title: string,
    createdById: Types.ObjectId,
    categoryId: Types.ObjectId,
    todosArray: Types.ObjectId[],
    commentIdsArray: string[],
    isReported: boolean,
    isPrivate: boolean,
    isSoftDeleted: boolean,
    isCompleted: boolean,
}

const todolistSchema = new mongoose.Schema<ITodoList>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
        },
        createdById: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'CreatedById is required'],
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'CategoryId is required'],
        },
        todosArray: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Todo',
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
        isCompleted: {
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
