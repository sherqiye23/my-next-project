import React from 'react'

type MyPropsType = {
    deletedName: string,
    deleteFunction: () => void;
}
const ModalDeleteAlert = ({ deletedName, deleteFunction }: MyPropsType) => {
    return (
        <div>
            <h2 className="text-lg font-semibold mb-3">
                Are you sure you want to delete "{deletedName}"?
            </h2>
            <p className="text-sm mb-3">
                This action cannot be undone.
            </p>
            <button onClick={() => deleteFunction()}
                className='text-white bg-red-500 rounded-2xl p-2 w-[100px] cursor-pointer'>
                Delete
            </button>
        </div>
    )
}

export default ModalDeleteAlert