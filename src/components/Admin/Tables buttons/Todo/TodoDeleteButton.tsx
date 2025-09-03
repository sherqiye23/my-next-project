import ModalComponent from '@/components/Modal component'
import React from 'react'
import toast from 'react-hot-toast'
import ModalDeleteAlert from '../../Modal delete alert'
import { RequestFunction } from '@/components/Request function/RequestFunction'
import { ITodo } from '@/models/todoModel'
import { useDeleteTodoMutation } from '@/lib/slices/todoSlice'

type MyPropsType = {
    todo: ITodo
}
const TodoDeleteButton = ({ todo }: MyPropsType) => {
    const [deleteTodo] = useDeleteTodoMutation()
    const deleteTodoFunction = async () => {
        await RequestFunction({
            myFunction: async () => {
                await deleteTodo(todo._id)
                toast.success(`Delete todo`)
                const dialog = document.getElementById(`my_modal_delete_todo_${todo._id}`) as HTMLDialogElement | null;
                dialog?.close();
            },
        });
    }
    return (
        <>
            <button
                onClick={() => {
                    const dialog = document.getElementById(`my_modal_delete_todo_${todo._id}`) as HTMLDialogElement | null;
                    dialog?.showModal();
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors cursor-pointer"
            >
                Delete
            </button>
            <ModalComponent
                key={String(todo._id)}
                id={`my_modal_delete_todo_${todo._id}`}
                title='Todo Delete'>
                <ModalDeleteAlert
                    deletedName={todo.description}
                    deleteFunction={deleteTodoFunction} />
            </ModalComponent>
        </>
    )
}

export default TodoDeleteButton