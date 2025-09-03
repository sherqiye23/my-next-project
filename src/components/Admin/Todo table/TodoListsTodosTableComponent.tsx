'use client'
import AdminTableComponent from '@/components/Admin/AdminTable component'
import { Loader } from '@/components/Loader'
import { useGetAllRemindertimeQuery } from '@/lib/slices/remindertimeSlice'
import { useGetTodoListsTodosQuery } from '@/lib/slices/todoSlice'
import { ITodo } from '@/models/todoModel'
import { columType } from '@/types/admintable.types'
import React, { useState } from 'react'
import moment from 'moment'

type MyPropsType = {
    todolistid: string
}

const TodoListsTodosTableComponent = ({ todolistid }: MyPropsType) => {
    const { data: todoliststodosData, isLoading } = useGetTodoListsTodosQuery(todolistid)
    const { data: reminderTimeData } = useGetAllRemindertimeQuery()
    const [changeTable, setChangeTable] = useState<string>('table')
    let tableProbs: {
        tableName: string;
        rows: string[];
        data: ITodo[];
        columns: columType<ITodo>[];
    } = {
        tableName: 'Todo',
        rows: ['# / ', 'Description / ', 'Reminder time / ', 'Is CustomReminder / ', 'Is Completed / ', 'Edit / ', 'Soft Deleted / ', 'Delete'],
        data: todoliststodosData || [],
        columns: [
            { type: "id", getValue: (item: ITodo) => String(item._id) },
            { type: "text", getValue: (item: ITodo) => item.description },
            {
                type: "text",
                getValue: (item: ITodo) =>
                    item.isCustomReminderTime
                        ? String(moment.utc(item.customReminderTime).local().format('DD MMM YYYY HH:mm') ?? 'unknown')
                        : String(
                            reminderTimeData?.find(
                                (reminder) => String(reminder._id) === String(item.reminderTime)
                            )?.time ?? 'unknown'
                        )
            },
            { type: "text", getValue: (item: ITodo) => item.isCustomReminderTime ? 'Custom' : 'Not Custom' },
            { type: "text", getValue: (item: ITodo) => item.isCompleted ? 'Completed' : 'Not Completed' },
            { type: "todoEdit", getValue: (item: ITodo) => 'item' },
            { type: "todoSoftDelete", getValue: (item: ITodo) => 'item' },
            { type: "todoDelete", getValue: (item: ITodo) => 'item' },
        ],
    }

    return (
        isLoading ? (<Loader />) : (
            <AdminTableComponent<ITodo>
                tableName={tableProbs.tableName}
                setChangeTable={setChangeTable}
                changeTable={changeTable}
                rows={tableProbs.rows}
                data={tableProbs.data}
                columns={tableProbs.columns} />
        )
    )
}

export default TodoListsTodosTableComponent