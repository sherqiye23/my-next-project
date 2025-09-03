import { IUser } from '@/models/userModel'
import Link from 'next/link'
import React from 'react'

type MyPropsType = {
    user: IUser
}

const UserSeeTodoListsButton = ({ user }: MyPropsType) => {
    return (
        <>
            <Link href={`/admin/tables/todolists/${user.username}`}>
                <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1 rounded-md transition-colors cursor-pointer">
                    See TodoLists
                </button>
            </Link>
        </>
    )
}

export default UserSeeTodoListsButton