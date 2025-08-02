import { connect } from "@/dbConfig/dbConfig";
import Favorites from "@/models/favoritesModel";
import { Error as MongooseError } from 'mongoose';
import { NextRequest, NextResponse } from "next/server";

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { todoListId, userFavoriteId } = reqBody

        const favorite = await Favorites.findOne({ _id: userFavoriteId })

        if (!favorite) {
            return NextResponse.json({ error: "Favorite not found" }, { status: 404 });
        }

        favorite.todoListIds.push(todoListId);
        await favorite.save();

        return NextResponse.json({ message: "TodoList added to favorites", favorite }, { status: 200 });

    } catch (error: unknown) {
        if (error instanceof MongooseError.ValidationError) {
            const errors = Object.values(error.errors).map((el: any) => el.message);
            return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
        }
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
    }
}