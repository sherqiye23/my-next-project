import ModalComponent from '@/components/Modal component'
import { useDeleteUserMutation } from '@/lib/slices/usersSlice'
import { IUser } from '@/models/userModel'
import { ErrorResponseData } from '@/types/catchError.types'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import React from 'react'
import toast from 'react-hot-toast'

type MyPropsType = {
    user: IUser
}
const UserDeleteButton = ({ user }: MyPropsType) => {
    const [deleteUser] = useDeleteUserMutation()
    const deleteUserFunction = async () => {
        try {
            const response = await deleteUser(user._id).unwrap()
            toast.success(`Delete user`)
            const dialog = document.getElementById(`my_modal_delete_user_${user._id}`) as HTMLDialogElement | null;
            dialog?.close();
        } catch (error) {
            const err = error as FetchBaseQueryError;
            console.log("Change failed: ", err);

            if ("data" in err && err.data) {
                const serverData = err.data as ErrorResponseData;
                toast.error(serverData.message || serverData.error || "Something went wrong");
            } else {
                toast.error("Network or unexpected error");
            }
        }
    }
    return (
        <>
            <button
                onClick={() => {
                    const dialog = document.getElementById(`my_modal_delete_user_${user._id}`) as HTMLDialogElement | null;
                    dialog?.showModal();
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors cursor-pointer"
            >
                Delete
            </button>
            <ModalComponent
                key={String(user._id)}
                id={`my_modal_delete_user_${user._id}`}
                title='User Delete'>
                <div>
                    <h2 className="text-lg font-semibold mb-3">
                        Are you sure you want to delete this user?
                    </h2>
                    <p className="text-sm mb-3">
                        This action cannot be undone.
                    </p>
                    <button onClick={() => deleteUserFunction()}
                        className='text-white bg-red-500 rounded-2xl p-2 w-[100px] cursor-pointer'>
                        Delete
                    </button>
                </div>
            </ModalComponent>
        </>
    )
}

export default UserDeleteButton