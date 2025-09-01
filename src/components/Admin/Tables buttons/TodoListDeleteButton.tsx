import ModalComponent from '@/components/Modal component'
import React from 'react'
import toast from 'react-hot-toast'
import ModalDeleteAlert from '../Modal delete alert'
import { RequestFunction } from '@/components/Request function/RequestFunction'
import { ITodoList } from '@/models/todolistModel'
import { useDeleteTodoListMutation } from '@/lib/slices/todolistSlice'

type MyPropsType = {
    todolist: ITodoList
}
const TodoListDeleteButton = ({ todolist }: MyPropsType) => {
    const [deleteTodoList] = useDeleteTodoListMutation()
    const deleteTodoListFunction = async () => {
        await RequestFunction({
            myFunction: async () => {
                await deleteTodoList(todolist._id)
                toast.success(`Delete todolist`)
                const dialog = document.getElementById(`my_modal_delete_todolist_${todolist._id}`) as HTMLDialogElement | null;
                dialog?.close();
            },
        });
    }
    return (
        <>
            <button
                onClick={() => {
                    const dialog = document.getElementById(`my_modal_delete_todolist_${todolist._id}`) as HTMLDialogElement | null;
                    dialog?.showModal();
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors cursor-pointer"
            >
                Delete
            </button>
            <ModalComponent
                key={String(todolist._id)}
                id={`my_modal_delete_todolist_${todolist._id}`}
                title='Todolist Delete'>
                <ModalDeleteAlert
                    deletedName={todolist.title}
                    deleteFunction={deleteTodoListFunction} />
            </ModalComponent>
        </>
    )
}

export default TodoListDeleteButton