import mongoose, { Document, Types } from "mongoose";

export interface ICategory extends Document {
    // _id: Types.ObjectId;
    name: string,
    createdById: Types.ObjectId,
    isCustom: boolean,
    isSoftDeleted: boolean,
    todoListIds: string[],
    color: string
}

const categorySchema = new mongoose.Schema<ICategory>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        createdById: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
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
        color: {
            type: String,
            default: '#2563EB'
        }
    },
    { timestamps: { createdAt: true, updatedAt: false } }
)

const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema)

export default Category
