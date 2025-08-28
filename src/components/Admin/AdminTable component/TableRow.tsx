import { columType } from "@/types/admintable.types";
import TableCell from "./TableCell";

type MyPropsType<T> = {
    columns: columType<T>[],
    item: T,
    indexRow: number,
}

const TableRow = <T,>({ columns, item, indexRow }: MyPropsType<T>) => {
    return (
        <tr className={`border-b border-[#8f8f8f]`}>
            {columns.map((col, index) => (
                <TableCell
                    key={index}
                    index={indexRow}
                    column={col}
                    item={item}
                />
            ))}
        </tr>
    );
};

export default TableRow;
