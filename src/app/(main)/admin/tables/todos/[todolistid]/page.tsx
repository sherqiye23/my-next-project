'use client'
import dynamic from "next/dynamic";

const TodoListsTodosTableComponent = dynamic(
    () => import('@/components/Admin/Todo table/TodoListsTodosTableComponent'),
    { ssr: false }
);

interface Props {
    params: Promise<{ todolistid: string }>;
}

export default async function UsersTodoListsTable({ params }: Props) {
    const { todolistid } = await params;

    if (!todolistid) {
        return;
    }

    return <TodoListsTodosTableComponent todolistid={todolistid} />
}