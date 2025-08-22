import { connect } from "@/dbConfig/dbConfig";
import Favorites from "@/models/favoritesModel";
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from "next/server";

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { todoListId, userFavoriteId } = reqBody

        const favorite = await Favorites.findById(userFavoriteId);

        if (!favorite) {
            return NextResponse.json({ error: "Favorite not found" }, { status: 404 });
        }

        if ((favorite.todoListIds as string[]).some(id => id.toString() === todoListId)) {
            return NextResponse.json(
                { message: "TodoList already in favorites" },
                { status: 200 }
            );
        }

        favorite.todoListIds.push(todoListId);
        await favorite.save();

        return NextResponse.json({ message: "TodoList added to favorites", favorite }, { status: 200 });

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