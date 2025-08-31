'use client'
import AdminTableComponent from '@/components/Admin/AdminTable component'
import { Loader } from '@/components/Loader'
import { useGetAllRemindertimeQuery, useGetAllRemindertimeSoftDeletedQuery } from '@/lib/slices/remindertimeSlice'
import { IReminderTime } from '@/models/reminderTimeModel'
import { columType } from '@/types/admintable.types'
import React, { useState } from 'react'

const ReminderTimesTableComponent = () => {
    const { data: reminderTimesData, isLoading } = useGetAllRemindertimeQuery()
    const { data: reminderTimesSoftData } = useGetAllRemindertimeSoftDeletedQuery()
    const [changeTable, setChangeTable] = useState<string>('table')
    let tableProbs: {
        tableName: string;
        rows: string[];
        softrows: string[];
        data: IReminderTime[];
        softdata: IReminderTime[];
        columns: columType<IReminderTime>[];
        softcolumns: columType<IReminderTime>[];
    } = {
        tableName: 'Reminder Times',
        rows: ['# / ', 'Title / ', 'Time / ', 'Edit / ', 'Soft Delete / ', 'Delete'],
        softrows: ['# / ', 'Title / ', 'Time / ', 'Restore / ', 'Delete'],
        data: reminderTimesData || [],
        softdata: reminderTimesSoftData || [],
        columns: [
            { type: "id", getValue: (item: IReminderTime) => String(item._id) },
            { type: "text", getValue: (item: IReminderTime) => item.title },
            { type: "text", getValue: (item: IReminderTime) => String(item.time) },
            { type: "remindertimesEdit", getValue: (item: IReminderTime) => 'item', onClick: (item: IReminderTime) => console.log(item) },
            { type: "remindertimesSoftDelete", getValue: (item: IReminderTime) => 'item', onClick: (item: IReminderTime) => console.log(item) },
            { type: "remindertimesDelete", getValue: (item: IReminderTime) => 'item', onClick: (item: IReminderTime) => console.log(item) },
        ],
        softcolumns: [
            { type: "id", getValue: (item: IReminderTime) => String(item._id) },
            { type: "text", getValue: (item: IReminderTime) => item.title },
            { type: "text", getValue: (item: IReminderTime) => String(item.time) },
            { type: "remindertimesRestore", getValue: (item: IReminderTime) => 'item', onClick: (item: IReminderTime) => console.log(item) },
            { type: "remindertimesDelete", getValue: (item: IReminderTime) => 'item', onClick: (item: IReminderTime) => console.log(item) },
        ],
    }
    return (
        isLoading ? (<Loader />) : (
            changeTable == 'table' ? (
                <AdminTableComponent<IReminderTime>
                    tableName={tableProbs.tableName}
                    setChangeTable={setChangeTable}
                    changeTable={changeTable}
                    rows={tableProbs.rows}
                    data={tableProbs.data}
                    columns={tableProbs.columns} />
            ) : (
                <AdminTableComponent<IReminderTime>
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

export default ReminderTimesTableComponent