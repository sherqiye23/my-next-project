import toast from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios, { AxiosError } from 'axios';
import Link from 'next/link'
import React, { useRef, useState } from 'react';
import { LuEye, LuEyeClosed, LuLogIn, LuUserPlus } from "react-icons/lu";
import { GoPencil } from "react-icons/go";
import { UserRegisterFront } from '@/types/userRegister.types';

type Props = {
    setPage: React.Dispatch<React.SetStateAction<boolean>>;
    setUser: React.Dispatch<React.SetStateAction<UserRegisterFront>>;
    setResendTime: React.Dispatch<React.SetStateAction<number>>;
    setOtpActivityTime: React.Dispatch<React.SetStateAction<number>>;
};

interface ErrorResponseData {
    message?: string;
    error?: string;
}

export default function SignupPage({ setUser, setPage, setResendTime, setOtpActivityTime }: Props) {
    const [loading, setLoading] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);

    //formik yup
    interface SignInfo {
        username: string,
        email: string,
        password: string,
        profileImg: File | null,
    }
    const initialValues: SignInfo = {
        username: '',
        email: '',
        password: '',
        profileImg: null,
    };
    const validationSchema = Yup.object({
        username: Yup.string().trim().required('Username is required'),
        email: Yup.string().trim().email('Invalid email address').required('Email adress is required'),
        password: Yup.string().required("Password is required")
            .trim()
            .matches(/^\S*$/)
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
                "Must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            )
            .min(8, "Password is too short - it must be at least 8 characters long"),
    });
    const onSubmit = async (values: SignInfo) => {
        setUser(values)
        try {
            setLoading(true)
            setResendTime(30)
            setOtpActivityTime(5 * 60)
            const responseOtp = await axios.post('/api/users/post/send-otp', {
                email: values.email,
                username: values.username,
                password: values.password,
            });
            console.log(responseOtp);
            setPage(false)
            toast.success("Otp code send to your email!")
        } catch (error) {
            const err = error as AxiosError;
            console.log('Signup failed: ', err);
            const data = err.response?.data as ErrorResponseData;
            const message = data?.message || data?.error || err.message;
            toast.error(message || 'Something went wrong');
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
            {({ setFieldValue }) => (
                <Form>
                    <fieldset className="fieldset border-base-300 rounded-box w-xs border p-4 bg-[var(--component-bg)]">
                        <legend className="fieldset-legend">{loading ? 'Processing' : 'Sign Up'}</legend>
                        <div className='bg-white p-[1px] my-2 mx-auto w-max flex items-center justify-center rounded-lg gap-2 cursor-pointer'>
                            <div className='px-1 rounded text-gray-500 cursor-pointer'>
                                <Link href='/login' className='flex items-center justify-center gap-1'>
                                    <span><LuLogIn /></span>
                                    <span>Login</span>
                                </Link>
                            </div>
                            <div className='flex items-center justify-center px-1 border rounded-lg gap-1 text-black'>
                                <span><LuUserPlus /></span>
                                <span>Signup</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-center">
                            <div
                                className="w-[50px] h-[50px] rounded-full hover:opacity-60 flex items-center justify-center text-gray-600 text-xl text-center transition-all duration-200 ease-in cursor-pointer"
                                style={{
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundImage: `url(${imageUrl ? imageUrl : 'https://res.cloudinary.com/dz92kapni/image/upload/v1753739717/vcw9wjll2wphh2btpkym.jpg'})`,
                                }}
                                onClick={() => inputRef.current?.click()}
                            >
                                {(<GoPencil className="cursor-pointer" />)}
                                <input
                                    type="file"
                                    name="profileImg"
                                    ref={inputRef}
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                        const selectedFile = e.target.files?.[0];
                                        if (selectedFile) {
                                            setFile(selectedFile);
                                            setImageUrl(URL.createObjectURL(selectedFile));
                                            setFieldValue("profileImg", selectedFile);
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor='username' className="label">Username</label>
                            <Field
                                type="text"
                                id="username"
                                name="username"
                                className="input"
                                placeholder="Username" />
                            <ErrorMessage name="username" component="div" className='text-red-600' />
                        </div>

                        <div className='my-2'>
                            <label htmlFor='email' className="label">Email</label>
                            <Field
                                type="email"
                                id="email"
                                name="email"
                                className="input"
                                placeholder="Email" />
                            <ErrorMessage name="email" component="div" className='text-red-600' />
                        </div>

                        <div>
                            <label htmlFor="password" className='label'>Password</label>
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

                        <button disabled={loading}
                            className={`btn btn-outline btn-info my-2 hover:text-white ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                            Sign Up
                        </button>
                        <div className='flex items-center gap-1 text-sm'>
                            <span className='h-[.5px] w-full bg-gray-400'></span>
                            <span>or</span>
                            <span className='h-[.5px] w-full bg-gray-400'></span>
                        </div>
                        <button type='button' className="btn bg-white text-black border-[#e5e5e5] my-2">
                            <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                            Signup with Google
                        </button>
                        <div className='flex items-center justify-center gap-1 text-sm'>
                            <span>Do you have an account?</span>
                            <Link href='/login' className='font-semibold transition-all duration-250 ease-in hover:text-blue-400'>Login</Link>
                        </div>
                    </fieldset>
                </Form>
            )}
        </Formik>
    )
}