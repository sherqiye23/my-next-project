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
    const { setUserInfo } = useMyContext()
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

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

    return (
        <div className='flex items-center justify-center h-[100vh]'>
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
                <p className='cursor-pointer hover:text-violet-400'>Forgot password?</p>
                <button onClick={() => onLogin()} className={`btn btn-neutral mt-2  ${buttonDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                    {buttonDisabled ? 'No login' : 'Login'}
                </button>
                <Link href='/signup' className='transition-all duration-250 ease-in hover:text-blue-400'>Visit signup page</Link>
            </fieldset>
        </div>
    )
}

export default LoginPage