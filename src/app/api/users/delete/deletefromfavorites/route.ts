import { connect } from "@/dbConfig/dbConfig";
import Favorites from "@/models/favoritesModel";
import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';

connect()

export async function DELETE(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { todoListId, userFavoriteId } = reqBody

        const favorite = await Favorites.findOne({ _id: userFavoriteId })

        if (!favorite) {
            return NextResponse.json({ error: "Favorite not found" }, { status: 404 });
        }

        favorite.todoListIds = favorite.todoListIds.filter((id: string) => id !== todoListId);
        await favorite.save();

        return NextResponse.json(
            { message: "TodoList removed from favorites" },
            { status: 200 }
        );

    }
    catch (error: unknown) {
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