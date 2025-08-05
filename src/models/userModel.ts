import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    username: string,
    email: string,
    password: string,
    isAdmin: boolean,
    profileImg: string,
    favoritesId: string,
    todoListIds: string[],
    chatIds: string[],
}

const userSchema = new mongoose.Schema<IUser>(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            maxlength: 30,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, 'Email address is required'],
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please enter a valid email'
            ],
        },
        password: {
            type: String,
            // required: [true, 'Password is required'],
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        profileImg: {
            type: String,
            default: "v1753739717/vcw9wjll2wphh2btpkym.jpg"
        },
        favoritesId: {
            type: String
        },
        todoListIds: {
            type: [String],
            default: []
        },
        chatIds: {
            type: [String],
            default: []
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
)

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema)

export default User


