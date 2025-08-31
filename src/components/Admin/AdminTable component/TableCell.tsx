import { columType } from "@/types/admintable.types";
import UserEditButton from "../Tables buttons/UserEditButton";
import UserDeleteButton from "../Tables buttons/UserDeleteButton";
import { IUser } from "@/models/userModel";

type MyPropsType<T> = {
    column: columType<T>,
    item: T,
    index: number,
}

export default function TableCell<T,>({ column, item, index }: MyPropsType<T>) {
    if (column.type === "text") {
        return (
            <td className={`p-1 whitespace-nowrap`}>
                {column.getValue(item)}
            </td>
        );
    } else if (column.type === "id") {
        return (
            <td className="p-1">
                {index + 1}
            </td>
        );
    } else if (column.type === "color") {
        return (
            <td className={`p-1 whitespace-nowrap font-bold`}
                style={{
                    color: (item as { color?: string })?.color || ''
                }}>
                {column.getValue(item)}
            </td>
        );
    } else if (column.type === "image") {
        return (
            <td className="p-1">
                <img
                    src={column.getValue(item)}
                    alt="image"
                    width="70px"
                    height="70px"
                />
            </td>
        );
    } else if (column.type === "userEdit") {
        if ((item as IUser).username) {
            return (
                <td className="p-1">
                    <UserEditButton user={item as IUser} />
                </td>
            );
        }
        return <td className="p-1">Invalid User</td>;
    } else if (column.type === "userDelete") {
        if ((item as IUser).username) {
            return (
                <td className="p-1">
                    <UserDeleteButton user={item as IUser} />
                </td>
            );
        }
        return <td className="p-1">Invalid User</td>;
    } else {
        return <td className="p-1">Unknown Type</td>;
    }
};
