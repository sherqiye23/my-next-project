'use client'
import React, { useState } from 'react'
import FormikLogin from '@/components/User/Login components/FormikLogin';
import InputMail from '@/components/User/Login components/InputMail';
import InputOTP from '@/components/User/Login components/InputOTP';
import ResetPassword from '@/components/User/Login components/ResetPassword';

const LoginPage = () => {
    const [page, setPage] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [resendTime, setResendTime] = useState<number>(30)
    const [otpActivityTime, setOtpActivityTime] = useState<number>(5 * 60)

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
                        <InputOTP email={email}
                            otpActivityTime={otpActivityTime}
                            resendTime={resendTime}
                            setPage={setPage}
                            setResendTime={setResendTime}
                            setOtpActivityTime={setOtpActivityTime} />
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