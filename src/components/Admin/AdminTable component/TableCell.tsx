import { columType } from "@/types/admintable.types";
import UserEditButton from "../Tables buttons/UserEditButton";
import UserDeleteButton from "../Tables buttons/UserDeleteButton";

type MyPropsType<T> = {
    column: columType<T>,
    item: T,
    index: number,
}

export default function TableCell<T,>({ column, item, index }: MyPropsType<T>) {
    if (column.type === "text") {
        return (
            <td className="p-1 whitespace-nowrap">
                {column.getValue(item)}
            </td>
        );
    } else if (column.type === "id") {
        return (
            <td className="p-1">
                {index + 1}
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
        return (
            <td className="p-1">
                <UserEditButton clickFunction={column.onClick} item={item} />
            </td>
        );
    } else if (column.type === "userDelete") {
        return (
            <td className="p-1">
                <UserDeleteButton clickFunction={column.onClick} item={item} />
            </td>
        );
    } else {
        return <td className="p-1">Unknown Type</td>;
    }
};
