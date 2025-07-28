import mongoose, { Document } from "mongoose";

export interface IFavorites extends Document {
    userId: string,
    todoListIds: string[],
    createdAt: Date
}

const favoritesSchema = new mongoose.Schema<IFavorites>(
    {
        userId: {
            type: String,
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


