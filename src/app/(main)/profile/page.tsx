'use client'
import { useMyContext } from '@/context/UserEmailContext';
import React, { useEffect, useRef, useState } from 'react';
import { cloudinaryUrl } from '@/lib/urls';
import { FaPlus, FaStar, FaUserEdit } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";
import { RiEdit2Line, RiImageEditLine } from "react-icons/ri";
import Link from 'next/link';
import { Form, Formik } from 'formik';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { GoPencil } from 'react-icons/go';
import ScrollCategories from '@/components/User/Scroll Categories';

export interface FakeCategory {
  name: string,
  color: string
}

export interface TaskType {
  id: number,
  title: string,
  desc: string,
  time: string,
  color: string,
  isCompleted: boolean
}

const tasks: TaskType[] = [
  {
    id: 1,
    title: "Team Meeting",
    desc: "Lorem ipsum dolor sit amet, consectetur elit lddv nlorem idjsfjf.",
    time: "10:30 AM - 12:00 PM",
    color: "#c084fc",
    isCompleted: false
  },
  {
    id: 2,
    title: "Work on Branding",
    desc: "Lorem ipsum dolor sit amet, consectetur elit lddv nlorem idjsfjf.",
    time: "10:30 AM - 12:00 PM",
    color: '#ff27e2',
    isCompleted: false
  },
  {
    id: 3,
    title: "Make a Report for client",
    desc: "Lorem ipsum dolor sit amet, consectetur elit lddv nlorem idjsfjf.",
    time: "10:30 AM - 12:00 PM",
    color: "#28a745",
    isCompleted: true
  },
  {
    id: 4,
    title: "Create a planer",
    desc: "Lorem ipsum dolor sit amet, consectetur elit lddv nlorem idjsfjf.",
    time: "10:30 AM - 12:00 PM",
    color: "#17a2b8",
    isCompleted: true
  },
  {
    id: 5,
    title: "Create Treatment Plan",
    desc: "Lorem ipsum dolor sit amet, consectetur elit lddv nlorem idjsfjf.",
    time: "10:30 AM - 12:00 PM",
    color: "#ffc107",
    isCompleted: false
  },
];

const fakeCate: FakeCategory[] = [
  {
    name: 'All',
    color: '#c084fc'
  },
  {
    name: 'Work',
    color: '#ff27e2'
  },
  {
    name: 'Shopping',
    color: '#28a745'
  },
  {
    name: 'School',
    color: '#17a2b8'
  },
  {
    name: 'Personal',
    color: '#ffc107'
  },
  {
    name: 'Birthday',
    color: '#20c997'
  },
  {
    name: 'Travel',
    color: '#fd7e14'
  },
  {
    name: 'Other',
    color: '#2563EB'
  }
]

