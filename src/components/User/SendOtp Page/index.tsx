import React, { useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { UserRegisterFront } from '@/types/userRegister.types';

interface OTPInfo {
    otpCode: number | null,
}
type Props = {
    otpActivityTime: number;
    resendTime: number;
    loading: boolean,
    setResendTime: React.Dispatch<React.SetStateAction<number>>;
    setOtpActivityTime: React.Dispatch<React.SetStateAction<number>>;
    onSubmitFunction: (values: OTPInfo) => Promise<void>;
    resendOtpFunction: () => Promise<void>;
};

type SendOtpPageProps =
    | (Props & { email: string; user?: never })
    | (Props & { user: UserRegisterFront; email?: never });

export default function SendOtpPage({ email, user, otpActivityTime, resendTime, setResendTime, setOtpActivityTime, loading, onSubmitFunction, resendOtpFunction }: SendOtpPageProps) {
    const finalEmail = email ?? user?.email ?? '';

    //formik yup
    const initialValues: OTPInfo = {
        otpCode: null,
    };
    const validationSchema = Yup.object({
        otpCode: Yup.number().required('OTP is required'),
    });

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
            onSubmit={onSubmitFunction}
        >
            <Form>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                    <legend className="fieldset-legend">{loading ? 'Processing' : 'OTP code'}</legend>
                    <h1 className='font-bold text-lg text-center'>We just sent a code</h1>
                    <p className='text-center'>Enter the security code we sent to </p>
                    <p className='text-center'>
                        <span>{finalEmail.split('@')[0][0]}</span>
                        {
                            [...Array((finalEmail.split('@')[0].length - 2))].map((_, i) => (
                                <span key={i}>*</span>
                            ))
                        }
                        <span>{finalEmail.split('@')[0][
                            finalEmail.split('@')[0].length - 1
                        ]}@{finalEmail.split('@')[1]}</span>
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
                    <button type='submit' disabled={loading} className={`btn btn-outline btn-info my-2 hover:text-white {loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                        Verify
                    </button>
                    <p className='text-center'>Didn't receive code?</p>
                    <div className='flex items-center justify-center'>
                        <button type='button' disabled={resendTime ? true : false} onClick={() => resendOtpFunction()}
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