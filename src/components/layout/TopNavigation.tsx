import React,  { useContext, useEffect, useState } from 'react'
import Image from "next/image";
import {useRouter} from 'next/router'
import MyThemeContext from "../../store/myThemeContext";
import { FaMoon,FaSun } from 'react-icons/fa';
import Link from 'next/link'
import { MdOutlineArrowDropDown} from 'react-icons/md'
import { motion, AnimatePresence } from 'framer-motion';


const TopNavigation = () => {
    const router = useRouter()
    const themeCtx: { isDarkMode?: boolean; toggleThemeHandler: () => void } =
    useContext(MyThemeContext);
    const [darkMode, setDarkMode] = useState<String | null>(null);
    const [isOpenMenu, setIsOpenMenu] = useState(false)
    const [isOpenSubMenu, setIsSubMenu] = useState(false)

    function toggleThemeHandler(): void {
        themeCtx.toggleThemeHandler();
    }

    function toggleOptions(){
        setIsOpenMenu(!isOpenMenu)
    }

    function subMenu(){
        setIsSubMenu(!isOpenSubMenu)
    }




  useEffect(() => {
    const item = localStorage.getItem('isDarkTheme')
    setDarkMode(item)
  }, [darkMode])

  useEffect(() => {
    setIsOpenMenu(false) // reset menu state when page changes
    setIsSubMenu(false)
  }, [router.pathname]) // detect changes in router pathname
        

  return (
    <>
        <nav className="bg-white border-gray-200 dark:bg-black">
            <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl px-2 md:px-6 py-2.5">
                <Link href="/">
                    <div className="flex items-center">
                        <img src="/assets/ribbon-logo.png" className="h-6 mr-3 sm:h-9" alt="Ribbon Logo" />
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Ribbon Dashboard</span>
                    </div>
                </Link>
                <div className="flex items-center">
                    <button 
                        onClick={toggleOptions}
                    data-collapse-toggle="mobile-menu-2" type="button" className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu-2" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
                        <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </button>
                    <button className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
                        onClick={toggleThemeHandler}
                    >
                        {themeCtx.isDarkMode}
                          {themeCtx.isDarkMode ? <FaSun /> : <FaMoon />}
                    </button>

                </div>   
            </div>
        </nav>
        <AnimatePresence>
            {isOpenMenu ? (
                <motion.nav 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className={'block md:hidden bg-gray-50 dark:bg-gray-800'}>
                    <div className="max-w-screen-xl px-4 py-3 mx-auto md:px-6 ">
                        <div className="flex items-center">
                            <ul className='flex flex-col mt-0 mr-6 text-sm font-medium w-full'>
                                <li className={router.pathname == "/" ? "active bg-white dark:bg-gray-900 text-gra dark:text-white relative shadow rounded-md px-2 py-4" : "px-2 py-4"}>
                                    <Link href="/">
                                        <div className="text-gray-900 dark:text-white md:hover:underline" aria-current="page">Dashboard</div>
                                    </Link>
                                </li>
                                <li>
                                
                                    <button className="text-gray-900 dark:text-white md:hover:underline px-2 py-4"
                                        onClick={subMenu}
                                    >Activity <span className='inline-block'><MdOutlineArrowDropDown/></span></button>
                                    <AnimatePresence>
                                        {isOpenSubMenu? (
                                            <motion.div 
                                                className="flex-col"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
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
                                                
                                            </motion.div>

                                        ) : null}
                                    </AnimatePresence>
                                </li>
                                <li className={router.pathname == "/activity/recentTrade" ? "active bg-white dark:bg-gray-900 text-gra dark:text-white relative shadow rounded-md px-2 py-4" : "px-2 py-4"}>
                                    <Link href="/activity/recentTrade">
                                            <div className={`text-gray-900 dark:text-white md:hover:underline ${router.pathname === "/activity/recentTrade" ? `` : `` }`}>Recent Trade</div>
                                    </Link>
                                </li>
                                <li className={router.pathname == "/analysis/positionBuilder" ? "active bg-white dark:bg-gray-900 text-gra dark:text-white relative shadow rounded-md px-2 py-4" : "px-2 py-4"}>
                                    <Link href="/analysis/positionBuilder">
                                        <div className={`text-gray-900 dark:text-white md:hover:underline ${router.pathname === "/analysis/positionBuilder" ? `` : `` }`}>Payoff Calculator</div>
                                    </Link>
                                </li>
        
                            </ul>
                        </div>
                    </div>
                </motion.nav>
            ) : null}
        </AnimatePresence>
        <nav className="hidden md:block bg-gray-50 dark:bg-gray-800">
            <div className="max-w-screen-xl px-4 py-3 mx-auto md:px-6">
                <div className="flex items-center">
                    <ul className="flex flex-row mt-0 mr-6 space-x-1 md:space-x-6 text-sm font-medium">
                        <li className={router.pathname == "/" ? "active bg-white dark:bg-gray-900 text-gra dark:text-white relative shadow px-1 md:px-4 rounded-lg py-1 md:py-2" : "py-1 md:py-2 px-1 md:px-4"}>
                            <Link href="/">
                                <div className="text-gray-900 dark:text-white md:hover:underline" aria-current="page">Dashboard</div>
                            </Link>
                           
                        </li>
                        <li>
                       
                            <div className="peer text-gray-900 dark:text-white md:hover:underline px-1 py-1 md:px-2 md:py-2">Activity</div>
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
                        <li className={router.pathname == "/activity/recentTrade" ? "active bg-white dark:bg-gray-900 text-gra dark:text-white relative shadow px-1 md:px-4 rounded-lg py-1 md:py-2" : "py-1 md:py-2 px-1 md:px-4"}>
                            <Link href="/activity/recentTrade">
                                 <div className={`text-gray-900 dark:text-white md:hover:underline ${router.pathname === "/activity/recentTrade" ? `` : `` }`}>Recent Trade</div>
                            </Link>
                        </li>
                        <li className={router.pathname == "/analysis/positionBuilder" ? "active bg-white dark:bg-gray-900 text-gra dark:text-white relative shadow px-1 md:px-4 rounded-lg py-1 md:py-2" : "py-1 md:py-2 px-1 md:px-4"}>
                            <Link href="/analysis/positionBuilder">
                                <div className={`text-gray-900 dark:text-white md:hover:underline ${router.pathname === "/analysis/positionBuilder" ? `` : `` }`}>Payoff Calculator</div>
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