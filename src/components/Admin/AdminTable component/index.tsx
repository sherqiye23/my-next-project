import { columType } from "@/types/admintable.types";
import TableRow from "./TableRow";
import { CiCirclePlus } from "react-icons/ci";
import { LuArchiveRestore } from "react-icons/lu";

type MyPropsType<T> = {
    tableName: string;
    rows: string[];
    columns: columType<T>[];
    changeTable: string;
    setChangeTable: React.Dispatch<React.SetStateAction<string>>;
    data: T[] | undefined,
    buttonFunction?: () => void;
}
export default function AdminTableComponent<T>({
    tableName,
    setChangeTable,
    changeTable,
    rows,
    data,
    columns,
    buttonFunction
}: MyPropsType<T>) {
    return (
        <div className="items-center flex flex-col rounded w-full overflow-auto">
            <div className="bg-orange-500 text-white py-2 px-3 w-full rounded text-2xl flex sm:items-center justify-between flex-col sm:flex-row">
                <div className="flex items-center gap-2 text-xl">
                    {
                        changeTable === 'table' && rows?.includes('Soft Delete / ') ? (
                            <span onClick={() => setChangeTable('soft-delete-table')}
                                className="text-lg whitespace-nowrap hover:bg-orange-700 rounded transition-all duration-250 ease-in cursor-pointer px-2">
                                Soft Deleted Table
                            </span>
                        ) : (
                            <span onClick={() => setChangeTable('table')}
                                className="text-lg whitespace-nowrap hover:bg-orange-700 rounded transition-all duration-250 ease-in cursor-pointer px-2">
                                {tableName} Table
                            </span>
                        )
                    }
                </div>
                {changeTable === "table" && buttonFunction ? (
                    <span
                        onClick={buttonFunction}
                        className="text-xl font-bold whitespace-nowrap hover:bg-orange-700 rounded-full transition-all duration-250 ease-in cursor-pointer p-1"
                    >
                        <CiCirclePlus />
                    </span>
                ) : changeTable === "soft-delete-table" ? (
                    <span
                        onClick={buttonFunction}
                        className="text-xl font-bold whitespace-nowrap hover:bg-orange-700 rounded-full transition-all duration-250 ease-in cursor-pointer p-1"
                    >
                        <LuArchiveRestore />
                    </span>
                ) : null}
            </div>
            <div className="pt-[10px] w-full px-4 rounded-4 bg-[var(--component-bg)] overflow-x-auto">
                <table className="w-full bg-[var(--component-bg)] min-w-max">
                    <thead className="border-b-2 border-[#8f8f8f] text-gray-500">
                        <tr>
                            {
                                rows.map((row, i) => (
                                    <td key={i} className="pb-1 mx-1 whitespace-nowrap">{row}</td>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data?.length ? (
                                data.map((item: T, index: number) => (
                                    <TableRow key={index} columns={columns} item={item} indexRow={index} />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={rows.length} className="text-center py-2">
                                        No {tableName}!
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div >
    )
}