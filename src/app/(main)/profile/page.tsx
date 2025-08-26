'use client'
import { useMyContext } from '@/context/UserEmailContext';
import React, { useEffect, useRef, useState } from 'react';
import { cloudinaryUrl } from '@/lib/urls';
import { FaPlus } from "react-icons/fa";
import { Form, Formik } from 'formik';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { GoPencil } from 'react-icons/go';
import ScrollCategories from '@/components/User/Scroll Categories';
import ModalComponent from '@/components/Modal component';
import { ErrorResponseData } from '@/types/catchError.types';

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

interface ProfileInfo {
  profileImg: File | null,
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
  const [loading, setLoading] = useState<boolean>(false)

  const [bannerImageUrl, setBannerImageUrl] = useState<string>("");

  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const profileInputRef = useRef<HTMLInputElement>(null);

  const [mapTasks, setMapTasks] = useState<TaskType[]>([])


  //profile
  const initialValuesProfile: ProfileInfo = {
    profileImg: null,
  };
  const onSubmitProfile = async (values: ProfileInfo) => {
    try {
      setLoading(true)
      const formData = new FormData()
      if (values.profileImg) {
        formData.append("profileImg", values.profileImg);
      }
      if (userInfo?._id) {
        formData.append("userId", userInfo?._id);
      }
      const changeProfile = await axios.put('/api/users/put/updateprofileimage', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      console.log(changeProfile);
      setUserInfo({
        ...userInfo!,
        profileImg: changeProfile.data.profileImg
      });
      toast.success("Change your profile image")
      const dialog = document.getElementById("my_modal_change_profile") as HTMLDialogElement | null;
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

  const deleteProfileFunction = async () => {
    try {
      setLoading(true)
      const formData = new FormData()
      if (userInfo?._id) {
        formData.append("userId", userInfo?._id);
      }
      formData.append("profileImg", '');
      const changeProfile = await axios.put('/api/users/put/updateprofileimage', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      setUserInfo({
        ...userInfo!,
        profileImg: changeProfile.data.profileImg
      });
      toast.success("Delete your profile image")
      const dialog = document.getElementById("my_modal_change_profile") as HTMLDialogElement | null;
      dialog?.close();
    } catch (error) {
      const err = error as AxiosError;
      console.log('Change image failed: ', err);
      const data = err.response?.data as ErrorResponseData;
      const message = data?.message || data?.error || err.message;
      toast.error(message || 'Something went wrong');
    } finally {
      setLoading(false)
    }
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
    const filtertasks = tasks.filter(task => !task.isCompleted)
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
                    const filtertasks = tasks.filter(task => !task.isCompleted)
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
                    const filtertasks = tasks.filter(task => task.isCompleted)
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
          </div >
        )
      }
    </>
  );
};

export default UserProfile;
