'use client'
import AdminTableComponent from '@/components/Admin/AdminTable component'
import CustomFormik, { FormikObj } from '@/components/Form components'
import { Loader } from '@/components/Loader'
import ModalComponent from '@/components/Modal component'
import { RequestFunction } from '@/components/Request function/RequestFunction'
import { useMyContext } from '@/context/UserEmailContext'
import { useGetAllCategoryQuery } from '@/lib/slices/categorySlice'
import { useGetAllTodoListQuery, useGetAllTodoListSoftDeletedQuery, usePostTodoListMutation, useRestoreAllTodoListMutation } from '@/lib/slices/todolistSlice'
import { useGetAllUsersQuery } from '@/lib/slices/usersSlice'
import { ITodoList } from '@/models/todolistModel'
import { columType } from '@/types/admintable.types'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import * as Yup from 'yup';

const TodoListsTableComponent = () => {
    const { userInfo } = useMyContext()
    const { data: todolistsData, isLoading } = useGetAllTodoListQuery()
    const { data: todolistsSoftData } = useGetAllTodoListSoftDeletedQuery()
    const { data: categoriesData } = useGetAllCategoryQuery()
    const { data: usersData } = useGetAllUsersQuery()
    const [restoreAllTodoList] = useRestoreAllTodoListMutation()
    const [postTodoList] = usePostTodoListMutation()
    const [loading, setLoading] = useState<boolean>(false)
    const [changeTable, setChangeTable] = useState<string>('table')
    let tableProbs: {
        tableName: string;
        rows: string[];
        softrows: string[];
        data: ITodoList[];
        softdata: ITodoList[];
        columns: columType<ITodoList>[];
        softcolumns: columType<ITodoList>[];
    } = {
        tableName: 'Todo List',
        rows: ['# / ', 'Title / ', 'Category / ', 'Created At / ', 'Is Private / ', 'Is Reported / ', 'See Todos / ', 'Edit / ', 'Soft Delete / ', 'Delete'],
        softrows: ['# / ', 'Title / ', 'Category / ', 'Created At / ', 'Is Private / ', 'Is Reported / ', 'Restore / ', 'Delete'],
        data: todolistsData || [],
        softdata: todolistsSoftData || [],
        columns: [
            { type: "id", getValue: (item: ITodoList) => String(item._id) },
            { type: "text", getValue: (item: ITodoList) => item.title },
            { type: "text", getValue: (item: ITodoList) => (categoriesData?.find((category) => String(category._id) == String(item.categoryId)))?.name || 'unknown' },
            { type: "text", getValue: (item: ITodoList) => (usersData?.find((user) => String(user._id) == String(item.createdById)))?.username || 'unknown' },
            { type: "text", getValue: (item: ITodoList) => item.isPrivate ? 'Private' : 'Not Private' },
            { type: "text", getValue: (item: ITodoList) => item.isReported ? 'Reported' : 'Not Reported' },
            { type: "todoListSeeTodos", getValue: (item: ITodoList) => 'item' },
            { type: "todoListEdit", getValue: (item: ITodoList) => 'item' },
            { type: "todoListSoftDelete", getValue: (item: ITodoList) => 'item' },
            { type: "todoListDelete", getValue: (item: ITodoList) => 'item' },
        ],
        softcolumns: [
            { type: "id", getValue: (item: ITodoList) => String(item._id) },
            { type: "text", getValue: (item: ITodoList) => item.title },
            { type: "text", getValue: (item: ITodoList) => (categoriesData?.find((category) => String(category._id) == String(item.categoryId)))?.name || 'unknown' },
            { type: "text", getValue: (item: ITodoList) => (usersData?.find((user) => String(user._id) == String(item.createdById)))?.username || 'unknown' },
            { type: "text", getValue: (item: ITodoList) => item.isPrivate ? 'Private' : 'Not Private' },
            { type: "text", getValue: (item: ITodoList) => item.isReported ? 'Reported' : 'Not Reported' },
            { type: "todoListRestore", getValue: (item: ITodoList) => 'item', onClick: (item: ITodoList) => console.log(item) },
            { type: "todoListDelete", getValue: (item: ITodoList) => 'item', onClick: (item: ITodoList) => console.log(item) },
        ],
    }

    const validationSchema = Yup.object({
        title: Yup.string().trim().required('Title is required').max(30, "max 30 characters"),
        categoryId: Yup.string().trim().required(),
        isPrivate: Yup.boolean().required(),
    });
    type TodoListValues = Yup.InferType<typeof validationSchema>;
    const newTodoListObj: FormikObj<TodoListValues> = {
        initialValues: [
            { key: 'title', value: '' },
            { key: 'categoryId', value: '' },
            { key: 'isPrivate', value: false },
        ],
        fields: [
            { placeholder: 'Enter title', type: 'text', name: 'title', title: 'Title' },
            { placeholder: 'Enter categoryId', type: 'select', name: 'categoryId', title: 'Category' },
            { placeholder: 'Enter isPrivate', type: 'checkbox', name: 'isPrivate', title: 'Is Private' },
        ],
        validationSchema,
        onSubmit: async (values: Yup.InferType<typeof newTodoListObj.validationSchema>) => {
            setLoading(true)
            await postTodoList({
                userId: userInfo?._id,
                title: values.title,
                categoryId: values.categoryId,
                isPrivate: Boolean(values.isPrivate)
            })
            values.title = ''
            values.categoryId = ''
            values.isPrivate = false
            toast.success(`Create todolist`)
            const dialog = document.getElementById(`my_modal_create_todolist`) as HTMLDialogElement | null;
            dialog?.close();
            setLoading(false);
        }
    }

    const createFunction = () => {
        const dialog = document.getElementById(`my_modal_create_todolist`) as HTMLDialogElement | null;
        dialog?.showModal();
    }
    const restoreAllFunction = async () => {
        await RequestFunction({
            myFunction: async () => {
                await restoreAllTodoList({})
                toast.success(`Restore All Todo List`)
            },
        });
    }

    return (
        isLoading ? (<Loader />) : (
            changeTable == 'table' ? (
                <>
                    <AdminTableComponent<ITodoList>
                        tableName={tableProbs.tableName}
                        setChangeTable={setChangeTable}
                        changeTable={changeTable}
                        rows={tableProbs.rows}
                        data={tableProbs.data}
                        columns={tableProbs.columns}
                        buttonFunction={createFunction} />
                    <ModalComponent
                        id="my_modal_create_todolist"
                        title="Create Todolist">
                        <CustomFormik
                            loading={loading}
                            setLoading={setLoading}
                            formName='TodoList'
                            buttonText='New TodoList'
                            initialValues={newTodoListObj.initialValues}
                            fields={newTodoListObj.fields}
                            validationSchema={newTodoListObj.validationSchema}
                            onSubmitFunction={newTodoListObj.onSubmit} />
                    </ModalComponent>
                </>
            ) : (
                <AdminTableComponent<ITodoList>
                    tableName={tableProbs.tableName}
                    setChangeTable={setChangeTable}
                    changeTable={changeTable}
                    rows={tableProbs.softrows}
                    data={tableProbs.softdata}
                    columns={tableProbs.softcolumns}
                    buttonFunction={restoreAllFunction} />
            )
        )
    )
}

export default TodoListsTableComponent