import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import * as Yup from 'yup';
import { RequestFunction } from "../Request function/RequestFunction";
import { useGetAllCategoryQuery } from "@/lib/slices/categorySlice";

export type FormikObj<T extends Yup.AnyObject> = {
    initialValues: { key: string, value: string | boolean | undefined }[],
    fields: { placeholder: string, type: string, name: string, title: string }[]
    validationSchema: Yup.ObjectSchema<T>,
    onSubmit: (values: Yup.InferType<Yup.ObjectSchema<T>>) => Promise<void>;
}

type initialType = {
    key: string;
    value: string | boolean | undefined;
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
    const { data: categories } = useGetAllCategoryQuery()
    return (
        <Formik
            initialValues={initialValues.reduce((acc, item) => ({
                ...acc,
                [item.key]: item.value
            }), {}) as Yup.InferType<Yup.ObjectSchema<T>>}
            validationSchema={validationSchema}
            onSubmit={async (values: Yup.InferType<Yup.ObjectSchema<T>>) => {
                await RequestFunction({
                    myFunction: async () => {
                        await onSubmitFunction(values);
                    },
                });
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
                                    {
                                        field.type == 'select' ? (
                                            <div className='mb-2 w-full'>
                                                <Field
                                                    as="select"
                                                    name="categoryId"
                                                    id="categoryId"
                                                    className="w-full select"
                                                >
                                                    {categories?.map(category => (
                                                        <option key={String(category._id)} value={String(category._id)}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </Field>
                                            </div>
                                        ) :
                                            field.type == 'checkbox' ? (
                                                <div className='flex items-center gap-2'>
                                                    <Field
                                                        type="checkbox"
                                                        id={field.name}
                                                        name={field.name}
                                                        className="cursor-pointer checkbox checkbox-xs checkbox-info" />
                                                    <label htmlFor={field.name} className='cursor-pointer text-sm'>
                                                        {field.title}
                                                    </label>
                                                </div>
                                            ) : (
                                                <div className='flex flex-col gap-1'>
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
                                            )
                                    }
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