import { ErrorResponseData } from '@/app/(main)/profile/page';
import ModalComponent from '@/components/Modal component';
import { cloudinaryUrl } from '@/lib/urls';
import { UserRegister } from '@/types/userRegister.types';
import axios, { AxiosError } from 'axios';
import { Form, Formik } from 'formik';
import React, { useEffect, useRef } from 'react'
import toast from 'react-hot-toast';
import { GoPencil } from 'react-icons/go';

interface BannerInfo {
    bannerImg: File | null,
}
type MyComponentProps = {
    userInfo?: UserRegister | null;
    setUserInfo: (info: UserRegister | null) => void;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    bannerImageUrl: string;
    setBannerImageUrl: React.Dispatch<React.SetStateAction<string>>;
}
export const BannerChangeModal = ({ userInfo, setUserInfo, loading, setLoading, bannerImageUrl, setBannerImageUrl }: MyComponentProps) => {
    const bannerInputRef = useRef<HTMLInputElement>(null);
    // banner
    const initialValues: BannerInfo = {
        bannerImg: null,
    };
    const onSubmit = async (values: BannerInfo) => {
        console.log(values);
        try {
            setLoading(true)
            const formData = new FormData()
            if (values.bannerImg) {
                formData.append("bannerImg", values.bannerImg);
            }
            if (userInfo?._id) {
                formData.append("userId", userInfo?._id);
            }
            const changeBanner = await axios.put('/api/users/put/updatebannerimage', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            console.log(changeBanner);
            setUserInfo({
                ...userInfo!,
                bannerImg: changeBanner.data.bannerImg
            });
            toast.success("Change your banner image")
            const dialog = document.getElementById("my_modal_change_banner") as HTMLDialogElement | null;
            dialog?.close();
        } catch (error) {
            const err = error as AxiosError;
            console.log('Change banner failed: ', err);
            const data = err.response?.data as ErrorResponseData;
            const message = data?.message || data?.error || err.message;
            toast.error(message || 'Something went wrong');
        } finally {
            setLoading(false)
        }
    };
    const deleteBannerFunction = async () => {
        try {
            setLoading(true)
            const formData = new FormData()
            if (userInfo?._id) {
                formData.append("userId", userInfo?._id);
            }
            formData.append("bannerImg", '');
            const changeBanner = await axios.put('/api/users/put/updatebannerimage', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            setUserInfo({
                ...userInfo!,
                bannerImg: changeBanner.data.bannerImg
            });
            toast.success("Delete your banner image")
            const dialog = document.getElementById("my_modal_change_banner") as HTMLDialogElement | null;
            dialog?.close();
        } catch (error) {
            const err = error as AxiosError;
            console.log('Change banner failed: ', err);
            const data = err.response?.data as ErrorResponseData;
            const message = data?.message || data?.error || err.message;
            toast.error(message || 'Something went wrong');
        } finally {
            setLoading(false)
        }
    };
    return (
        <ModalComponent
            id='my_modal_change_banner'
            title='Change Banner'>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
            >
                {({ setFieldValue }) => {
                    useEffect(() => {
                        const dialog = document.getElementById("my_modal_change_banner") as HTMLDialogElement | null;
                        if (!dialog) return;

                        const handleClose = () => {
                            setBannerImageUrl("");
                            setFieldValue("bannerImg", null);
                        };

                        dialog.addEventListener("close", handleClose);
                        return () => dialog.removeEventListener("close", handleClose);
                    }, [setFieldValue]);
                    return (
                        <Form>
                            <fieldset className="w-full fieldset bg-base-200 border-base-300 rounded-box border p-4">
                                <legend className="fieldset-legend">{loading ? 'Processing' : 'Banner'}</legend>
                                <div>
                                    <div
                                        className="w-full h-[120px] rounded hover:opacity-60 flex items-center justify-center text-gray-600 text-xl text-center transition-all duration-200 ease-in cursor-pointer"
                                        style={{
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            backgroundImage: `url(${bannerImageUrl ? bannerImageUrl : cloudinaryUrl + userInfo?.bannerImg})`,
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
                                </div>

                                <button disabled={bannerImageUrl.length === 0 || loading}
                                    className={`btn btn-outline btn-info my-2 hover:text-white ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                    Change Banner
                                </button>
                                <button onClick={() => deleteBannerFunction()} type='button' disabled={loading} className={`btn btn-outline btn-error hover:text-white ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                    Delete Banner
                                </button>
                            </fieldset>
                        </Form>
                    )
                }}
            </Formik>
        </ModalComponent>
    )
}
