'use client'
import Image from 'next/image'
import React from 'react'
import Logo from '../../../images/TodoEast-Logo.png'
import { IoChatbubblesOutline, IoNotificationsOutline } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import ThemeButton from '../Theme';
import Link from 'next/link';
import { useMyContext } from '@/context/UserEmailContext';

const Navbar = () => {
  const route = useRouter()
  const { userInfo } = useMyContext()

  return (
    <div className='fixed w-full p-2 backdrop-blur-sm bg-base-100/50 border-b-[1px] border-b-[var(--component-bg)]/50 z-10'>
      <div className='mx-auto my-0 max-w-[1350px] flex items-center justify-between'>
        {/* logo */}
        <div className="container flex justify-between">
          <Link href={'/'}>
            <Image
              src={Logo}
              alt="Logo"
              className="object-cover cursor-pointer w-[150px]"
              layout="intrinsic"
            />
          </Link>
        </div>
        {/* buttons */}
        <div className='flex items-center justify-center text-2xl'>
          {
            userInfo?.username ? (
              <>
                <div className={`cursor-pointer rounded-full p-1 hover:bg-[var(--component-bg)]/50`} title='notification'>
                  <IoNotificationsOutline />
                </div>
                <div onClick={() => route.push('/chat')} className='cursor-pointer rounded-full p-1 hover:bg-[var(--component-bg)]/50' title='chat'>
                  <IoChatbubblesOutline />
                </div>
              </>
            ) : (
              <div className='text-sm font-semibold flex items-center justify-center'>
                <Link href={'/login'}><span className='cursor-pointer rounded-full py-1 px-2 hover:bg-[var(--component-bg)]/50'>Login</span></Link>
                <span>/</span>
                <Link href={'/signup'}><span className='cursor-pointer rounded-full py-1 px-2 hover:bg-[var(--component-bg)]/50'>SignUp</span></Link>
              </div>
            )
          }
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