import { cloudinaryUrl } from '@/lib/urls';
import { UserRegister } from '@/types/userRegister.types';
import Link from 'next/link';
import React, { useRef } from 'react'
import { FaStar, FaUserEdit } from 'react-icons/fa';
import { GoTasklist } from "react-icons/go";
import { RiAdminLine, RiEdit2Line, RiImageEditLine } from 'react-icons/ri';
import { TbLockPassword } from 'react-icons/tb';
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { ErrorResponseData } from '@/types/catchError.types';
import { useLogoutUserMutation } from '@/lib/slices/usersSlice';
import { IoLogOutOutline } from 'react-icons/io5';

type MyComponentProps = {
    userInfo?: UserRegister | null;
    setUserInfo: (info: UserRegister | null) => void;
    setProfileImageUrl: React.Dispatch<React.SetStateAction<string>>;
    setBannerImageUrl: React.Dispatch<React.SetStateAction<string>>;
}
const ProfileHeader = ({ userInfo, setUserInfo, setProfileImageUrl, setBannerImageUrl }: MyComponentProps) => {
    const editRef = useRef<HTMLDivElement>(null)
    const route = useRouter()
    const { data: session } = useSession();
    const [logoutUser] = useLogoutUserMutation()
    // click dots
    const clickDots = () => {
        editRef.current?.classList.toggle("hidden");
    }
    const logOutFunction = async () => {
        if (session) {
            await nextAuthSignOut();
        } else {
            try {
                const response = await logoutUser({}).unwrap()
                setUserInfo(null)
                toast.success(response.message)
            } catch (error) {
                const err = error as FetchBaseQueryError;
                console.log("Failed: ", err);

                if ("data" in err && err.data) {
                    const serverData = err.data as ErrorResponseData;
                    toast.error(serverData.message || serverData.error || "Something went wrong");
                } else {
                    toast.error("Network or unexpected error");
                }
            }
        }
        route.push('/');
    }

    return (
        <div className="px-3">
            <div className="bg-[var(--component-bg)] min-w-64 rounded-xl">
                {/* profile images */}
                <div className="h-30 rounded-t-xl relative"
                    style={{
                        backgroundImage: `url(${cloudinaryUrl + userInfo?.bannerImg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className='absolute left-5 bottom-[-40px]'>
                        <div className='relative'>
                            <img src={cloudinaryUrl + userInfo?.profileImg} alt="profile" className="w-25 h-25 rounded-full border-4 border-white object-cover" />
                            <div onClick={() => {
                                const dialog = document.getElementById("my_modal_change_profile") as HTMLDialogElement | null;
                                dialog?.showModal();
                                setProfileImageUrl("")
                            }}
                                className='text-white p-1 rounded-full bg-gray-500/50 w-8 h-8 flex items-center justify-center absolute right-0 bottom-3 cursor-pointer'><RiImageEditLine /></div>
                        </div>
                    </div>
                    <div onClick={() => {
                        const dialog = document.getElementById("my_modal_change_banner") as HTMLDialogElement | null;
                        dialog?.showModal();
                        setBannerImageUrl("")
                    }}
                        className='text-white p-1 rounded-full bg-gray-500/50 w-8 h-8 flex items-center justify-center absolute right-2 top-2 cursor-pointer'><RiEdit2Line /></div>
                </div>

                {/* Məlumat hissəsi */}
                <div className="pt-10 px-5 pb-4 flex flex-col gap-1">
                    <div className='flex items-center justify-between p-1 relative'>
                        <h2 className="text-lg font-semibold">
                            {userInfo?.username}
                        </h2>
                        <div onClick={() => clickDots()}
                            className='cursor-pointer rounded-full p-1 w-8 h-8 flex items-center justify-center hover:bg-blue-400/20'>•••</div>
                        <div ref={editRef} className='bg-base-100 shadow-md p-2 rounded-xl absolute top-full right-0 hidden'>
                            <p onClick={() => {
                                const dialog = document.getElementById("my_modal_change_username") as HTMLDialogElement | null;
                                dialog?.showModal();
                            }}
                                className='flex items-center gap-2 p-1 rounded cursor-pointer hover:bg-blue-400/20'>
                                <span className=''><FaUserEdit /></span>
                                <span>Profile Edit</span>
                            </p>
                            <p onClick={() => {
                                const dialog = document.getElementById("my_modal_change_password") as HTMLDialogElement | null;
                                dialog?.showModal();
                            }}
                                className='flex items-center gap-2 p-1 rounded cursor-pointer hover:bg-blue-400/20'>
                                <span className=''><TbLockPassword /></span>
                                <span>Change Password</span>
                            </p>
                        </div>
                    </div>
                    <Link href="/favorites">
                        <p className='flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-blue-400/20'>
                            <span className='text-yellow-300'><FaStar /></span>
                            <span>Favorites</span>
                        </p>
                    </Link>
                    <Link href="/profile">
                        <p className='flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-blue-400/20'>
                            <span className='text-xl'><GoTasklist /></span>
                            <span>Profile</span>
                        </p>
                    </Link>
                    <Link href="/admin/dashboard">
                        <p className='flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-blue-400/20'>
                            <span className='text-xl'><RiAdminLine /></span>
                            <span>Admin page</span>
                        </p>
                    </Link>
                    <p onClick={() => logOutFunction()}
                        className='flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-blue-400/20'>
                        <span className='text-red-500'><IoLogOutOutline /></span>
                        <span>Log Out</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ProfileHeader