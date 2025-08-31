import ModalComponent from '@/components/Modal component'
import { useUpdateUserMutation } from '@/lib/slices/usersSlice';
import { cloudinaryUrl } from '@/lib/urls';
import { IUser } from '@/models/userModel'
import { ErrorResponseData } from '@/types/catchError.types';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { GoPencil } from 'react-icons/go';
import * as Yup from 'yup';

type MyPropsType = {
    user: IUser
}
const UserEditButton = ({ user }: MyPropsType) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [imageUrl, setImageUrl] = useState<string>(cloudinaryUrl + user.profileImg);
    const [bannerImageUrl, setBannerImageUrl] = useState<string>(cloudinaryUrl + user.bannerImg);
    const inputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const [updateUser] = useUpdateUserMutation()

    interface EditInfo {
        userId: string,
        username: string,
        profileImg: File | string,
        bannerImg: File | string,
        isAdmin: boolean,
    }
    const initialValues: EditInfo = {
        userId: String(user._id),
        username: user.username,
        profileImg: user.profileImg,
        bannerImg: user.bannerImg,
        isAdmin: user.isAdmin
    };
    const validationSchema = Yup.object({
        username: Yup.string().trim().required('Username is required').max(30, "max 30 characters"),
    });
    const onSubmit = async (values: EditInfo) => {
        try {
            setLoading(true)
            const formData = new FormData()
            formData.append("bannerImg", values.bannerImg);
            formData.append("profileImg", values.profileImg);
            formData.append("username", values.username);
            formData.append("userId", values.userId);
            formData.append("isAdmin", String(values.isAdmin));
            const response = await updateUser(formData).unwrap()
            toast.success(`Edit user`)
            const dialog = document.getElementById(`my_modal_edit_user_${user._id}`) as HTMLDialogElement | null;
            dialog?.close();
        } catch (error) {
            const err = error as FetchBaseQueryError;
            console.log("Change failed: ", err);

            if ("data" in err && err.data) {
                const serverData = err.data as ErrorResponseData;
                toast.error(serverData.message || serverData.error || "Something went wrong");
            } else {
                toast.error("Network or unexpected error");
            }
        } finally {
            setLoading(false)
        }
    };

    return (
        <>
            <button
                onClick={() => {
                    const dialog = document.getElementById(`my_modal_edit_user_${user._id}`) as HTMLDialogElement | null;
                    dialog?.showModal();
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors cursor-pointer"
            >
                Edit
            </button>
            <ModalComponent
                key={String(user._id)}
                id={`my_modal_edit_user_${user._id}`}
                title='User Edit'>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {({ setFieldValue }) => (
                        <Form>
                            <fieldset className="fieldset border-base-300 rounded-box border p-4 bg-[var(--component-bg)]">
                                <legend className="fieldset-legend">{loading ? 'Processing' : 'Edit'}</legend>

                                <div className="flex items-center justify-center gap-3">
                                    <div>
                                        <span>Profile:</span>
                                        <div
                                            className="w-[80px] h-[80px] rounded-full hover:opacity-60 flex items-center justify-center text-gray-600 text-xl text-center transition-all duration-200 ease-in cursor-pointer"
                                            style={{
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                backgroundImage: `url(${imageUrl ? imageUrl : cloudinaryUrl + 'v1753739717/vcw9wjll2wphh2btpkym.jpg'})`,
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
                                                        setImageUrl(URL.createObjectURL(selectedFile));
                                                        setFieldValue("profileImg", selectedFile);
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div onClick={() => {
                                            setImageUrl('')
                                            setFieldValue('profileImg', '')
                                        }}
                                            className={`px-2 py-1 rounded-4xl bg-red-500 text-white text-center mt-1 cursor-pointer`}>
                                            Delete Profile
                                        </div>
                                    </div>
                                    <div>
                                        <span>Banner:</span>
                                        <div
                                            className="w-[150px] h-[80px] rounded hover:opacity-60 flex items-center justify-center text-gray-600 text-xl text-center transition-all duration-200 ease-in cursor-pointer"
                                            style={{
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                backgroundImage: `url(${bannerImageUrl ? bannerImageUrl : cloudinaryUrl + 'v1755469597/default-banner_pkbtz3.jpg'})`,
                                            }}
                                            onClick={() => bannerInputRef.current?.click()}
                                        >
                                            {(<GoPencil className="cursor-pointer" />)}
                                            <input
                                                type="file"
                                                name="bannerImg"
                                                ref={bannerInputRef}
                                                accept="image/*"
                                                style={{ display: "none" }}
                                                onChange={(e) => {
                                                    const selectedFile = e.target.files?.[0];
                                                    if (selectedFile) {
                                                        setBannerImageUrl(URL.createObjectURL(selectedFile));
                                                        setFieldValue("bannerImg", selectedFile);
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div onClick={() => {
                                            setBannerImageUrl('')
                                            setFieldValue('bannerImg', '')
                                        }}
                                            className={`px-2 py-1 rounded-4xl bg-red-500 text-white text-center mt-1 cursor-pointer`}>
                                            Delete Banner
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-col gap-1 mb-2'>
                                    <label htmlFor='username' className="label">Username</label>
                                    <Field
                                        type="text"
                                        id="username"
                                        name="username"
                                        className="input w-full"
                                        placeholder="Username" />
                                    <ErrorMessage name="username" component="div" className='text-red-600' />
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Field
                                        type="checkbox"
                                        id="isAdmin"
                                        name="isAdmin"
                                        className="cursor-pointer checkbox checkbox-xs checkbox-info" />
                                    <label htmlFor="isAdmin" className='cursor-pointer text-sm'>Is Admin</label>
                                </div>

                                <button disabled={loading}
                                    className={`btn btn-outline btn-info my-2 hover:text-white ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                    Edit
                                </button>
                            </fieldset>
                        </Form>
                    )}
                </Formik>
            </ModalComponent>
        </>
    )
}

export default UserEditButton