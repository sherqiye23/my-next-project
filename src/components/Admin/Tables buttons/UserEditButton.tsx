import React from 'react'

type MyPropsType<T> = {
    clickFunction?: ((item: T) => void) | undefined;
    item: T
}
const UserEditButton = <T,>({ clickFunction, item }: MyPropsType<T>) => {
    return (
        <button
            onClick={() => clickFunction && clickFunction(item)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors cursor-pointer"
        >
            Edit
        </button>
    )
}

export default UserEditButton