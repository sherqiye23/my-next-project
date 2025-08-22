import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';
import TodoList from "@/models/todolistModel";
import Favorites from "@/models/favoritesModel";

interface Context {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
    request: NextRequest,
    context: Context
) {
    try {
        const { id } = await context.params;

        const favoritesId = id;
        const findFavorites = await Favorites.findOne({ _id: favoritesId })
        if (!findFavorites) {
            return NextResponse.json({ message: "Favorites is not found" }, { status: 404 });
        }

        if (!findFavorites.todoListIds.length) {
            return NextResponse.json([], { status: 200 });
        }

        let favTodoList = [];
        for (let index = 0; index < findFavorites.todoListIds.length; index++) {
            const find = await TodoList.findById(findFavorites.todoListIds[index])
            favTodoList.push(find)
        }
        return NextResponse.json(favTodoList, { status: 200 });

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


