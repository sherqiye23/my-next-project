import UserProfileClient from "@/components/User/Other userpage components/UserProfileClient";
import React from "react";

interface Props {
    params: Promise<{ username: string }>;
}

export default async function UserProfilePag({ params }: Props) {
    const { username } = await params;

    if (!username) {
        return;
    }

    return <UserProfileClient username={username} />
}