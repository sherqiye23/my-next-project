'use client'
import Image from 'next/image'
import React from 'react'
import Logo from '../../../images/TodoEast-Logo.png'
import { IoChatbubblesOutline, IoNotificationsOutline } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import ThemeButton from '../Theme';

const Navbar = () => {
  const route = useRouter()

  return (
    <div className='fixed w-full p-2 backdrop-blur-sm bg-base-100/50 border-b-[1px] border-b-base-content/20'>
      <div className='mx-auto my-0 max-w-[1350px] flex items-center justify-between'>
        {/* logo */}
        <div className="container flex justify-between">
          <div>
            <Image
              src={Logo}
              alt="Logo"
              className="object-cover cursor-pointer w-[150px]"
              layout="intrinsic"
            />
          </div>
        </div>
        {/* buttons */}
        <div className='flex items-center justify-center gap-2 text-2xl'>
          <div className='cursor-pointer' title='notification'>
            <IoNotificationsOutline />
          </div>
          <div onClick={() => route.push('/chat')} className='cursor-pointer' title='chat'>
            <IoChatbubblesOutline />
          </div>
          <div>
            {/* theme button */}
            <ThemeButton />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar