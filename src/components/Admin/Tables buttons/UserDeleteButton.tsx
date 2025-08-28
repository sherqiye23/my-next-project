import React from 'react'

type MyPropsType<T> = {
    clickFunction?: ((item: T) => void) | undefined;
    item: T
}
const UserDeleteButton = <T,>({ clickFunction, item }: MyPropsType<T>) => {
    return (
        <button
            onClick={() => clickFunction && clickFunction(item)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors cursor-pointer"
        >
            Delete
        </button>
    )
}

export default UserDeleteButton