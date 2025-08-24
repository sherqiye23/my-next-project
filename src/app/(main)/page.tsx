'use client'
import { FaRegStar, FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import '../globals.css'
import { useGetAllCategoryQuery } from "@/lib/slices/categorySlice";
import { useMyContext } from "@/context/UserEmailContext";
import { cloudinaryUrl } from "@/lib/urls";
import { useRouter } from "next/navigation";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

interface ErrorResponseData {
  message?: string;
  error?: string;
}
interface FakeCategory {
  name: string,
  color: string
}

export default function Home() {
  const { userInfo, setUserInfo, isLoading } = useMyContext()
  const { data: session } = useSession();
  const route = useRouter()

  const { data, isLoading: categoryLoading, isError, error } = useGetAllCategoryQuery()
  useEffect(() => {
    if (isError) {
      console.log(error);
    }
  })
  const [activeCategory, setActiveCategory] = useState<number>(0)
  const getTodoListsByCategory = (id: number) => {
    setActiveCategory(id);
  }

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

  return (
    <div className="h-[170vh]">
      {
        isLoading ? (
          <span className="loading loading-spinner text-[#FD6406] fixed top-[50%] left-[50%] "></span>
        ) : (
          <div className="grid grid-cols-[1fr_4fr_1fr] gap-2">
            <div className="w-full flex flex-col gap-2 bg-[var(--component-bg)] h-[50vh] rounded-xl p-5">
              <button className="px-3 py-1 rounded-xl bg-red-500 text-white cursor-pointer" onClick={() => logOutFunction()}>LogOut</button>
              <Link href={'/profile'}>
                <button className="px-3 py-1 rounded-xl bg-blue-400 text-white cursor-pointer">Profile</button>
              </Link>
            </div>
            <div className="w-full flex flex-col gap-2">
              <div>
                <input type="search" name="search" id="search" placeholder="Search todo list"
                  className="p-2 rounded-xl bg-[var(--component-bg)] outline-none border-2 border-[var(--component-bg)] border-solid focus:border-[#b1caff91]" />
              </div>
              {
                fakeCate.map((category, i) => (
                  <div key={i} className="bg-[var(--component-bg)] rounded-xl">
                    <div className="rounded-xl p-3 border-2"
                      style={{ borderColor: category.color }}>

                      <div className="flex items-center gap-3 justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-[25px] h-[25px] rounded-full">
                            <img src={cloudinaryUrl + userInfo?.profileImg} alt="profile" className="w-full h-full rounded-full object-cover" />
                          </div>
                          <span>{userInfo?.username}</span>
                          <span className="opacity-50 text-[13px]">11 Aug 2025</span>
                        </div>
                        <span className="text-[13px] font-semibold rounded-xl px-2"
                          style={{ backgroundColor: `${category.color}20` }}>
                          {category.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 justify-between mt-2">
                        <div className="flex items-center gap-3">
                          <span className="text-yellow-300 cursor-pointer">{
                            i % 2 == 0 ? <FaRegStar /> : <FaStar />
                          }</span>
                          <span className="text-lg font-semibold">Todo list title</span>
                        </div>
                        <span className="cursor-pointer">•••</span>
                      </div>

                    </div>
                    <div className="py-3 px-5 relative border-b-2 border-r-2 border-l-2 rounded-bl-xl rounded-br-xl cursor-pointer"
                      style={{
                        borderColor: category.color,
                      }}>
                      See all comments
                      <span className="absolute h-[13px] w-[1px] bottom-full left-full"
                        style={{
                          backgroundColor: category.color
                        }}></span>
                      <span className="absolute h-[13px] w-[1px] bottom-full right-full"
                        style={{
                          backgroundColor: category.color
                        }}></span>
                    </div>
                  </div>
                ))
              }
            </div>
            <div className="w-full bg-[var(--component-bg)] rounded-xl p-5 max-h-fit">
              <div>
                {
                  categoryLoading ? (
                    <div>...loading</div>
                  ) : (
                    <div>
                      <div className={`p-2 rounded-xl cursor-pointer ${activeCategory == 0 ? `font-semibold` : ''}`}
                        style={{
                          backgroundColor: activeCategory == 0 ? `#c084fc20` : '',
                          color: activeCategory == 0 ? `#c084fc` : '',
                        }}
                        onClick={() => getTodoListsByCategory(0)}>
                        All
                      </div>
                      {
                        data?.map((category) => (
                          <div className={`p-2 rounded-xl cursor-pointer ${activeCategory == category._id ? `font-semibold` : ''}`}
                            style={{
                              backgroundColor: activeCategory == category._id ? `${category.color}20` : '',
                              color: activeCategory == category._id ? `${category.color}` : '',
                            }}
                            onClick={() => getTodoListsByCategory(category._id)} key={category._id}>
                            {category.name}
                          </div>
                        ))
                      }
                      <div className={`p-2 rounded-xl cursor-pointer ${activeCategory == -1 ? `font-semibold` : ''}`}
                        style={{
                          backgroundColor: activeCategory == -1 ? `#87CEEB20` : '',
                          color: activeCategory == -1 ? `#87CEEB` : '',
                        }}
                        onClick={() => getTodoListsByCategory(-1)}>
                        Other
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}
