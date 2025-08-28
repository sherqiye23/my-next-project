'use client'
import dynamic from "next/dynamic";

const UsersTableComponent = dynamic(
  () => import('@/components/Admin/Users table'),
  { ssr: false }
);

export default function UsersTable() {
  return <UsersTableComponent />
}