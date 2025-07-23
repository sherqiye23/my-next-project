'use client'
import { useMyContext } from "@/context/UserEmailContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
      </div>
    </>
  );
}
