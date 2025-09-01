'use client'
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const UsersTodoListsTableComponent = dynamic(
  () => import('@/components/Admin/TodoLists table/UsersTodoListsTableComponent'),
  { ssr: false } 
);

interface Props {
  params: Promise<{ username: string }>;
}

export default function UsersTodoListsTable({ params }: Props) {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    Promise.resolve(params).then(p => setUsername(p.username));
  }, [params]);

  if (!username) return null;

  return <UsersTodoListsTableComponent username={username} />;
}
