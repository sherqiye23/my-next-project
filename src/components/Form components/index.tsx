import { ErrorResponseData } from "@/types/catchError.types";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import * as Yup from 'yup';

type initialType = {
    key: string;
    value: string | undefined;
}
type fieldsType = {
    placeholder: string;
    type: string;
    name: string;
    title: string;
}
type MyComponentProps<T extends Yup.AnyObject> = {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    formName: string;
    buttonText: string;
    initialValues: initialType[];
    fields: fieldsType[];
    validationSchema: Yup.ObjectSchema<T>;
    onSubmitFunction: (values: Yup.InferType<Yup.ObjectSchema<T>>) => Promise<void>;
}

export default function CustomFormik<T extends Yup.AnyObject>({ loading, setLoading, formName, buttonText, initialValues, fields, validationSchema, onSubmitFunction }: MyComponentProps<T>) {
    return (
        <Formik
            initialValues={initialValues.reduce((acc, item) => ({
                ...acc,
                [item.key]: item.value
            }), {}) as Yup.InferType<Yup.ObjectSchema<T>>}
            validationSchema={validationSchema}
            onSubmit={async (values: Yup.InferType<Yup.ObjectSchema<T>>) => {
                try {
                    await onSubmitFunction(values);
                } catch (error) {
                    const err = error as FetchBaseQueryError;
                    console.log("Failed: ", err);

                    if ("data" in err && err.data) {
                        const serverData = err.data as ErrorResponseData;
                        toast.error(serverData.message || serverData.error || "Something went wrong");
                    } else {
                        toast.error("Network or unexpected error");
                    }
                } finally {
                    setLoading(false)
                }
            }}
        >
            {({ setFieldValue }) => (
                <Form>
                    <fieldset className="w-full fieldset bg-base-200 border p-4 border-base-300 rounded-box">
                        <legend className="fieldset-legend">{loading ? 'Processing' : formName}</legend>
                        {fields.map((field, i) => {
                            const isPasswordField = field.type === "password";
                            const [show, setShow] = useState(false);

                            return (
                                <div className="my-2 flex flex-col gap-1 relative" key={i}>
                                    <label htmlFor={field.name} className="label">{field.title}</label>

                                    <div className="relative">
                                        <Field
                                            type={isPasswordField ? (show ? "text" : "password") : field.type}
                                            id={field.name}
                                            name={field.name}
                                            className="input w-full pr-10"
                                            placeholder={field.placeholder}
                                        />

                                        {isPasswordField && (
                                            <div
                                                className="text-base absolute z-10 right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                                onClick={() => setShow(!show)}
                                            >
                                                {show ? <LuEye /> : <LuEyeClosed />}
                                            </div>
                                        )}
                                    </div>

                                    <ErrorMessage name={field.name} component="div" className="text-red-600" />
                                </div>
                            );
                        })}


                        <button disabled={loading} type="submit"
                            className={`btn btn-outline btn-info my-2 hover:text-white ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                            {buttonText}
                        </button>
                    </fieldset>
                </Form>
            )
            }
        </Formik >
    )
}