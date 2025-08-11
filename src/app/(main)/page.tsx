'use client'
import { FaRegStar, FaStar } from "react-icons/fa";
import { useState } from "react";
import '../globals.css'

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<number>(0)
  const getTodoListsByCategory = (id: number) => {
    setActiveCategory(id);
  }
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
  return (
    <div className="h-[170vh]">
      <div className="grid grid-cols-[1fr_3fr_1fr] gap-2">
        <div className="w-full bg-[var(--component-bg)] h-[50vh] rounded-xl p-5">a</div>
        <div className="w-full flex flex-col gap-2">
          <div>
            <input type="search" name="search" id="search" placeholder="Search todo list"
              className="p-2 rounded-xl bg-[var(--component-bg)] outline-none border-2 border-[var(--component-bg)] border-solid focus:border-[#b1caff91]" />
          </div>
          {
            fakeCate.map((category, i) => (
              <div key={i} className="bg-[var(--component-bg)] rounded-xl">
                <div className="rounded-xl p-3 border-2"
                  style={{
                    borderColor: category.color
                  }}>
                  <span className="text-[13px] font-semibold rounded-xl px-2"
                    style={{
                      backgroundColor: `${category.color}20`
                    }}>{category.name}</span>
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
                <div className="py-3 px-5 relative border-b-2 border-r-2 border-l-2 border-[#ff27e2] rounded-bl-xl rounded-br-xl cursor-pointer"
                  style={{
                    borderColor: category.color,
                  }}>
                  See all comments
                  <span className="absolute h-[13px] w-[2px] bottom-full left-full"
                    style={{
                      backgroundColor: category.color
                    }}></span>
                  <span className="absolute h-[13px] w-[2px] bottom-full right-full"
                    style={{
                      backgroundColor: category.color
                    }}></span>
                </div>
              </div>
            ))
          }
        </div>
        <div className="w-full bg-[var(--component-bg)] rounded-xl p-5">
          <div>
            {
              fakeCate.map((category, i) => (
                <div className={`p-2 rounded-xl cursor-pointer ${activeCategory == i ? `font-semibold` : ''}`}
                  style={{
                    backgroundColor: activeCategory == i ? `${category.color}20` : '',
                    color: activeCategory == i ? `${category.color}` : '',
                  }}
                  onClick={() => getTodoListsByCategory(i)} key={i}>
                  {category.name}
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
