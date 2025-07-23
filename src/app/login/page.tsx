'use client'
import { useMyContext } from '@/context/UserEmailContext';
import axios from 'axios';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const LoginPage = () => {
    const router = useRouter();
    const [user, setUser] = useState({
        email: '',
        password: '',
        rememberMe: false
    })
    const [page, setPage] = useState<string>('')
    const [email, setEmail] = useState<string>('')

    const { setUserInfo } = useMyContext()
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const [resendTime, setResendTime] = useState<number>(30)
    const [otpActivityTime, setOtpActivityTime] = useState<number>(5 * 60)

    const [otpCode, setOtpCode] = useState<number>()
    const [buttonDisabledOtp, setButtonDisabledOtp] = useState<boolean>(false)

    const [resetPassword, setResetPassword] = useState({
        newPassword: '',
        confirmPassword: '',
    })

    const onLogin = async () => {
        if (buttonDisabled) {
            return;
        } else {
            try {
                setLoading(true)
                const response = await axios.post('/api/users/post/login', user);
                if (response.data) {
                    const responseUser = await axios.get('/api/users/get/user', { withCredentials: true });
                    setUserInfo(responseUser.data)
                    toast.success('Success login!')
                    router.push('/')
                } else {
                    toast.error(response.data.error.message)
                }
            } catch (error: any) {
                console.log('Login failed: ', error);
                toast.error(error.response.data.message || error.response.data.error)
            } finally {
                setLoading(false)
            }
        }
    }

    useEffect(() => {
        if (user.email.trim().length > 0 && user.password.trim().length > 0) {
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }
    }, [user])

    // inputMail
    const sendOtpCode = async () => {
        try {
            const response = await axios.post('/api/users/post/forgot-password-send-otp', { email })
            toast.success(response.data.message)
            setPage('inputOtp')
            setResendTime(30)
            setOtpActivityTime(5 * 60)
        } catch (error: any) {
            console.log('Send Otp Failed: ', error);
            toast.error(error.response.data.message || error.response.data.error)
        }
    }

    // inputOtp 
    const onVerifyCode = async () => {
        if (buttonDisabledOtp) {
            return;
        } else {
            try {
                const responseOtp = await axios.post('/api/users/post/forgot-password-verify-otp', {
                    email,
                    otp: otpCode
                });
                toast.success(responseOtp.data.message)
                setPage('resetPassword')
            } catch (error: any) {
                console.log('Otp failed: ', error);
                toast.error(error.response.data.message || error.response.data.error)
            }
        }
    }

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
    useEffect(() => {
        if (String(otpCode).length == 6) {
            setButtonDisabledOtp(false)
        } else {
            setButtonDisabledOtp(true)
        }

    }, [otpCode])

    useEffect(() => {
        if (resendTime <= 0) return;

        const timer = setTimeout(() => {
            setResendTime((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [resendTime]);

    useEffect(() => {
        if (otpActivityTime <= 0) return;

        const timer = setTimeout(() => {
            setOtpActivityTime((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [otpActivityTime]);

    // resetPassword
    const onResetPassword = async () => {
        try {
            const response = await axios.post('/api/users/post/reset-password', {
                email,
                newPassword: resetPassword.newPassword,
                confirmPassword: resetPassword.confirmPassword,
            })
            toast.success(response.data.message)
            setPage('')
        } catch (error: any) {
            console.log('Reset password failed: ', error);
            toast.error(error.response.data.message || error.response.data.error)
        }
    }

    return (
        <div className='flex items-center justify-center h-[100vh]'>
            {
                page === 'inputMail' ? (
                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                        <legend className="fieldset-legend">E-mail</legend>
                        <label htmlFor='email' className="label">Email</label>
                        <input
                            required
                            id='email'
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                            placeholder="Email" />

                        <button onClick={() => sendOtpCode()} className={`btn btn-neutral mt-2  ${email.length ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                            Send OTP
                        </button>
                    </fieldset>
                ) :
                    page === 'inputOtp' ? (
                        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                            <legend className="fieldset-legend">OTP code</legend>
                            <h1 className='font-bold text-lg text-center'>We just sent a code</h1>
                            <p className='text-center'>Enter the security code we sent to </p>
                            <p className='text-center'>
                                <span>{email.split('@')[0][0]}</span>
                                {
                                    [...Array((email.split('@')[0].length - 2))].map((_, i) => (
                                        <span key={i}>*</span>
                                    ))
                                }
                                <span>{email.split('@')[0][
                                    email.split('@')[0].length - 1
                                ]}@{email.split('@')[1]}</span>
                            </p>
                            <div className='flex items-center justify-center'>
                                <p className='text-lg font-semibold'>
                                    0{Math.floor(otpActivityTime / 60)}
                                    :
                                    {(otpActivityTime % 60) < 10 ? `0${otpActivityTime % 60}` : otpActivityTime % 60}
                                </p>
                            </div>
                            <input
                                required
                                id='otpcode'
                                value={otpCode}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setOtpCode(val === "" ? undefined : Number(val));
                                }}
                                type="number"
                                placeholder="Enter code"
                                className="input" />
                            <button onClick={() => onVerifyCode()} className={`btn btn-neutral mt-1 ${buttonDisabledOtp ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                Verify
                            </button>
                            <p className='text-center'>Didn't receive code?</p>
                            <div className='flex items-center justify-center'>
                                <button onClick={() => resendOtpFunction()} className={`text-blue-500 
                                        ${resendTime ? 'cursor-not-allowed' : 'cursor-pointer'}`}>Resend</button>
                                <p>- 00:
                                    {
                                        resendTime < 10 ? `0${resendTime}` : resendTime
                                    }
                                </p>
                            </div>
                        </fieldset>
                    ) :
                        page === 'resetPassword' ? (
                            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                                <legend className="fieldset-legend">Reset Password</legend>

                                <label htmlFor='newpassword' className="label">New Password</label>
                                <input
                                    required
                                    id='newpassword'
                                    type="password"
                                    value={resetPassword.newPassword}
                                    onChange={(e) => setResetPassword({ ...resetPassword, newPassword: e.target.value })}
                                    className="input"
                                    placeholder="New Password" />

                                <label htmlFor='confirmpassword' className="label">Confirm Password</label>
                                <input
                                    required
                                    id='confirmpassword'
                                    type="password"
                                    value={resetPassword.confirmPassword}
                                    onChange={(e) => setResetPassword({ ...resetPassword, confirmPassword: e.target.value })}
                                    className="input"
                                    placeholder="Confirm Password" />

                                <button onClick={() => onResetPassword()} className={`btn btn-neutral mt-2 cursor-pointer`}>
                                    Reset Password
                                </button>
                            </fieldset>
                        ) : (
                            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                                <legend className="fieldset-legend">{loading ? 'Processing' : 'Login'}</legend>

                                <label htmlFor='email' className="label">Email</label>
                                <input
                                    required
                                    id='email'
                                    type="email"
                                    value={user.email}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    className="input"
                                    placeholder="Email" />

                                <label htmlFor='password' className="label">Password</label>
                                <input
                                    required
                                    id='password'
                                    type="password"
                                    value={user.password}
                                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                                    className="input"
                                    placeholder="Password" />

                                <div className='flex items-center mt-2'>
                                    <input onChange={(e) => setUser({ ...user, rememberMe: e.target.checked })} type="checkbox" name="rememberMe" id="rememberMe" className='cursor-pointer' />
                                    <label htmlFor="rememberMe" className='label cursor-pointer'>Remember me</label>
                                </div>
                                <p onClick={() => setPage('inputMail')} className='cursor-pointer hover:text-violet-400'>Forgot password?</p>
                                <button onClick={() => onLogin()} className={`btn btn-neutral mt-2  ${buttonDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                    {buttonDisabled ? 'No login' : 'Login'}
                                </button>
                                <Link href='/signup' className='transition-all duration-250 ease-in hover:text-blue-400'>Visit signup page</Link>
                            </fieldset>
                        )
            }

        </div>
    )
}

export default LoginPage