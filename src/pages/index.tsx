import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import BarChart from '../components/charting/BarChart'
import NoSSR from 'react-no-ssr'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Ribbon Dashboard</title>
        <meta name="description" content="Ribbon Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col justify-center items-center">
        <div className='flex flex-row'>
          <NoSSR>
          <BarChart />
          </NoSSR>
        
        </div> 
 
      </main>
    </div>
  )
}

export default Home
