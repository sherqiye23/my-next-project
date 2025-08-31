import ModalComponent from '@/components/Modal component';
import { useUpdateBannerUserMutation, useUpdateProfileUserMutation } from '@/lib/slices/usersSlice';
import { cloudinaryUrl } from '@/lib/urls';
import { ErrorResponseData } from '@/types/catchError.types';
import { UserRegister } from '@/types/userRegister.types';
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Form, Formik } from 'formik';
import React, { useEffect, useRef } from 'react'
import toast from 'react-hot-toast';
import { GoPencil } from 'react-icons/go';

interface ImageInfo {
    imageUrl: File | null,
}
type MyComponentProps = {
    modalId: string;
    changeImageName: string;
    userInfo?: UserRegister | null;
    setUserInfo: (info: UserRegister | null) => void;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    changeImageUrl: string;
    setChangeImageUrl: React.Dispatch<React.SetStateAction<string>>;
}
export const BannerAndProfileChangeModal = ({ modalId, changeImageName, userInfo, setUserInfo, loading, setLoading, changeImageUrl, setChangeImageUrl }: MyComponentProps) => {

    const [updateBannerUser] = useUpdateBannerUserMutation();
    const [updateProfileUser] = useUpdateProfileUserMutation();
    const imageInputRef = useRef<HTMLInputElement>(null);

    const initialValues: ImageInfo = {
        imageUrl: null,
    };
    const onSubmit = async (values: ImageInfo) => {
        try {
            setLoading(true)
            const formData = new FormData()
            if (changeImageName.toLocaleLowerCase() == 'banner') {
                if (values.imageUrl) {
                    formData.append("bannerImg", values.imageUrl);
                }
                if (userInfo?._id) {
                    formData.append("userId", userInfo?._id);
                }
                const response = await updateBannerUser(formData).unwrap()
                setUserInfo({
                    ...userInfo!,
                    bannerImg: response.bannerImg
                });
            } else if (changeImageName.toLocaleLowerCase() == 'profile') {
                if (values.imageUrl) {
                    formData.append("profileImg", values.imageUrl);
                }
                if (userInfo?._id) {
                    formData.append("userId", userInfo?._id);
                }
                const response = await updateProfileUser(formData).unwrap()
                console.log(response);

                setUserInfo({
                    ...userInfo!,
                    profileImg: response.profileImg
                });
            }
            toast.success(`Change your ${changeImageName} image`)
            const dialog = document.getElementById(modalId) as HTMLDialogElement | null;
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
    const deleteImageFunction = async () => {
        try {
            setLoading(true)
            const formData = new FormData()
            if (changeImageName.toLocaleLowerCase() == 'banner') {
                if (userInfo?._id) {
                    formData.append("userId", userInfo?._id);
                }
                formData.append("bannerImg", '');
                const response = await updateBannerUser(formData).unwrap()
                setUserInfo({
                    ...userInfo!,
                    bannerImg: response.bannerImg
                });
            } else if (changeImageName.toLocaleLowerCase() == 'profile') {
                if (userInfo?._id) {
                    formData.append("userId", userInfo?._id);
                }
                formData.append("profileImg", '');
                const response = await updateProfileUser(formData).unwrap()
                setUserInfo({
                    ...userInfo!,
                    profileImg: response.profileImg
                });
            }
            toast.success(`Delete your ${changeImageName} image`)
            const dialog = document.getElementById(modalId) as HTMLDialogElement | null;
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
        <ModalComponent
            id={modalId}
            title={`Change ${changeImageName}`}>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
            >
                {({ setFieldValue }) => {
                    useEffect(() => {
                        const dialog = document.getElementById(modalId) as HTMLDialogElement | null;
                        if (!dialog) return;

                        const handleClose = () => {
                            setChangeImageUrl("");
                            setFieldValue("imageUrl", null);
                        };

                        dialog.addEventListener("close", handleClose);
                        return () => dialog.removeEventListener("close", handleClose);
                    }, [setFieldValue]);
                    return (
                        <Form>
                            <fieldset className="w-full fieldset bg-base-200 border-base-300 rounded-box border p-4">
                                <legend className="fieldset-legend">{loading ? 'Processing' : changeImageName}</legend>
                                <div className='flex justify-center'>
                                    <div
                                        className={`${changeImageName.toLowerCase() == 'profile' ? 'w-[200px] h-[200px]' : 'w-full h-[170px]'} rounded hover:opacity-60 flex items-center justify-center text-gray-600 text-xl text-center transition-all duration-200 ease-in cursor-pointer`}
                                        style={{
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            backgroundImage: `url(${changeImageUrl ? changeImageUrl :
                                                changeImageName.toLowerCase() == 'banner' ? cloudinaryUrl + userInfo?.bannerImg :
                                                    cloudinaryUrl + userInfo?.profileImg})`,
                                        }}
                                        onClick={() => imageInputRef.current?.click()}
                                    >
                                        {(<GoPencil className="cursor-pointer text-white bg-gray-500/60 rounded-full p-2 text-4xl" />)}
                                        <input
                                            type="file"
                                            name="imageUrl"
                                            ref={imageInputRef}
                                            accept="image/*"
                                            style={{ display: "none" }}
                                            onChange={(e) => {
                                                const selectedFile = e.target.files?.[0];
                                                if (selectedFile) {
                                                    setChangeImageUrl(URL.createObjectURL(selectedFile));
                                                    setFieldValue("imageUrl", selectedFile);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                <button disabled={changeImageUrl.length === 0 || loading}
                                    className={`btn btn-outline btn-info my-2 hover:text-white ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                    Change {changeImageName}
                                </button>
                                <button onClick={() => deleteImageFunction()} type='button' disabled={loading} className={`btn btn-outline btn-error hover:text-white ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                    Delete {changeImageName}
                                </button>
                            </fieldset>
                        </Form>
                    )
                }}
            </Formik>
        </ModalComponent>
    )
}
