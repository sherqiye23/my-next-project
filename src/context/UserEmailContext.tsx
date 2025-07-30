'use client';
import { UserRegister, UserRegisterContextType } from "@/types/userRegister.types";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

export const RegisterContext = createContext<UserRegisterContextType | null>(null)

const UserEmailContext = ({ children }: any) => {
    const [userInfo, setUserInfo] = useState<UserRegister | null>()
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('/api/users/get/user', { withCredentials: true });
                setUserInfo(res.data);
            } catch (error: any) {
                if (error.response.status == 401) {
                    try {
                        const response = await axios.post('/api/users/post/refresh-token', {}, { withCredentials: true });
                        // console.log(response);
                        
                        const res2 = await axios.get('/api/users/get/user', { withCredentials: true });
                        setUserInfo(res2.data);
                    } catch (error: any) {
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
