import { useEffect, useState } from "react";
import { IoMoonOutline, IoSunny } from "react-icons/io5";

export default function ThemeButton() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light')

    useEffect(() => {
        const savedTheme = localStorage.getItem('todoTheme') as 'light' | 'dark' | null
        if (savedTheme) {
            setTheme(savedTheme)
            document.documentElement.setAttribute('data-theme', savedTheme)
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            const initialTheme = prefersDark ? 'dark' : 'light'
            setTheme(initialTheme)
            document.documentElement.setAttribute('data-theme', initialTheme)
        }
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        document.documentElement.setAttribute('data-theme', newTheme)
        localStorage.setItem('todoTheme', newTheme)
    }

    return (
        <button
            onClick={toggleTheme}
            title="theme"
            className="cursor-pointer text-xl rounded-full p-1 hover:bg-[var(--component-bg)]/50"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? <IoMoonOutline /> : <IoSunny />}
        </button>
    )
}