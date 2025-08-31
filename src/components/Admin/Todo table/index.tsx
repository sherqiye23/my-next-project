'use client'
import AdminTableComponent from '@/components/Admin/AdminTable component'
import { Loader } from '@/components/Loader'
import { useGetAllRemindertimeQuery } from '@/lib/slices/remindertimeSlice'
import { useGetAllTodoQuery, useGetAllTodoSoftDeletedQuery } from '@/lib/slices/todoSlice'
import { ITodo } from '@/models/todoModel'
import { columType } from '@/types/admintable.types'
import React, { useState } from 'react'

const TodoTableComponent = () => {
    const { data: todosData, isLoading } = useGetAllTodoQuery()
    const { data: todosSoftData } = useGetAllTodoSoftDeletedQuery()
    const { data: reminderTimesData } = useGetAllRemindertimeQuery()
    const [changeTable, setChangeTable] = useState<string>('table')
    let tableProbs: {
        tableName: string;
        rows: string[];
        softrows: string[];
        data: ITodo[];
        softdata: ITodo[];
        columns: columType<ITodo>[];
        softcolumns: columType<ITodo>[];
    } = {
        tableName: 'Todos',
        rows: ['# / ', 'Description / ', 'Reminder Time / ', 'Edit / ', 'Soft Delete / ', 'Delete'],
        softrows: ['# / ', 'Description / ', 'Reminder Time / ', 'Restore / ', 'Delete'],
        data: todosData || [],
        softdata: todosSoftData || [],
        columns: [
            { type: "id", getValue: (item: ITodo) => String(item._id) },
            { type: "text", getValue: (item: ITodo) => item.description },
            {
                type: "text", getValue: (item: ITodo) =>
                    item.isCustomReminderTime ? String(item.customReminderTime)
                        : item?.reminderTime ? reminderTimesData?.find((time) => String(time._id) == String(item.reminderTime))?.title || "unknown"
                            : 'unknown'
            },
            { type: "remindertimesEdit", getValue: (item: ITodo) => 'item', onClick: (item: ITodo) => console.log(item) },
            { type: "remindertimesSoftDelete", getValue: (item: ITodo) => 'item', onClick: (item: ITodo) => console.log(item) },
            { type: "remindertimesDelete", getValue: (item: ITodo) => 'item', onClick: (item: ITodo) => console.log(item) },
        ],
        softcolumns: [
            { type: "id", getValue: (item: ITodo) => String(item._id) },
            { type: "text", getValue: (item: ITodo) => item.description },
            {
                type: "text", getValue: (item: ITodo) =>
                    item.isCustomReminderTime ? String(item.customReminderTime)
                        : item?.reminderTime ? reminderTimesData?.find((time) => String(time._id) == String(item.reminderTime))?.title || "unknown"
                            : 'unknown'
            },
            { type: "remindertimesRestore", getValue: (item: ITodo) => 'item', onClick: (item: ITodo) => console.log(item) },
            { type: "remindertimesDelete", getValue: (item: ITodo) => 'item', onClick: (item: ITodo) => console.log(item) },
        ],
    }
    return (
        isLoading ? (<Loader />) : (
            changeTable == 'table' ? (
                <AdminTableComponent<ITodo>
                    tableName={tableProbs.tableName}
                    setChangeTable={setChangeTable}
                    changeTable={changeTable}
                    rows={tableProbs.rows}
                    data={tableProbs.data}
                    columns={tableProbs.columns} />
            ) : (
                <AdminTableComponent<ITodo>
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

export default TodoTableComponent