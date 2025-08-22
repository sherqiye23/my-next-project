import { FakeCategory } from '@/app/(main)/profile/page';
import React, { useRef, useState } from 'react'
import { FaPlus } from 'react-icons/fa';

type MyComponentsType = {
    fakeCate: FakeCategory[]
}
const ScrollCategories = ({ fakeCate }: MyComponentsType) => {
    // scroll categories
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDown(true);
        setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
        setScrollLeft(scrollRef.current?.scrollLeft || 0);
    };

    const handleMouseLeave = () => {
        setIsDown(false);
    };

    const handleMouseUp = () => {
        setIsDown(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
        const walk = (x - startX) * 1.0;
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollLeft - walk;
        }
    };
    return (
        <>
            <div ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className="overflow-x-scroll flex gap-3 no-scrollbar cursor-grab select-none">
                {/* Dynamic categories */}
                {fakeCate?.map((category, i) => (
                    <div
                        onClick={() => console.log(category.name)}
                        className="px-3 py-1 rounded-xl cursor-pointer text-sm"
                        style={{
                            backgroundColor: `${category.color}20`,
                            color: category.color,
                        }}
                        key={i}
                    >
                        {category.name}
                    </div>
                ))}
                {fakeCate?.map((category, i) => (
                    <div
                        onClick={() => console.log(category.name)}
                        className="px-3 py-1 rounded-xl cursor-pointer text-sm"
                        style={{
                            backgroundColor: `${category.color}20`,
                            color: category.color,
                        }}
                        key={i}
                    >
                        {category.name}
                    </div>
                ))}
            </div>
        </>
    )
}

export default ScrollCategories