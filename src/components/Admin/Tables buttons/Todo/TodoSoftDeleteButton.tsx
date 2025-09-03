import React from 'react'
import toast from 'react-hot-toast'
import { RequestFunction } from '@/components/Request function/RequestFunction'
import { ITodo } from '@/models/todoModel'
import { useSoftDeleteTodoMutation } from '@/lib/slices/todoSlice'

type MyPropsType = {
    todo: ITodo
}
const TodoSoftDeleteButton = ({ todo }: MyPropsType) => {
    const [softDeleteTodo] = useSoftDeleteTodoMutation()
    const softDeletedFunction = async () => {
        await RequestFunction({
            myFunction: async () => {
                await softDeleteTodo(todo._id)
                toast.success(`Soft Delete todo`)
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

export default TodoSoftDeleteButton