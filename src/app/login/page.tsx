'use client'
import React, { useState } from 'react'
import FormikLogin from '@/components/User/Login components/FormikLogin';
import InputMail from '@/components/User/Login components/InputMail';
import ResetPassword from '@/components/User/Login components/ResetPassword';
import SendOtpPage from '@/components/User/SendOtp Page';
import axios from 'axios';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [page, setPage] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [resendTime, setResendTime] = useState<number>(30)
    const [otpActivityTime, setOtpActivityTime] = useState<number>(5 * 60)
    const [loading, setLoading] = useState<boolean>(false)

    interface OTPInfo {
        otpCode: number | null,
    }

    const onSubmit = async (values: OTPInfo) => {
        try {
            setLoading(true)
            const responseOtp = await axios.post('/api/users/post/forgot-password-verify-otp', {
                email,
                otp: values.otpCode
            });
            toast.success(responseOtp.data.message)
            setPage('resetPassword')
        } catch (error: any) {
            console.log('Otp failed: ', error);
            toast.error(error.response.data.message || error.response.data.error)
        } finally {
            setLoading(false)
        }
    };

    const resendOtpFunction = async () => {
        setResendTime(30)
        setOtpActivityTime(5 * 60)
        try {
            const responseOtp = await axios.post('/api/users/post/forgot-password-send-otp', { email });
            console.log(responseOtp);
            toast.success(responseOtp.data.message)
        } catch (error: any) {
            console.log('Resend failed: ', error);
            toast.error(error.response.data.message || error.response.data.error)
        }
    }

    return (
        <div className='flex items-center justify-center h-[100vh]'>
            {
                page === 'inputMail' ? (
                    <InputMail
                        setPage={setPage}
                        setResendTime={setResendTime}
                        setOtpActivityTime={setOtpActivityTime}
                        setEmail={setEmail} />
                ) :
                    page === 'inputOtp' ? (
                        <SendOtpPage
                            email={email}
                            otpActivityTime={otpActivityTime}
                            resendTime={resendTime}
                            setResendTime={setResendTime}
                            setOtpActivityTime={setOtpActivityTime}
                            onSubmitFunction={onSubmit}
                            loading={loading}
                            resendOtpFunction={resendOtpFunction} />
                    ) :
                        page === 'resetPassword' ? (
                            <ResetPassword
                                email={email}
                                setPage={setPage} />
                        ) : (
                            <FormikLogin setPage={setPage} />
                        )
            }

        </div>
    )
}

export default LoginPage