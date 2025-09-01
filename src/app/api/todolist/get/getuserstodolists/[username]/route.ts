import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';
import TodoList from "@/models/todolistModel";
import User from "@/models/userModel";

interface Context {
    params: Promise<{
        username: string;
    }>;
}

export async function GET(
    request: NextRequest,
    context: Context
) {
    try {
        const { username } = await context.params;
        const findUser = await User.findOne({
            username: { $regex: new RegExp(`^${username}$`, 'i') }
        });
        if (!findUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (!findUser.todoListIds.length) {
            return NextResponse.json([], { status: 200 });
        }

        const usersTodoLists = [];
        for (let index = 0; index < findUser.todoListIds.length; index++) {
            const find = await TodoList.findOne({
                _id: findUser.todoListIds[index],
                isSoftDeleted: false
            });
            if (find) usersTodoLists.push(find)
        }
        return NextResponse.json(usersTodoLists, { status: 200 });

    } catch (error: unknown) {
        if (error instanceof mongoose.Error.ValidationError) {
            const errors = Object.values(error.errors).map(el => {
                if (el instanceof mongoose.Error.ValidatorError) {
                    return el.message;
                }
                return 'Validation error';
            });
            return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
        } else if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
        }
    }
}
