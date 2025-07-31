'use client'
import React, { useState } from 'react'
import { UserRegisterFront } from '@/types/userRegister.types';
import SignupPage from '@/components/User/Signup components/SignupPage';
import SendOtpPage from '@/components/User/Signup components/SendOtpPage';

const SignUpPage = () => {
    const [page, setPage] = useState<boolean>(true)
    const [user, setUser] = useState<UserRegisterFront>({
        username: '',
        email: '',
        password: ''
    })
    const [resendTime, setResendTime] = useState<number>(30)
    const [otpActivityTime, setOtpActivityTime] = useState<number>(5 * 60)

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
                        setOtpActivityTime={setOtpActivityTime} />
                )
            }
        </div>
    )
}

export default SignUpPage