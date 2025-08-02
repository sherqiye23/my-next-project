import axios, { AxiosError } from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

type Props = {
    setPage: React.Dispatch<React.SetStateAction<string>>;
    setResendTime: React.Dispatch<React.SetStateAction<number>>;
    setOtpActivityTime: React.Dispatch<React.SetStateAction<number>>;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
};

export default function InputMail({ setPage, setResendTime, setOtpActivityTime, setEmail }: Props) {
    const [loading, setLoading] = useState<boolean>(false)
    //formik yup
    interface MailInfo {
        email: string,
    }
    const initialValues: MailInfo = {
        email: '',
    };
    const validationSchema = Yup.object({
        email: Yup.string().trim().email('Invalid email address').required('Email adress is required'),
    });
    const onSubmit = async (values: MailInfo) => {
        setEmail(values.email)
        try {
            setLoading(true)
            const response = await axios.post('/api/users/post/forgot-password-send-otp', { email: values.email })
            toast.success(response.data.message)
            setPage('inputOtp')
            setResendTime(30)
            setOtpActivityTime(5 * 60)
        } catch (error) {
            const err = error as AxiosError;
            console.log('Send Otp Failed: ', err);
            const message =
                err.response?.data && typeof err.response.data === 'object'
                    ? (err.response.data as any).message || (err.response.data as any).error
                    : err.message;

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
                    <legend className="fieldset-legend">{loading ? 'Processing' : 'E-mail'}</legend>
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

                    <button disabled={loading} className={`btn btn-outline btn-info my-2 hover:text-white ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                        Send OTP
                    </button>
                </fieldset>
            </Form>
        </Formik>
    )
}