import React,  { useContext, useEffect, useState } from 'react'
import Image from "next/image";
import { useRouter } from "next/router";
import MyThemeContext from "../../store/myThemeContext";
import { FaMoon,FaSun } from 'react-icons/fa';
import Link from 'next/link'


const TopNavigation = () => {
    const themeCtx: { isDarkMode?: boolean; toggleThemeHandler: () => void } =
    useContext(MyThemeContext);
    const [darkMode, setDarkMode] = useState<String | null>(null);

    function toggleThemeHandler(): void {
        themeCtx.toggleThemeHandler();
    }


  useEffect(() => {
    const item = localStorage.getItem('isDarkTheme')
    setDarkMode(item)
  }, [darkMode])


  return (
    <>
        <nav className="bg-white border-gray-200 dark:bg-black">
            <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl px-4 md:px-6 py-2.5">
                <Link href="/">
                    <div className="flex items-center">
                        <img src="/assets/ribbon-logo.png" className="h-6 mr-3 sm:h-9" alt="Ribbon Logo" />
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Ribbon Dashboard</span>
                    </div>
                </Link>
                <div className="flex items-center">
                    <button className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
                        onClick={toggleThemeHandler}
                    >
                        {darkMode ? ( <FaSun /> ): ( <FaMoon /> )}
                       
                    </button>
                </div>
            </div>
        </nav>
        <nav className="bg-gray-50 dark:bg-gray-800">
            <div className="max-w-screen-xl px-4 py-3 mx-auto md:px-6">
                <div className="flex items-center">
                    <ul className="flex flex-row mt-0 mr-6 space-x-8 text-sm font-medium">
                        <li>
                            <Link href="/">
                                <div className="text-gray-900 dark:text-white hover:underline" aria-current="page">Dashboard</div>
                            </Link>
                           
                        </li>
                        <li>
                       
                            <div className="peer text-gray-900 dark:text-white hover:underline">Activity</div>
                            <div className="hidden peer-hover:flex hover:flex
                            w-[200px]
                            flex-col bg-white drop-shadow-lg absolute z-50 dark:bg-black">
                                <Link href="/options/strike">
                                     <div className="px-5 py-3 hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-white" >Options OI By Strike</div>
                                </Link>
                                <Link href="/options/strikeVol">
                                     <div className="px-5 py-3 hover:bg-gray-200 dark:hover:bg-gray-800  dark:text-white" >Options OI Volume By Strike</div>
                                </Link>
                                <Link href="/options/expiry">
                                    <div className="px-5 py-3 hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-white">Options OI By Expiry</div>
                                </Link>
                                <Link href="/options/expiryVol">
                                    <div className="px-5 py-3 hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-white">Options OI Volume By Expiry</div>
                                </Link>
                            </div>
                        </li>
                        <li>
                            <Link href="/analysis/positionBuilder">
                                <div  className="text-gray-900 dark:text-white hover:underline">Payoff Calculator</div>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </>
  )
}

export default TopNavigation