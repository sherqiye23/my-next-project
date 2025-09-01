import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';
import TodoList from "@/models/todolistModel";
import Todo from "@/models/todoModel";

interface Context {
    params: Promise<{
        todolistid: string;
    }>;
}

export async function GET(
    request: NextRequest,
    context: Context
) {
    try {
        const { todolistid } = await context.params;
        const findTodolist = await TodoList.findById(todolistid)
        if (!findTodolist) {
            return NextResponse.json({ message: "Todolist not found" }, { status: 404 });
        }

        if (!findTodolist.todosArray.length) {
            return NextResponse.json([], { status: 200 });
        }

        const todos = [];
        for (let index = 0; index < findTodolist.todosArray.length; index++) {
            const find = await Todo.findOne({
                _id: findTodolist.todosArray[index],
                isSoftDeleted: false
            });
            if (find) todos.push(find)
        }
        return NextResponse.json(todos, { status: 200 });

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
