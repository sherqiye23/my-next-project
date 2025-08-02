export interface UserRegister extends UserRegisterFront {
    id: string;
};

export interface UserRegisterFront {
    email: string;
    password: string;
    username: string;
    profileImg: File | null
}

export type UserRegisterContextType = {
    userInfo?: UserRegister | null;
    setUserInfo: (info: UserRegister | null) => void;
    isLoading?: boolean;
    setIsLoading?: (info: boolean) => void;
};
