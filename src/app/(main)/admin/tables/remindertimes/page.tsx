'use client'
import dynamic from "next/dynamic";

const ReminderTimesTableComponent = dynamic(
    () => import('@/components/Admin/ReminderTimes table'),
    { ssr: false }
);

export default function UsersTable() {
    return <ReminderTimesTableComponent />
}