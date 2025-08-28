'use client'
import AdminTableComponent from '@/components/Admin/AdminTable component'
import { Loader } from '@/components/Loader'
import { useGetAllUsersQuery } from '@/lib/slices/usersSlice'
import { cloudinaryUrl } from '@/lib/urls'
import { IUser } from '@/models/userModel'
import { columType } from '@/types/admintable.types'
import React, { useState } from 'react'

const UsersTableComponent = () => {
    const { data: usersData, isLoading } = useGetAllUsersQuery()
    const [changeTable, setChangeTable] = useState<string>('table')
    let tableProbs: {
        tableName: string;
        rows: string[];
        data: IUser[];
        columns: columType<IUser>[];
    } = {
        tableName: 'Users',
        rows: ['# / ', 'Profile / ', 'Banner / ', 'Username / ', 'Email / ', 'Role / ', 'Edit / ', 'Delete'],
        data: usersData || [],
        columns: [
            { type: "id", getValue: (user: IUser) => String(user._id) },
            { type: "image", getValue: (user: IUser) => cloudinaryUrl + user.profileImg },
            { type: "image", getValue: (user: IUser) => cloudinaryUrl + user.bannerImg },
            { type: "text", getValue: (user: IUser) => user.username },
            { type: "text", getValue: (user: IUser) => user.email },
            { type: "text", getValue: (user: IUser) => user.isAdmin ? 'Admin' : 'User' },
            { type: "userEdit", getValue: (user: IUser) => 'user', onClick: (user: IUser) => console.log(user) },
            { type: "userDelete", getValue: (user: IUser) => 'user', onClick: (user: IUser) => console.log(user) },
        ],
    }
    // todoListIds: string[],
    return (
        isLoading ? (<Loader />) : (
            <AdminTableComponent<IUser>
                tableName={tableProbs.tableName}
                setChangeTable={setChangeTable}
                changeTable={changeTable}
                rows={tableProbs.rows}
                data={tableProbs.data}
                columns={tableProbs.columns} />
        )
    )
}

export default UsersTableComponent