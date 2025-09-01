'use client'
import AdminTableComponent from '@/components/Admin/AdminTable component'
import { Loader } from '@/components/Loader'
import { useGetAllCategoryQuery } from '@/lib/slices/categorySlice'
import { useGetAllTodoListQuery, useGetUsersTodoListQuery } from '@/lib/slices/todolistSlice'
import { useGetAllUsersQuery } from '@/lib/slices/usersSlice'
import { ITodoList } from '@/models/todolistModel'
import { columType } from '@/types/admintable.types'
import React, { useState } from 'react'

type MyPropsType = {
    username: string
}

const UsersTodoListsTableComponent = ({ username }: MyPropsType) => {
    const { data: userstodolistsData, isLoading } = useGetUsersTodoListQuery(username)
    const { data: categoriesData } = useGetAllCategoryQuery()
    const { data: usersData } = useGetAllUsersQuery()
    const [changeTable, setChangeTable] = useState<string>('table')
    let tableProbs: {
        tableName: string;
        rows: string[];
        data: ITodoList[];
        columns: columType<ITodoList>[];
    } = {
        tableName: 'Todo List',
        rows: ['# / ', 'Title / ', 'Category / ', 'Created At / ', 'Is Private / ', 'Is Reported / ', 'Edit / ', 'Soft Deleted / ', 'Delete'],
        data: userstodolistsData || [],
        columns: [
            { type: "id", getValue: (item: ITodoList) => String(item._id) },
            { type: "text", getValue: (item: ITodoList) => item.title },
            { type: "text", getValue: (item: ITodoList) => (categoriesData?.find((category) => String(category._id) == String(item.categoryId)))?.name ?? 'unknown' },
            { type: "text", getValue: (item: ITodoList) => (usersData?.find((user) => String(user._id) == String(item.createdById)))?.username ?? 'unknown' },
            { type: "text", getValue: (item: ITodoList) => item.isPrivate ? 'Private' : 'Not Private' },
            { type: "text", getValue: (item: ITodoList) => item.isReported ? 'Reported' : 'Not Reported' },
            { type: "todoListEdit", getValue: (item: ITodoList) => 'item' },
            { type: "todoListSoftDelete", getValue: (item: ITodoList) => 'item' },
            { type: "todoListDelete", getValue: (item: ITodoList) => 'item' },
        ],
    }

    return (
        isLoading ? (<Loader />) : (
            <AdminTableComponent<ITodoList>
                tableName={tableProbs.tableName}
                setChangeTable={setChangeTable}
                changeTable={changeTable}
                rows={tableProbs.rows}
                data={tableProbs.data}
                columns={tableProbs.columns} />
        )
    )
}

export default UsersTodoListsTableComponent