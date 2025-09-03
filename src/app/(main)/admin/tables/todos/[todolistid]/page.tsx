'use client'
import { useEffect, useState } from 'react';
import dynamic from "next/dynamic";

const TodoListsTodosTableComponent = dynamic(
    () => import('@/components/Admin/Todo table/TodoListsTodosTableComponent'),
    { ssr: false }
);

interface Props {
    params: Promise<{ todolistid: string }>;
}

export default function UsersTodoListsTable({ params }: Props) {
    const [todolistid, setTodolistid] = useState<string | null>(null);

    useEffect(() => {
        Promise.resolve(params).then(p => setTodolistid(p.todolistid));
    }, [params]);

    if (!todolistid) return null;

    return <TodoListsTodosTableComponent todolistid={todolistid} />
}