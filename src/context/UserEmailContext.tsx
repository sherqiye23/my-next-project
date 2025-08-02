'use client';
import { UserRegister, UserRegisterContextType } from "@/types/userRegister.types";
import axios, { AxiosError } from "axios";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export const RegisterContext = createContext<UserRegisterContextType | null>(null)

interface Props {
    children: ReactNode;
}

const UserEmailContext = ({ children }: Props) => {
    const [userInfo, setUserInfo] = useState<UserRegister | null>()
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('/api/users/get/user', { withCredentials: true });
                setUserInfo(res.data);
            } catch (error: unknown) {
                const axiosError = error as AxiosError;
                if (axiosError.response?.status === 401) {
                    try {
                        const response = await axios.post('/api/users/post/refresh-token', {}, { withCredentials: true });
                        const res2 = await axios.get('/api/users/get/user', { withCredentials: true });
                        setUserInfo(res2.data);
                    } catch (refreshError) {
                        setUserInfo(null);
                    }
                } else {
                    setUserInfo(null);
                }
            } finally {
                setIsLoading(false)
            }
        };

        fetchUser();
    }, []);

    return (
        <RegisterContext.Provider value={{ userInfo, setUserInfo, isLoading, setIsLoading }}>
            {children}
        </RegisterContext.Provider>
    )
}

export default UserEmailContext

export function useMyContext() {
    const context = useContext(RegisterContext);
    if (!context) {
        throw new Error("useMyContext must be used within a UserEmailContext provider");
    }
    return context;
}
