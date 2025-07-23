'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { UserRegister } from '@/types/userRegister.types';

const SignUpPage = () => {
    const router = useRouter();
    const [page, setPage] = useState<boolean>(true)
    const [user, setUser] = useState<UserRegister>({
        username: '',
        email: '',
        password: ''
    })
    const [otpCode, setOtpCode] = useState<number>()

    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false)
    const [buttonDisabledOtp, setButtonDisabledOtp] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    // const intervalRef = useRef<Htm>()
    const [resendTime, setResendTime] = useState<number>(30)
    const [otpActivityTime, setOtpActivityTime] = useState<number>(5 * 60)

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

    // send otp code
    const onSignup = async () => {
        if (buttonDisabled) {
            return;
        } else {
            try {
                setLoading(true)
                setResendTime(30)
                setOtpActivityTime(5 * 60)
                const responseOtp = await axios.post('/api/users/post/send-otp', {
                    email: user.email,
                    username: user.username,
                    password: user.password,
                });
                console.log(responseOtp);
                setPage(false)
                toast.success("Otp code send to your email!")
            } catch (error: any) {
                console.log('Signup failed: ', error);
                toast.error(error.response.data.message || error.response.data.error)
            } finally {
                setLoading(false)
            }
        }
    }

    // verify otp code and created user
    const onVerifyCode = async () => {
        if (buttonDisabledOtp) {
            return;
        } else {
            try {
                const responseOtp = await axios.post('/api/users/post/verify-otp', {
                    email: user.email,
                    username: user.username,
                    password: user.password,
                    otp: otpCode
                });
                console.log(responseOtp);
                toast.success(responseOtp.data.message)
                router.push('/login')
            } catch (error: any) {
                console.log('Otp failed: ', error);
                toast.error(error.response.data.message || error.response.data.error)
            }
        }
    }

    useEffect(() => {
        if (user.email.trim().length > 0 && user.password.trim().length > 0 && user.username.trim().length > 0) {
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }
    }, [user])

    useEffect(() => {
        if (String(otpCode).length == 6) {
            setButtonDisabledOtp(false)
        } else {
            setButtonDisabledOtp(true)
        }

    }, [otpCode])

    // resend otp code
    const resendOtpFunction = async () => {
        setResendTime(30)
        setOtpActivityTime(5 * 60)
        try {
            const responseOtp = await axios.post('/api/users/post/send-otp', {
                email: user.email,
                username: user.username,
                password: user.password,
            });
            console.log(responseOtp);
            toast.success(responseOtp.data.message)
        } catch (error: any) {
            console.log('Signup failed: ', error);
            toast.error(error.response.data.message || error.response.data.error)
        }
    }


    return (
        page ? (
            <div className='flex items-center justify-center h-[100vh]'>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                    <legend className="fieldset-legend">{loading ? 'Processing' : 'Sign Up'}</legend>

                    <label htmlFor='username' className="label">Username</label>
                    <input
                        required
                        id='username'
                        type="text"
                        value={user.username}
                        onChange={(e) => setUser({ ...user, username: e.target.value.trim() })}
                        className="input"
                        placeholder="Username" />

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

                    <button onClick={() => onSignup()} className={`btn btn-neutral mt-4 ${buttonDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                        {buttonDisabled ? 'No sign Up' : 'Sign Up'}
                    </button>
                    <Link href='/login' className='transition-all duration-250 ease-in hover:text-blue-400'>Visit login page</Link>
                </fieldset>
            </div>
        ) : (
            <div className='flex items-center flex-col justify-center h-[100vh]'>
                <h1 className='font-bold text-xl'>We just sent a code</h1>
                <p className='text-lg'>Enter the security code we sent to </p>
                <p className='text-lg'>
                    <span>{user.email.split('@')[0][0]}</span>
                    {
                        [...Array((user.email.split('@')[0].length - 2))].map((_, i) => (
                            <span key={i}>*</span>
                        ))
                    }
                    <span>{user.email.split('@')[0][
                        user.email.split('@')[0].length - 1
                    ]}@{user.email.split('@')[1]}</span>
                </p>
                <div className='flex items-center justify-center'>
                    <p className='text-xl font-semibold'>
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
                <button onClick={() => onVerifyCode()} className={`w-[200px] btn btn-neutral mt-1 ${buttonDisabledOtp ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                    Verify
                </button>
                <p>Didn't receive code?</p>
                <div className='flex items-center justify-center'>
                    <button onClick={() => resendOtpFunction()} className={`text-blue-500 
                        ${resendTime ? 'cursor-not-allowed' : 'cursor-pointer'}`}>Resend</button>
                    <p>- 00:
                        {
                            resendTime < 10 ? `0${resendTime}` : resendTime
                        }
                    </p>
                </div>
            </div>
        )
    )
}

export default SignUpPage