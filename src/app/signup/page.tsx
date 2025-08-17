'use client'
import React, { useState } from 'react'
import { UserRegisterFront } from '@/types/userRegister.types';
import SignupPage from '@/components/User/Signup components/SignupPage';
import SendOtpPage from '@/components/User/SendOtp Page';
import toast from 'react-hot-toast';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

interface ErrorResponseData {
    message?: string;
    error?: string;
}

interface OTPInfo {
    otpCode: number | null,
}

const SignUpPage = () => {
    const router = useRouter();
    const [page, setPage] = useState<boolean>(true)
    const [user, setUser] = useState<UserRegisterFront>({
        username: '',
        email: '',
        password: '',
        profileImg: null,
        bannerImg: null,
    })
    const [resendTime, setResendTime] = useState<number>(30)
    const [otpActivityTime, setOtpActivityTime] = useState<number>(5 * 60)
    const [loading, setLoading] = useState<boolean>(false)

    const onSubmit = async (values: OTPInfo) => {
        try {
            setLoading(true)
            const formData = new FormData()
            if (!user?.profileImg) {
                formData.append("profileImg", '');
            } else {
                formData.append("profileImg", user.profileImg);
            }
            if (!user?.bannerImg) {
                formData.append("bannerImg", '');
            } else {
                formData.append("bannerImg", user.bannerImg);
            }

            formData.append("otp", String(values.otpCode));
            formData.append("email", user.email);
            formData.append("username", user.username);
            formData.append("password", user.password);

            const responseOtp = await axios.post('/api/users/post/verify-otp', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            toast.success(responseOtp.data.message)
            router.push('/login')
        } catch (error) {
            const err = error as AxiosError;
            console.log('Otp failed: ', err);
            const data = err.response?.data as ErrorResponseData;
            const message = data?.message || data?.error || err.message;
            toast.error(message || 'Something went wrong');
        } finally {
            setLoading(false)
        }
    };

    const resendOtpFunction = async () => {
        setResendTime(30)
        setOtpActivityTime(5 * 60)
        try {
            setLoading(true)
            const responseOtp = await axios.post('/api/users/post/send-otp', {
                email: user.email,
                username: user.username,
                password: user.password,
            });
            toast.success(responseOtp.data.message)
        } catch (error) {
            const err = error as AxiosError;
            console.log('Resend failed: ', err);
            const data = err.response?.data as ErrorResponseData;
            const message = data?.message || data?.error || err.message;
            toast.error(message || 'Something went wrong');
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex items-center justify-center h-[100vh]'>
            {
                page ? (
                    <SignupPage
                        setUser={setUser}
                        setPage={setPage}
                        setResendTime={setResendTime}
                        setOtpActivityTime={setOtpActivityTime} />
                ) : (
                    <SendOtpPage
                        user={user}
                        resendTime={resendTime}
                        otpActivityTime={otpActivityTime}
                        setResendTime={setResendTime}
                        setOtpActivityTime={setOtpActivityTime}
                        onSubmitFunction={onSubmit}
                        loading={loading}
                        resendOtpFunction={resendOtpFunction} />
                )
            }
        </div>
    )
}

export default SignUpPage