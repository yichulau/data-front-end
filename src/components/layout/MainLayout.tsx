import React from 'react'
import TopNavigation from './TopNavigation'
import Footer from './Footer'

const MainLayout = ({ children }: any) => {
  return (
    <>
    <div className="flex flex-col min-h-screen items-stretch">
      <TopNavigation />
      <div className="flex-grow bg-zinc-100 dark:bg-gray-900 text-black dark:text-zinc-50">
        <main className="flex-shrink-0 flex items-center justify-center mt-2 mb-2">{children}</main>
      </div>
      <div className="flex-shrink-0">
        <Footer />
      </div>
    </div>
  </>
  )
}

export default MainLayout