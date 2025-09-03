import React from 'react'
import toast from 'react-hot-toast'
import { RequestFunction } from '@/components/Request function/RequestFunction'
import { ITodoList } from '@/models/todolistModel'
import { useRestoreByIdTodoListMutation } from '@/lib/slices/todolistSlice'

type MyPropsType = {
    todolist: ITodoList
}
const TodoListRestoreButton = ({ todolist }: MyPropsType) => {
    const [restoreByIdTodoList] = useRestoreByIdTodoListMutation()
    const restoredFunction = async () => {
        await RequestFunction({
            myFunction: async () => {
                await restoreByIdTodoList(todolist._id)
                toast.success(`Restored todolist`)
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

export default TodoListRestoreButton