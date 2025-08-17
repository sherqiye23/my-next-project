import mongoose, { Document, Types } from "mongoose";

export interface IFavorites extends Document {
    userId: Types.ObjectId,
    todoListIds: string[],
}

const favoritesSchema = new mongoose.Schema<IFavorites>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            unique: true,
        },
        todoListIds: {
            type: [String],
            default: []
        }
    },
    { timestamps: { createdAt: true, updatedAt: false } }
)

const Favorites = mongoose.models.Favorites || mongoose.model<IFavorites>('Favorites', favoritesSchema)

export default Favorites


