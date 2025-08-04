import axios, { AxiosError } from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { LuEye, LuEyeClosed } from "react-icons/lu";

type Props = {
    email: string;
    setPage: React.Dispatch<React.SetStateAction<string>>;
};

interface ErrorResponseData {
    message?: string;
    error?: string;
}


export default function ResetPassword({ email, setPage }: Props) {
    const [loading, setLoading] = useState<boolean>(false)
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    //formik yup
    interface ResetInfo {
        newpassword: string,
        confirmpassword: string,
    }
    const initialValues: ResetInfo = {
        newpassword: '',
        confirmpassword: '',
    };
    const validationSchema = Yup.object({
        newpassword: Yup.string().required("Password is required")
            .trim()
            .matches(/^\S*$/)
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
                "Must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            )
            .min(8, "Password is too short - it must be at least 8 characters long"),
        confirmpassword: Yup.string().trim().required('Confirm password is required'),
    });
    const onSubmit = async (values: ResetInfo) => {
        if (values.newpassword !== values.confirmpassword) {
            return toast.error('New password and confirm password do not match')
        }
        try {
            setLoading(true)
            const response = await axios.post('/api/users/post/reset-password', {
                email,
                newPassword: values.newpassword,
                confirmPassword: values.confirmpassword,
            })
            toast.success(response.data.message)
            setPage('')
        } catch (error) {
            const err = error as AxiosError;
            console.log('Reset password failed: ', err);
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
            <Form>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                    <legend className="fieldset-legend">{loading ? 'Processing' : 'Reset Password'}</legend>
                    <div>
                        <label htmlFor='newpassword' className="label">New Password</label>
                        <div className='relative'>
                            <Field
                                type={showNewPassword ? "text" : "password"}
                                id="newpassword"
                                name="newpassword"
                                className="input"
                                placeholder="New Password" />
                            <div
                                className="text-base absolute z-10 right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <LuEye /> : <LuEyeClosed />}
                            </div>
                        </div>
                        <ErrorMessage name="newpassword" component="div" className='text-red-600' />
                    </div>

                    <div className='my-2'>
                        <label htmlFor='confirmpassword' className="label">Confirm Password</label>
                        <div className='relative'>
                            <Field
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmpassword"
                                name="confirmpassword"
                                className="input"
                                placeholder="Confirm Password" />
                            <div
                                className="text-base absolute z-10 right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <LuEye /> : <LuEyeClosed />}
                            </div>
                        </div>
                        <ErrorMessage name="confirmpassword" component="div" className='text-red-600' />
                    </div>

                    <button disabled={loading} className={`btn btn-outline btn-info my-2 hover:text-white ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                        Reset Password
                    </button>
                </fieldset>
            </Form>
        </Formik>
    )
}