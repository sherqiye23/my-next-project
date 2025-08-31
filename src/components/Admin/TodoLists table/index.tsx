'use client'
import AdminTableComponent from '@/components/Admin/AdminTable component'
import { Loader } from '@/components/Loader'
import { useGetAllCategoryQuery } from '@/lib/slices/categorySlice'
import { useGetAllTodoListQuery, useGetAllTodoListSoftDeletedQuery } from '@/lib/slices/todolistSlice'
import { useGetAllUsersQuery } from '@/lib/slices/usersSlice'
import { ITodoList } from '@/models/todolistModel'
import { columType } from '@/types/admintable.types'
import React, { useState } from 'react'

const TodoListsTableComponent = () => {
    const { data: todolistsData, isLoading } = useGetAllTodoListQuery()
    const { data: todolistsSoftData } = useGetAllTodoListSoftDeletedQuery()
    const { data: categoriesData } = useGetAllCategoryQuery()
    const { data: usersData } = useGetAllUsersQuery()
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
        rows: ['# / ', 'Title / ', 'Category / ', 'Created At / ', 'Is Private / ', 'Is Reported / ', 'Edit / ', 'Soft Delete / ', 'Delete'],
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
            { type: "todolistEdit", getValue: (item: ITodoList) => 'item', onClick: (item: ITodoList) => console.log(item) },
            { type: "todolistSoftDelete", getValue: (item: ITodoList) => 'item', onClick: (item: ITodoList) => console.log(item) },
            { type: "todolistDelete", getValue: (item: ITodoList) => 'item', onClick: (item: ITodoList) => console.log(item) },
        ],
        softcolumns: [
            { type: "id", getValue: (item: ITodoList) => String(item._id) },
            { type: "text", getValue: (item: ITodoList) => item.title },
            { type: "text", getValue: (item: ITodoList) => (categoriesData?.find((category) => String(category._id) == String(item.categoryId)))?.name || 'unknown' },
            { type: "text", getValue: (item: ITodoList) => (usersData?.find((user) => String(user._id) == String(item.createdById)))?.username || 'unknown' },
            { type: "text", getValue: (item: ITodoList) => item.isPrivate ? 'Private' : 'Not Private' },
            { type: "text", getValue: (item: ITodoList) => item.isReported ? 'Reported' : 'Not Reported' },
            { type: "todolistRestore", getValue: (item: ITodoList) => 'item', onClick: (item: ITodoList) => console.log(item) },
            { type: "todolistDelete", getValue: (item: ITodoList) => 'item', onClick: (item: ITodoList) => console.log(item) },
        ],
        // todosArray: Types.ObjectId[],
    }
    return (
        isLoading ? (<Loader />) : (
            changeTable == 'table' ? (
                <AdminTableComponent<ITodoList>
                    tableName={tableProbs.tableName}
                    setChangeTable={setChangeTable}
                    changeTable={changeTable}
                    rows={tableProbs.rows}
                    data={tableProbs.data}
                    columns={tableProbs.columns} />
            ) : (
                <AdminTableComponent<ITodoList>
                    tableName={tableProbs.tableName}
                    setChangeTable={setChangeTable}
                    changeTable={changeTable}
                    rows={tableProbs.softrows}
                    data={tableProbs.softdata}
                    columns={tableProbs.softcolumns} />
            )
        )
    )
}

export default TodoListsTableComponent