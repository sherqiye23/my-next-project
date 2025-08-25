'use client';
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
                    <div className="flex min-h-[89vh] mx-auto my-0 max-w-[1350px]">
                        <div className='absolute top-[50%] left-[50%]'>
                            <span className="loading loading-spinner text-warning"></span>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h1>Salam {data?.username} </h1>
                    </div >
                )
            }
        </>
    );
}