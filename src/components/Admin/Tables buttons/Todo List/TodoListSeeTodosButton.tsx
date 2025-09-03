import { ITodoList } from '@/models/todolistModel'
import Link from 'next/link'
import React from 'react'

type MyPropsType = {
    todolist: ITodoList
}

const TodoListSeeTodosButton = ({ todolist }: MyPropsType) => {
    return (
        <>
            <Link href={`/admin/tables/todos/${todolist._id}`}>
                <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1 rounded-md transition-colors cursor-pointer">
                    See Todos
                </button>
            </Link>
        </>
    )
}

export default TodoListSeeTodosButton