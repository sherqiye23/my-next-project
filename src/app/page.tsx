'use client'
import { useMyContext } from "@/context/UserEmailContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CldImage, CldUploadButton } from 'next-cloudinary';

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
          const id = '687e4fd65447202cdb4b6fee'
          const role = 'true'
          const response = await axios.put(`/api/users/put/updaterole?userId=${id}&role=${role}`, null, { withCredentials: true })
          console.log(response);

        }}>change role</button>
      </div>
    </>
  );
}
