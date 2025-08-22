import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';
import Todo from "@/models/todoModel";
import TodoList from "@/models/todolistModel";

interface Context {
    params: Promise<{
        id: string;
    }>;
}

export async function PUT(
    request: NextRequest,
    context: Context
) {
    try {
        const { id } = await context.params;

        const todoId = id;
        const changeIscompletedTodo = await Todo.findById(todoId)
        if (!changeIscompletedTodo) {
            return NextResponse.json({ message: "Todo is not found" }, { status: 404 });
        }

        const todoList = await TodoList.findById(changeIscompletedTodo.todoListId)
        if (!todoList) {
            return NextResponse.json({ message: "TodoList is not found" }, { status: 404 });
        }

        if (changeIscompletedTodo.isCompleted) {
            changeIscompletedTodo.isCompleted = false;
            await changeIscompletedTodo.save();
            if (todoList.isCompleted) {
                todoList.isCompleted = false;
                await todoList.save()
            }
            return NextResponse.json({ message: `Todo is not completed` }, { status: 200 });
        } else {
            changeIscompletedTodo.isCompleted = true;
            await changeIscompletedTodo.save();
            // my method
            // let allCompleted = true;
            // for (let index = 0; index < todoList.todosArray.length; index++) {
            //     const todo = await Todo.findById(todoList.todosArray[index]);
            //     if (!todo?.isCompleted) {
            //         allCompleted = false;
            //         break;
            //     }
            // }
            // if (allCompleted) {
            //     todoList.isCompleted = true;
            //     await todoList.save()
            // }
            const notCompleted = await Todo.exists({
                _id: { $in: todoList.todosArray },
                isCompleted: false,
            });

            if (!notCompleted) {
                todoList.isCompleted = true;
                await todoList.save();
            }

            return NextResponse.json({ message: `Todo is completed` }, { status: 200 });
        }

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
