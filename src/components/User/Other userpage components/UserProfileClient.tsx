'use client';
import { Loader } from "@/components/Loader";
import { useGetByUsernameQuery } from "@/lib/slices/usersSlice";
import { notFound } from "next/navigation";
import React, { useEffect } from "react";

interface Props {
    username: string;
}

export default function UserProfileClient({ username }: Props) {
    const { data, isLoading } = useGetByUsernameQuery(username)

    useEffect(() => {
        if (!isLoading && !data) {
            notFound();
        }
    }, [isLoading, data])
    return (
        <>
            {
                isLoading ? (
                    <Loader />
                ) : (
                    <div>
                        <h1>Salam {data?.username} </h1>
                    </div >
                )
            }
        </>
    );
}