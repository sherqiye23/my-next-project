'use client'
import { FaRegStar, FaStar } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import '../globals.css'
import { useGetAllCategoryQuery } from "@/lib/slices/categorySlice";
import { useMyContext } from "@/context/UserEmailContext";
import { cloudinaryUrl } from "@/lib/urls";
import { useRouter } from "next/navigation";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import ProfileHeader from "@/components/User/User Profile components/ProfileHeader";
import { BannerAndProfileChangeModal } from "@/components/User/User Profile components/Profile Modals/BannerAndProfileChangeModal";
import { ErrorResponseData } from "@/types/catchError.types";
import ModalComponent from "@/components/Modal component";
import CustomFormik from "@/components/Form components";
import * as Yup from 'yup';
import { useUpdateUsernameUserMutation } from "@/lib/slices/usersSlice";

interface FakeCategory {
  name: string,
  color: string
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

export default function Home() {
  const { userInfo, setUserInfo, isLoading } = useMyContext()
  const { data: session } = useSession();
  const route = useRouter()
  const [updateUsernameUser] = useUpdateUsernameUserMutation()
  const [loading, setLoading] = useState<boolean>(false)
  const [bannerImageUrl, setBannerImageUrl] = useState<string>("");
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [changeUsername, setChangeUsername] = useState<string>("");
  console.log(changeUsername);

  const initialValues = [
    { key: 'username', value: userInfo?.username },
  ]
  const fields = [
    {
      placeholder: 'Enter username',
      type: 'text',
      name: 'username',
      title: 'Username'
    },
  ]
  const validationSchema = Yup.object({
    username: Yup.string().trim().required('Username is required').max(30, "max 30 characters")
  });
  type FormValues = Yup.InferType<typeof validationSchema>;

  const changeUsernameSubmit = async (values: FormValues) => {
    if (values.username !== userInfo?.username) {
      setLoading(true)
      const response = await updateUsernameUser({
        username: values.username,
        userId: userInfo?._id
      }).unwrap()
      setUserInfo({
        ...userInfo!,
        username: response.username
      });
      toast.success(`Change your username`)
    }
    const dialog = document.getElementById('my_modal_change_username') as HTMLDialogElement | null;
    dialog?.close();
    setChangeUsername('')
  }

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
    <div>
      {
        isLoading ? (
          <span className="loading loading-spinner text-[#FD6406] fixed top-[50%] left-[50%] "></span>
        ) : (
          <div className="grid grid-cols-[1fr_4fr_1fr] gap-2">
            <div>
              <ProfileHeader
                userInfo={userInfo}
                setChangeUsername={setChangeUsername}
                setBannerImageUrl={setBannerImageUrl}
                setProfileImageUrl={setProfileImageUrl} />
              <BannerAndProfileChangeModal
                modalId="my_modal_change_banner"
                changeImageName="Banner"
                userInfo={userInfo}
                setUserInfo={setUserInfo}
                loading={loading}
                setLoading={setLoading}
                setChangeImageUrl={setBannerImageUrl}
                changeImageUrl={bannerImageUrl}
              />
              <BannerAndProfileChangeModal
                modalId="my_modal_change_profile"
                changeImageName="Profile"
                userInfo={userInfo}
                setUserInfo={setUserInfo}
                loading={loading}
                setLoading={setLoading}
                setChangeImageUrl={setProfileImageUrl}
                changeImageUrl={profileImageUrl}
              />
              <ModalComponent
                id="my_modal_change_username"
                title="Change Username">
                <CustomFormik
                  loading={loading}
                  setLoading={setLoading}
                  formName='Username'
                  buttonText='Change Username'
                  initialValues={initialValues}
                  fields={fields}
                  validationSchema={validationSchema}
                  onSubmitFunction={changeUsernameSubmit} />

              </ModalComponent>
            </div>
            <div className="w-full flex flex-col gap-2 pb-5">
              <div className="flex gap-2 items-center">
                <input type="search" name="search" id="search" placeholder="Search todo list"
                  className="p-2 rounded-xl bg-[var(--component-bg)] outline-none border-2 border-[var(--component-bg)] border-solid focus:border-[#b1caff91]" />
                <button className="px-3 w-[100px] py-1 rounded-xl bg-red-500 text-white cursor-pointer" onClick={() => logOutFunction()}>LogOut</button>
                <Link href={'/profile'}>
                  <button className="px-3 py-1 rounded-xl bg-blue-400 text-white cursor-pointer">Profile</button>
                </Link>
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
                    <div className="py-3 px-5 relative rounded-bl-xl rounded-br-xl cursor-pointer"
                      style={{
                        borderBottomWidth: '2px',
                        borderLeftWidth: '2px',
                        borderRightWidth: '2px',
                        borderColor: category.color,
                      }}>
                      See all comments
                      <span className="absolute bottom-full left-full"
                        style={{
                          width: '2px',
                          height: '13px',
                          backgroundColor: category.color
                        }}></span>
                      <span className="absolute bottom-full right-full"
                        style={{
                          width: '1.5px',
                          height: '13px',
                          backgroundColor: category.color
                        }}></span>
                    </div>
                  </div>
                ))
              }
            </div>
            <div className="bg-[var(--component-bg)] rounded-xl p-5 max-h-fit sticky top-[80px] self-start h-[fit-content]">
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
    </div >
  );
}
