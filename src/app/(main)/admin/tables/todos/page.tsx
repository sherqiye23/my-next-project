'use client'
import dynamic from "next/dynamic";

const TodoTableComponent = dynamic(
    () => import('@/components/Admin/Todo table'),
    { ssr: false }
);

export default function UsersTable() {
    return <TodoTableComponent />
}