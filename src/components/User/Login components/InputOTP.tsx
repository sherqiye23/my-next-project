import axios from 'axios';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

type Props = {
    email: string;
    otpActivityTime: number;
    resendTime: number;
    setPage: React.Dispatch<React.SetStateAction<string>>;
    setResendTime: React.Dispatch<React.SetStateAction<number>>;
    setOtpActivityTime: React.Dispatch<React.SetStateAction<number>>;
};

export default function InputOTP({ email, otpActivityTime, resendTime, setPage, setResendTime, setOtpActivityTime }: Props) {
    //formik yup
    interface OTPInfo {
        otpCode: number | null,
    }
    const initialValues: OTPInfo = {
        otpCode: null,
    };
    const validationSchema = Yup.object({
        otpCode: Yup.number().required('OTP is required'),
    });
    const onSubmit = async (values: OTPInfo) => {
        try {
            const responseOtp = await axios.post('/api/users/post/forgot-password-verify-otp', {
                email,
                otp: values.otpCode
            });
            toast.success(responseOtp.data.message)
            setPage('resetPassword')
        } catch (error: any) {
            console.log('Otp failed: ', error);
            toast.error(error.response.data.message || error.response.data.error)
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

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            <Form>
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
                    <div>
                        <Field
                            type="number"
                            id="otpCode"
                            name="otpCode"
                            className="input"
                            placeholder="Enter code" />
                        <ErrorMessage name="otpCode" component="div" className='text-red-600' />
                    </div>
                    <button type='submit' className={`btn btn-outline btn-info my-2 cursor-pointer hover:text-white`}>
                        Verify
                    </button>
                    <p className='text-center'>Didn't receive code?</p>
                    <div className='flex items-center justify-center'>
                        <button type='button' onClick={() => resendOtpFunction()} 
                        className={`text-blue-500 ${resendTime ? 'cursor-not-allowed' : 'cursor-pointer'}`}>Resend</button>
                        <p>- 00:
                            {
                                resendTime < 10 ? `0${resendTime}` : resendTime
                            }
                        </p>
                    </div>
                </fieldset>
            </Form>
        </Formik>
    )
}