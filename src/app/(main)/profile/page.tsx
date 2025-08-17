'use client'
import { useMyContext } from '@/context/UserEmailContext';
import React from 'react';
import { cloudinaryUrl } from '@/lib/urls';
import { FaStar, FaUserEdit } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";


const tasks = [
  {
    id: 1,
    title: "Team Meeting",
    desc: "Lorem ipsum dolor sit amet, consectetur elit lddv nlorem idjsfjf.",
    time: "10:30 AM - 12:00 PM",
    color: "#c084fc",
  },
  {
    id: 2,
    title: "Work on Branding",
    desc: "Lorem ipsum dolor sit amet, consectetur elit lddv nlorem idjsfjf.",
    time: "10:30 AM - 12:00 PM",
    color: '#ff27e2',
  },
  {
    id: 3,
    title: "Make a Report for client",
    desc: "Lorem ipsum dolor sit amet, consectetur elit lddv nlorem idjsfjf.",
    time: "10:30 AM - 12:00 PM",
    color: "#28a745",
  },
  {
    id: 4,
    title: "Create a planer",
    desc: "Lorem ipsum dolor sit amet, consectetur elit lddv nlorem idjsfjf.",
    time: "10:30 AM - 12:00 PM",
    color: "#17a2b8",
  },
  {
    id: 5,
    title: "Create Treatment Plan",
    desc: "Lorem ipsum dolor sit amet, consectetur elit lddv nlorem idjsfjf.",
    time: "10:30 AM - 12:00 PM",
    color: "#ffc107",
  },
];

const UserProfile = () => {
  const { userInfo, isLoading } = useMyContext()
  console.log(userInfo);

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
            {/* Sidebar */}
            <aside className="px-3 ">
              <div className="bg-[var(--component-bg)] min-w-64 rounded-xl shadow-md overflow-hidden">
                <div className="h-40 relative"
                  style={{
                    backgroundImage: `url(${cloudinaryUrl + userInfo?.bannerImg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <img src={cloudinaryUrl + userInfo?.profileImg} alt="profile" className="w-24 h-24 rounded-full border-4 border-white absolute left-4 bottom-[-40px] object-cover" />
                </div>

                {/* Məlumat hissəsi */}
                <div className="pt-12 px-4 pb-4 flex flex-col gap-1">
                  <h2 className="text-lg font-semibold">
                    {userInfo?.username}
                  </h2>
                  <p className='flex items-center gap-2 p-1 rounded cursor-pointer hover:bg-blue-400/20'>
                    <span className='text-yellow-300'><FaStar /></span>
                    <span>Favorites</span>
                  </p>
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
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Todo List</h2>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
                    {/* <Plus className="w-4 h-4" />  */}
                    Add New List
                  </button>
                </div>
              </div>

              {/* Date & Tabs */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-4">
                  <button className="font-medium text-blue-600 border-b-2 border-blue-600">
                    Active Task
                  </button>
                  <button className="text-gray-500">Completed</button>
                </div>
              </div>

              {/* Task Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map((task) => (
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
            </main>
          </div>
        )
      }
    </>
  );
};

export default UserProfile;
