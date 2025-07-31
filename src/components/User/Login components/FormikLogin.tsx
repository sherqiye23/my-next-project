import { useMyContext } from '@/context/UserEmailContext';
import axios from 'axios';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { LuEye, LuEyeClosed, LuLogIn, LuUserPlus } from "react-icons/lu";

type Props = {
    setPage: React.Dispatch<React.SetStateAction<string>>;
};

export default function FormikLogin({ setPage }: Props) {
    const router = useRouter();
    const { setUserInfo } = useMyContext()
    const [loading, setLoading] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState(false);

    //formik yup
    interface LoginInfo {
        email: string,
        password: string,
        rememberMe: boolean
    }
    const initialValues: LoginInfo = {
        email: '',
        password: '',
        rememberMe: false
    };
    const validationSchema = Yup.object({
        email: Yup.string().trim().email('Invalid email address').required('Email adress is required'),
        password: Yup.string().trim().required('Password is required'),
    });
    const onSubmit = async (values: LoginInfo) => {
        try {
            setLoading(true)
            const response = await axios.post('/api/users/post/login', values);
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
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            <Form>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                    <legend className="fieldset-legend">{loading ? 'Processing' : 'Login'}</legend>
                    <div className='bg-white my-2 mx-auto w-max flex items-center justify-center rounded-lg gap-2 cursor-pointer'>
                        <div className='flex items-center justify-center px-1 border rounded-lg gap-1'>
                            <span><LuLogIn /></span>
                            <span>Login</span>
                        </div>
                        <div className='px-1 rounded text-gray-500 cursor-pointer'>
                            <Link href='/signup' className='flex items-center justify-center gap-1'>
                                <span><LuUserPlus /></span>
                                <span>Signup</span>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <label htmlFor='email' className="label">Email</label>
                        <Field
                            type="email"
                            id="email"
                            name="email"
                            className="input"
                            placeholder="Email" />
                        <ErrorMessage name="email" component="div" className='text-red-600' />
                    </div>
                    <div className='my-2'>
                        <div className='flex items-center justify-between'>
                            <label htmlFor="password" className='label'>Password</label>
                            <p onClick={() => setPage('inputMail')} className='cursor-pointer hover:text-blue-500'>Forgot password?</p>
                        </div>
                        <div className="relative">
                            <Field
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                className="input pr-10"
                                placeholder="Password"
                            />
                            <div
                                className="text-base absolute z-10 right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <LuEye /> : <LuEyeClosed />}
                            </div>
                        </div>
                        <ErrorMessage name="password" component="div" className='text-red-600' />
                    </div>
                    <div className='flex items-center gap-2'>
                        <Field
                            type="checkbox"
                            id="rememberMe"
                            name="rememberMe"
                            className="cursor-pointer checkbox checkbox-xs checkbox-info" />
                        <label htmlFor="rememberMe" className='cursor-pointer text-sm'>Remember me</label>
                    </div>
                    <button className={`btn btn-outline btn-info my-2 cursor-pointer hover:text-white`}>
                        Login
                    </button>
                    <div className='flex items-center gap-1 text-sm'>
                        <span className='h-[.5px] w-full bg-gray-400'></span>
                        <span>or</span>
                        <span className='h-[.5px] w-full bg-gray-400'></span>
                    </div>
                    <button className="btn bg-white text-black border-[#e5e5e5] my-2">
                        <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                        Login with Google
                    </button>
                    <div className='flex items-center justify-center gap-1 text-sm'>
                        <span>Don't have an account yet?</span>
                        <Link href='/signup' className='font-semibold transition-all duration-250 ease-in hover:text-blue-400'>Sign up</Link>
                    </div>
                </fieldset>
            </Form>
        </Formik>
    )
}