import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Footer = () => {
  return (
    <footer className="bg-white shadow sm:flex sm:items-center sm:justify-between p-4 sm:p-6 xl:p-8 dark:bg-black">
        <p className="mb-4 text-sm text-center text-gray-500 dark:text-gray-400 sm:mb-0">
            &copy; 2022-2023 <a href="#" className="hover:underline" target="_blank">Ribbon Dashboard</a>. All rights reserved.
        </p>
    </footer>
  )
}

export default Footer