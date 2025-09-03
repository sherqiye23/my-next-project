import { columType } from "@/types/admintable.types";
import UserEditButton from "../Tables buttons/User/UserEditButton";
import UserDeleteButton from "../Tables buttons/User/UserDeleteButton";
import { IUser } from "@/models/userModel";
import UserSeeTodoListsButton from "../Tables buttons/User/UserSeeTodoListsButton";
import { ITodoList } from "@/models/todolistModel";
import TodoListEditButton from "../Tables buttons/Todo List/TodoListEditButton";
import TodoListSeeTodosButton from "../Tables buttons/Todo List/TodoListSeeTodosButton";
import TodoListDeleteButton from "../Tables buttons/Todo List/TodoListDeleteButton";
import TodoListSoftDeleteButton from "../Tables buttons/Todo List/TodoListSoftDeleteButton";
import TodoListRestoreButton from "../Tables buttons/Todo List/TodoListRestoreButton";
import { ITodo } from "@/models/todoModel";
import TodoDeleteButton from "../Tables buttons/Todo/TodoDeleteButton";
import TodoSoftDeleteButton from "../Tables buttons/Todo/TodoSoftDeleteButton";
import TodoRestoreButton from "../Tables buttons/Todo/TodoRestoreButton";
import TodoEditButton from "../Tables buttons/Todo/TodoEditButton";

type MyPropsType<T> = {
    column: columType<T>,
    item: T,
    index: number,
}

export default function TableCell<T,>({ column, item, index }: MyPropsType<T>) {
    if (column.type === "text") {
        return (
            <td className={`p-1 whitespace-nowrap`}>
                {column.getValue(item)}
            </td>
        );
    } else if (column.type === "id") {
        return (
            <td className="p-1">
                {index + 1}
            </td>
        );
    } else if (column.type === "color") {
        return (
            <td className={`p-1 whitespace-nowrap font-bold`}
                style={{
                    color: (item as { color?: string })?.color || ''
                }}>
                {column.getValue(item)}
            </td>
        );
    } else if (column.type === "image") {
        return (
            <td className="p-1">
                <img
                    src={column.getValue(item)}
                    alt="image"
                    width="70px"
                    height="70px"
                />
            </td>
        )
    }
    // USER BUTTONS
    else if (column.type === "userEdit") {
        if ((item as IUser).username) {
            return (
                <td className="p-1">
                    <UserEditButton user={item as IUser} />
                </td>
            );
        }
        return <td className="p-1">Invalid User</td>;
    } else if (column.type === "userDelete") {
        if ((item as IUser).username) {
            return (
                <td className="p-1">
                    <UserDeleteButton user={item as IUser} />
                </td>
            );
        }
        return <td className="p-1">Invalid User</td>;
    } else if (column.type === "userSeeTodoLists") {
        if ((item as IUser).username) {
            return (
                <td className="p-1">
                    <UserSeeTodoListsButton user={item as IUser} />
                </td>
            );
        }
        return <td className="p-1">Invalid User</td>;
    }
    // TODOLIST BUTTONS
    else if (column.type === "todoListEdit") {
        if ((item as ITodoList).title) {
            return (
                <td className="p-1">
                    <TodoListEditButton todolist={item as ITodoList} />
                </td>
            );
        }
        return <td className="p-1">Invalid Todo List</td>;
    } else if (column.type === "todoListDelete") {
        if ((item as ITodoList).title) {
            return (
                <td className="p-1">
                    <TodoListDeleteButton todolist={item as ITodoList} />
                </td>
            );
        }
        return <td className="p-1">Invalid Todo List</td>;
    } else if (column.type === "todoListSoftDelete") {
        if ((item as ITodoList).title) {
            return (
                <td className="p-1">
                    <TodoListSoftDeleteButton todolist={item as ITodoList} />
                </td>
            );
        }
        return <td className="p-1">Invalid Todo List</td>;
    } else if (column.type === "todoListSeeTodos") {
        if ((item as ITodoList).title) {
            return (
                <td className="p-1">
                    <TodoListSeeTodosButton todolist={item as ITodoList} />
                </td>
            );
        }
        return <td className="p-1">Invalid Todo List</td>;
    } else if (column.type === "todoListRestore") {
        if ((item as ITodoList).title) {
            return (
                <td className="p-1">
                    <TodoListRestoreButton todolist={item as ITodoList} />
                </td>
            );
        }
        return <td className="p-1">Invalid Todo List</td>;
    }
    // TODO BUTTONS
    else if (column.type === "todoEdit") {
        if ((item as ITodo).description) {
            return (
                <td className="p-1">
                    <TodoEditButton todo={item as ITodo} />
                </td>
            );
        }
        return <td className="p-1">Invalid Todo</td>;
    } else if (column.type === "todoDelete") {
        if ((item as ITodo).description) {
            return (
                <td className="p-1">
                    <TodoDeleteButton todo={item as ITodo} />
                </td>
            );
        }
        return <td className="p-1">Invalid Todo</td>;
    } else if (column.type === "todoSoftDelete") {
        if ((item as ITodo).description) {
            return (
                <td className="p-1">
                    <TodoSoftDeleteButton todo={item as ITodo} />
                </td>
            );
        }
        return <td className="p-1">Invalid Todo</td>;
    } else if (column.type === "todoRestore") {
        if ((item as ITodo).description) {
            return (
                <td className="p-1">
                    <TodoRestoreButton todo={item as ITodo} />
                </td>
            );
        }
        return <td className="p-1">Invalid Todo</td>;
    }
    else {
        return <td className="p-1">Unknown Type</td>;
    }
};