const UserProfile = () => {
  const { userInfo, setUserInfo, isLoading } = useMyContext()
  const editRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [bannerImageUrl, setBannerImageUrl] = useState<string>("");
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [mapTasks, setMapTasks] = useState<TaskType[]>([])
  interface ErrorResponseData {
    message?: string;
    error?: string;
  }
  interface SignInfo {
    bannerImg: File | null,
  }
  const initialValues: SignInfo = {
    bannerImg: null,
  };
  const onSubmit = async (values: SignInfo) => {
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

  const clickDots = () => {
    editRef.current?.classList.toggle("hidden");
  }

  // buttons
  const [activeTab, setActiveTab] = useState("active");

  const handleFilter = (type: string) => {
    if (type === "active") {
      setMapTasks(tasks.filter(task => !task.isCompleted));
      setActiveTab("active");
    } else {
      setMapTasks(tasks.filter(task => task.isCompleted));
      setActiveTab("completed");
    }
  };

  // map tasks
  useEffect(() => {
    let filtertasks = tasks.filter(task => !task.isCompleted)
    setMapTasks(filtertasks)
  }, [tasks])


  return (
    <>
      {
        isLoading ? (
          <div className="flex min-h-[89vh] mx-auto my-0 max-w-[1350px]">
            <div className='absolute top-[50%] left-[50%]'>
              <span className="loading loading-spinner text-warning"></span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col min-h-[100vh] mx-auto my-0 max-w-[1350px]">
            {/* profile header */}
            <div className="px-3">
              <div className="bg-[var(--component-bg)] min-w-64 rounded-xl shadow-md">
                {/* profile images */}
                <div className="h-45 rounded-t-xl relative"
                  style={{
                    backgroundImage: `url(${cloudinaryUrl + userInfo?.bannerImg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className='absolute left-5 bottom-[-50px]'>
                    <div className='relative'>
                      <img src={cloudinaryUrl + userInfo?.profileImg} alt="profile" className="w-30 h-30 rounded-full border-4 border-white object-cover" />
                      <div className='text-white p-1 rounded-full bg-gray-500/50 w-8 h-8 flex items-center justify-center absolute right-0 bottom-3 cursor-pointer'><RiImageEditLine /></div>
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
                <div className="pt-15 px-5 pb-4 flex flex-col gap-1">
                  <div className='flex items-center justify-between p-1 relative'>
                    <h2 className="text-lg font-semibold">
                      {userInfo?.username}
                    </h2>
                    <div onClick={() => clickDots()}
                      className='cursor-pointer rounded-full p-1 w-8 h-8 flex items-center justify-center hover:bg-blue-400/20'>•••</div>
                    <div ref={editRef} className='bg-base-100 shadow-md p-2 rounded-xl absolute top-full right-0 hidden'>
                      <p className='flex items-center gap-2 p-1 rounded cursor-pointer hover:bg-blue-400/20'>
                        <span className=''><FaUserEdit /></span>
                        <span>Profile Edit</span>
                      </p>
                      <p className='flex items-center gap-2 p-1 rounded cursor-pointer hover:bg-blue-400/20'>
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
                </div>
              </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6 gap-4">
                <ScrollCategories fakeCate={fakeCate} />
                <div className="flex items-center gap-2">
                  <button className="whitespace-nowrap flex items-center gap-1 border border-blue-500 border-solid bg-blue-500 hover:bg-transparent text-white hover:text-base-content px-3 py-1 rounded-md text-sm cursor-pointer">
                    <FaPlus />
                    Add New List
                  </button>
                </div>
              </div>
              {/* Date & Tabs */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-4">
                  <button onClick={() => {
                    let filtertasks = tasks.filter(task => !task.isCompleted)
                    setMapTasks(filtertasks)
                    handleFilter("active")
                  }}
                    className={`cursor-pointer font-medium border-b-2 ${activeTab === "active"
                      ? "text-blue-500 border-blue-500"
                      : "border-base-100"
                      }`}>
                    Active Task
                  </button>
                  <button onClick={() => {
                    let filtertasks = tasks.filter(task => task.isCompleted)
                    setMapTasks(filtertasks)
                    handleFilter("completed")
                  }}
                    className={`cursor-pointer font-medium border-b-2 ${activeTab === "completed"
                      ? "text-blue-500 border-blue-500"
                      : "border-base-100"
                      }`}>Completed</button>
                </div>
              </div>

              {/* Task Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mapTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`px-5 py-3 rounded-xl shadow-sm`}
                    style={{
                      backgroundColor: `${task.color}30`,
                      color: `${task.color}`
                    }}
                  >
                    <div className='flex items-center justify-between'>
                      <span className="text-[13px] font-semibold rounded-xl px-2"
                        style={{ backgroundColor: `${task.color}20` }}>
                        Work
                      </span>
                      <span className="cursor-pointer text-base-content">•••</span>
                    </div>
                    <h4 className="font-semibold my-2 text-base-content">{task.title}</h4>
                    <span className="text-xs block">{task.time}</span>
                  </div>
                ))}
              </div>
            </main >

            {/* modalssss */}
            <dialog id="my_modal_change_banner" className="modal">
              <div className="modal-box">
                <form method="dialog">
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
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
                              className="w-full h-[150px] rounded hover:opacity-60 flex items-center justify-center text-gray-600 text-xl text-center transition-all duration-200 ease-in cursor-pointer"
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

                          <button disabled={loading} className={`btn btn-outline btn-info my-2 hover:text-white ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                            Change Banner
                          </button>
                        </fieldset>
                      </Form>
                    )
                  }}
                </Formik>
              </div>
            </dialog>
          </div >
        )
      }
    </>
  );
};

export default UserProfile;
