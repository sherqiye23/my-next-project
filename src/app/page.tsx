'use client'
import { useMyContext } from "@/context/UserEmailContext";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ThemeButton from "@/components/User/Theme";
import Logo from '../images/TodoEast-Logo.png'
import Image from "next/image";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";

interface ErrorResponseData {
  message?: string;
  error?: string;
}

export default function Home() {
  const { userInfo, setUserInfo, isLoading } = useMyContext()
  const { data: session } = useSession();
  const route = useRouter()

  const logOutFunction = async () => {
    if (session) {
      await nextAuthSignOut();
    } else {
      try {
        const response = await axios.post('/api/users/post/logout', {})
        setUserInfo(null)
        toast.success(response.data.message)
      } catch (error) {
        const err = error as AxiosError;
        console.log('Logout failed: ', err);
        const data = err.response?.data as ErrorResponseData;
        const message = data?.message || data?.error || err.message;
        toast.error(message || 'Something went wrong');
      }
    }
    route.push('/');
  }
  console.log(userInfo);

  return (
    <div>
      {/* logo */}
      <div className="container flex justify-between p-5">
        <div>
          <Image
            src={Logo}
            alt="Logo"
            className="object-cover cursor-pointer w-[150px]"
            layout="intrinsic"
          />
        </div>
      </div>

      <div>
        {/* user signup logout */}
        {
          isLoading ? (
            <h1 className="text-purple-400">...loading</h1>
          ) : (
            userInfo?.username ? (
              <div className="flex flex-col">
                <span>Hello {userInfo?.username}!</span>
                <button className='btn btn-accent w-[100px]' onClick={() => logOutFunction()}>Logout</button>
              </div>
            ) : (
              <div className="flex flex-col">
                <span>Hello User!</span>
                <button className='btn btn-accent w-[100px]' onClick={() => route.push('/signup')}>Signup</button>
              </div>
            )
          )
        }

        {/* theme button */}
        <ThemeButton />

      </div>
    </div>
  );
}
