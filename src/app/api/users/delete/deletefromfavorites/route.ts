import { connect } from "@/dbConfig/dbConfig";
import Favorites from "@/models/favoritesModel";
import { NextRequest, NextResponse } from "next/server";

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

    } catch (error: any) {
        if (error) {
            const errors = Object.values(error.errors).map((el: any) => el.message);
            return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}