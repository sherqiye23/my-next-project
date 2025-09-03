import CustomFormik, { FormikObj } from '@/components/Form components';
import ModalComponent from '@/components/Modal component'
import { useUpdateTodoListMutation } from '@/lib/slices/todolistSlice';
import { useUpdateTodoMutation } from '@/lib/slices/todoSlice';
import { ITodoList } from '@/models/todolistModel';
import { ITodo } from '@/models/todoModel';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import * as Yup from 'yup';

type MyPropsType = {
    todo: ITodo
}
const TodoEditButton = ({ todo }: MyPropsType) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [updateTodo] = useUpdateTodoMutation()

    const validationSchema = Yup.object({
        //   const { todoId, description, reminderTime, customReminderTime, isCompleted } = reqBody
        description: Yup.string().trim().required('Description is required').max(50, "max 50 characters"),
        reminderTime: Yup.string().trim(),
        customReminderTime: Yup.date(),
        isCompleted: Yup.boolean().required(),
    });
    type TodoValues = Yup.InferType<typeof validationSchema>;
    const editTodoObj: FormikObj<TodoValues> = {
        initialValues: [
            { key: 'todoId', value: String(todo._id) },
            { key: 'description', value: todo.description },
            { key: 'reminderTime', value: todo.reminderTime ? todo.reminderTime.toString() : null },
            { key: 'customReminderTime', value: todo.customReminderTime },
            { key: 'isCompleted', value: todo.isCompleted },
        ],
        fields: [
            { placeholder: 'Enter description', type: 'text', name: 'description', title: 'Description' },
            { placeholder: 'Enter custom time', type: 'date', name: 'customReminderTime', title: 'Selected Time' },
            { placeholder: 'Enter isCompleted', type: 'checkbox', name: 'isCompleted', title: 'Is Completed' },
        ],
        validationSchema,
        onSubmit: async (values: Yup.InferType<typeof editTodoObj.validationSchema>) => {
            console.log(values);
            // setLoading(true)
            // await updateTodo({
            //     todoId: String(todo._id),
            //     description: values.description,
            //     reminderTime: values.reminderTime,
            //     customReminderTime: values.customReminderTime,
            //     isCompleted: Boolean(values.isCompleted)
            // })
            // toast.success(`Edit todo`)
            // const dialog = document.getElementById(`my_modal_edit_todo_${todo._id}`) as HTMLDialogElement | null;
            // dialog?.close();
            // setLoading(false);
        }
    }

    return (
        <>
            <button
                onClick={() => {
                    const dialog = document.getElementById(`my_modal_edit_todo_${todo._id}`) as HTMLDialogElement | null;
                    dialog?.showModal();
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors cursor-pointer"
            >
                Edit
            </button>
            <ModalComponent
                key={String(todo._id)}
                id={`my_modal_edit_todo_${todo._id}`}
                title='Todo Edit'>
                <CustomFormik
                    loading={loading}
                    setLoading={setLoading}
                    formName='Edit'
                    buttonText='Edit'
                    initialValues={editTodoObj.initialValues}
                    fields={editTodoObj.fields}
                    validationSchema={editTodoObj.validationSchema}
                    onSubmitFunction={editTodoObj.onSubmit} />
            </ModalComponent >
        </>
    )
}

export default TodoEditButton