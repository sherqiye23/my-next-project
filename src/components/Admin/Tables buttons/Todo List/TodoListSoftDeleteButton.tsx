import React from 'react'
import toast from 'react-hot-toast'
import { RequestFunction } from '@/components/Request function/RequestFunction'
import { ITodoList } from '@/models/todolistModel'
import { useSoftDeleteTodoListMutation } from '@/lib/slices/todolistSlice'

type MyPropsType = {
    todolist: ITodoList
}
const TodoListSoftDeleteButton = ({ todolist }: MyPropsType) => {
    const [softDeleteTodoList] = useSoftDeleteTodoListMutation()
    const softDeletedFunction = async () => {
        await RequestFunction({
            myFunction: async () => {
                await softDeleteTodoList(todolist._id)
                toast.success(`Soft Delete todolist`)
            },
        });
    }
    return (
        <>
            <button
                onClick={() => softDeletedFunction()}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors cursor-pointer"
            >
                Soft Delete
            </button>
        </>
    )
}

export default TodoListSoftDeleteButton