
export type UserRegister = {
    email: string;
    password: string;
    username: string;
};

export type UserRegisterContextType = {
    userInfo?: UserRegister | null;
    setUserInfo: (info: UserRegister | null) => void;
    isLoading?: boolean;
    setIsLoading?: (info: boolean) => void;
};
