import mongoose, { Document } from "mongoose";

export interface ICategory extends Document {
    name: string,
    createdById: string,
    isCustom: boolean,
    isSoftDeleted: boolean,
    todoListIds: string[],
}

const categorySchema = new mongoose.Schema<ICategory>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        createdById: {
            type: String,
            required: [true, 'CreatedById is required'],
        },
        isCustom: {
            type: Boolean,
            default: true
        },
        isSoftDeleted: {
            type: Boolean,
            default: false
        },
        todoListIds: {
            type: [String],
            default: []
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
)

const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema)

export default Category
