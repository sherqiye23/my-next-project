import CustomFormik, { FormikObj } from '@/components/Form components';
import ModalComponent from '@/components/Modal component'
import { useUpdateTodoListMutation } from '@/lib/slices/todolistSlice';
import { ITodoList } from '@/models/todolistModel';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import * as Yup from 'yup';

type MyPropsType = {
    todolist: ITodoList
}
const TodoListEditButton = ({ todolist }: MyPropsType) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [updateTodoList] = useUpdateTodoListMutation()

    const validationSchema = Yup.object({
        title: Yup.string().trim().required('Title is required').max(30, "max 30 characters"),
        categoryId: Yup.string().trim().required(),
        isPrivate: Yup.boolean().required(),
    });
    type TodoListValues = Yup.InferType<typeof validationSchema>;
    const editTodoListObj: FormikObj<TodoListValues> = {
        initialValues: [
            { key: 'todoListId', value: String(todolist._id) },
            { key: 'title', value: todolist.title },
            { key: 'categoryId', value: String(todolist.categoryId) },
            { key: 'isPrivate', value: todolist.isPrivate },
        ],
        fields: [
            { placeholder: 'Enter title', type: 'text', name: 'title', title: 'Title' },
            { placeholder: 'Enter categoryId', type: 'select', name: 'categoryId', title: 'Category' },
            { placeholder: 'Enter isPrivate', type: 'checkbox', name: 'isPrivate', title: 'Is Private' },
        ],
        validationSchema,
        onSubmit: async (values: Yup.InferType<typeof editTodoListObj.validationSchema>) => {
            setLoading(true)
            await updateTodoList({
                todoListId: String(todolist._id),
                title: values.title,
                categoryId: values.categoryId,
                isPrivate: Boolean(values.isPrivate)
            })
            toast.success(`Edit todolist`)
            const dialog = document.getElementById(`my_modal_edit_todolist_${todolist._id}`) as HTMLDialogElement | null;
            dialog?.close();
            setLoading(false);
        }
    }

    return (
        <>
            <button
                onClick={() => {
                    const dialog = document.getElementById(`my_modal_edit_todolist_${todolist._id}`) as HTMLDialogElement | null;
                    dialog?.showModal();
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors cursor-pointer"
            >
                Edit
            </button>
            <ModalComponent
                key={String(todolist._id)}
                id={`my_modal_edit_todolist_${todolist._id}`}
                title='TodoList Edit'>
                <CustomFormik
                    loading={loading}
                    setLoading={setLoading}
                    formName='Edit'
                    buttonText='Edit'
                    initialValues={editTodoListObj.initialValues}
                    fields={editTodoListObj.fields}
                    validationSchema={editTodoListObj.validationSchema}
                    onSubmitFunction={editTodoListObj.onSubmit} />
            </ModalComponent >
        </>
    )
}

export default TodoListEditButton