'use client'
import dynamic from "next/dynamic";

const TodoListsTableComponent = dynamic(
    () => import('@/components/Admin/TodoLists table'),
    { ssr: false }
);

export default function UsersTable() {
    return <TodoListsTableComponent />
}