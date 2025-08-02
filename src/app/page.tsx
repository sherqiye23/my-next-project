'use client'
import { useMyContext } from "@/context/UserEmailContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CldImage, CldUploadButton } from 'next-cloudinary';
import ThemeButton from "@/components/User/Theme";
import Logo from '../images/TodoEast-Logo.png'
import Image from "next/image";
import { GoPencil } from "react-icons/go";
import Head from "next/head";

export default function Home() {
  const { userInfo, setUserInfo, isLoading } = useMyContext()
  const route = useRouter()
  const logOutFunction = async () => {
    try {
      const response = await axios.post('/api/users/post/logout', {})
      setUserInfo(null)
      toast.success(response.data.message)
    } catch (err: any) {
      console.log(err);
      toast.error('Failed logout')
    }
  }
  console.log(userInfo);

  return (
    <>
      <div className="container flex justify-between p-5">
        {/* <Head>
          <title>My page title</title>
          <link rel="shortcut icon" href='../images/TodoEast-Logo.png' type="image/png" />
        </Head> */}
        <div>
          <Image
            src={Logo}
            alt="Logo"
            className="object-cover cursor-pointer w-[150px]"
            layout="intrinsic"
          />
        </div>
      </div>
      selamunaleykum dunya

      <div>
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
        <div>

          <CldUploadButton
            uploadPreset="preset_name"
            onSuccess={(result: any) => {
              console.log("Success ilə:", result);
              console.log('Backende post atacagin: ', result.info.path);
            }}
          >
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Şəkil Yüklə
            </button>
          </CldUploadButton>

        </div>

        <button className="bg-red-400" onClick={async () => {
          const id = userInfo?.id
          const oldPassword = 'User123!'
          const newPassword = 'User123!'
          const confirmPassword = 'User123!'
          const response = await axios.put(`/api/users/put/updatepassword?userId=${id}&oldPassword=${oldPassword}&newPassword=${newPassword}&confirmPassword=${confirmPassword}`, null, { withCredentials: true })
          console.log(response);

        }}>change password</button>

        <ThemeButton />

        <button className="bg-red-500 cursor-not-allowed p-2 rounded" onClick={() => console.log('Hello')}>salam</button>


      </div>
    </>
  );
}
