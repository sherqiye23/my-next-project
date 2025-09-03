import React from 'react'
import toast from 'react-hot-toast'
import { RequestFunction } from '@/components/Request function/RequestFunction'
import { ITodo } from '@/models/todoModel'
import { useRestoreByIdTodoMutation } from '@/lib/slices/todoSlice'

type MyPropsType = {
    todo: ITodo
}
const TodoRestoreButton = ({ todo }: MyPropsType) => {
    const [restoreByIdTodo] = useRestoreByIdTodoMutation()
    const restoredFunction = async () => {
        await RequestFunction({
            myFunction: async () => {
                await restoreByIdTodo(todo._id)
                toast.success(`Restored todo`)
            },
        });
    }
    return (
        <>
            <button
                onClick={() => restoredFunction()}
                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md transition-colors cursor-pointer"
            >
                Restore
            </button>
        </>
    )
}

export default TodoRestoreButton