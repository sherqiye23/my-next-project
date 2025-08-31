'use client'
import dynamic from "next/dynamic";

const CategoriesTableComponent = dynamic(
    () => import('@/components/Admin/Categories table'),
    { ssr: false }
);

export default function UsersTable() {
    return <CategoriesTableComponent />
}