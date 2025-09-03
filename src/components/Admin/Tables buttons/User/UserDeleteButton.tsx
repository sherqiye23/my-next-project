import ModalComponent from '@/components/Modal component'
import { useDeleteUserMutation } from '@/lib/slices/usersSlice'
import { IUser } from '@/models/userModel'
import React from 'react'
import toast from 'react-hot-toast'
import ModalDeleteAlert from '../../Modal delete alert'
import { RequestFunction } from '@/components/Request function/RequestFunction'

type MyPropsType = {
    user: IUser
}
const UserDeleteButton = ({ user }: MyPropsType) => {
    const [deleteUser] = useDeleteUserMutation()
    const deleteUserFunction = async () => {
        await RequestFunction({
            myFunction: async () => {
                await deleteUser(user._id)
                toast.success(`Delete user`)
                const dialog = document.getElementById(`my_modal_delete_user_${user._id}`) as HTMLDialogElement | null;
                dialog?.close();
            },
        });
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
                <ModalDeleteAlert
                    deletedName={user.username}
                    deleteFunction={deleteUserFunction} />
            </ModalComponent>
        </>
    )
}

export default UserDeleteButton