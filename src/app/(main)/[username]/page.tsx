import { notFound } from "next/navigation";
import React from "react";

interface Props {
    params: {
        username: string;
    };
}

export default function UserProfilePag({ params }: Props) {
    let user;
    if (!user) {
        notFound();
    }

    return (
        <div>
            <h1>Salam {params.username}</h1>
        </div>
    );
}